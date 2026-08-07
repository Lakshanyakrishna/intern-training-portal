import {
  createNotification,
  getNotificationTemplate,
  getUser,
  createEmailLog,
  getNotificationPreferences,
} from './db';
import { requireSupabase } from './supabase';
import type { AuthUser } from '../types';

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string): string => vars[key] ?? `{{${key}}}`);
}

// Templates store the email body as HTML (`<p>...</p>`), which is correct
// for the actual email but wrong for the in-app notification list -- that
// renders as plain text, so without this the tags show up literally.
// Exported so the two notification display components can apply it
// defensively to rows written before this existed.
export function stripHtml(html: string): string {
  return html
    .replace(/<\/p>\s*<p>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function notifyEvent(
  eventType: string,
  recipientId: string,
  vars: Record<string, string>,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const template = await getNotificationTemplate(eventType);

  if (!template) {
    await createNotification({
      recipientId,
      eventType,
      title: eventType,
      message: eventType,
      metadata,
    });
    return;
  }

  const title = renderTemplate(template.inAppTemplate ?? '', vars);
  const emailBody = renderTemplate(template.emailBody ?? '', vars);

  await createNotification({
    recipientId,
    eventType,
    title,
    message: stripHtml(emailBody),
    metadata,
  });

  // No row means the user has never touched Notification Settings -- that's
  // not an opt-out, it's the unset state, and notification_preferences.
  // email_enabled defaults to TRUE at the column level. Only an existing
  // row with emailEnabled explicitly false should suppress sending; a
  // missing row must not be treated as "disabled" or real applicants (who
  // never visit Settings before their first notification fires) get none.
  const prefs = await getNotificationPreferences(recipientId);
  if (prefs && !prefs.emailEnabled) return;

  const user: AuthUser | null = await getUser(recipientId);
  if (!user) return;

  const emailLogId = await createEmailLog({
    recipientId,
    recipientEmail: user.email,
    eventType,
    subject: title,
    body: emailBody,
  });

  await sendEmail(emailLogId);
}

export async function sendEmail(emailLogId: string): Promise<void> {
  const supabase = requireSupabase();
  // The actual send (provider call, retries, secret key) happens entirely
  // server-side in the send-email Edge Function. This client only ever
  // passes a reference to an already-logged row -- never raw content or a
  // provider credential.
  const { error } = await supabase.functions.invoke('send-email', {
    body: { emailLogId },
  });
  if (error) throw error;
}
