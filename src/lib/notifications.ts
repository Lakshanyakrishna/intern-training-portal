import {
  createNotification,
  getNotificationTemplate,
  getUser,
  createEmailLog,
  getNotificationPreferences,
  updateEmailLogStatus,
} from './db';
import type { AuthUser } from '../types';

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string): string => vars[key] ?? `{{${key}}}`);
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
      title: eventType,
      message: eventType,
      metadata,
    });
    return;
  }

  const title = renderTemplate(template.in_app_template ?? '', vars);
  const message = renderTemplate(template.email_body ?? '', vars);

  await createNotification({
    recipientId,
    title,
    message,
    metadata,
  });

  const prefs = await getNotificationPreferences(recipientId);
  if (!prefs?.email_enabled) return;

  const user: AuthUser | null = await getUser(recipientId);
  if (!user) return;

  const emailLog = await createEmailLog({
    recipientId,
    email: user.email,
    subject: title,
    body: message,
  });

  await sendEmail(user.email, title, message, emailLog.id);
}

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  emailLogId: string,
): Promise<void> {
  const provider = import.meta.env.VITE_EMAIL_PROVIDER ?? 'log';
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (provider === 'resend') {
        const apiKey: string | undefined = import.meta.env.VITE_RESEND_API_KEY;
        if (!apiKey) throw new Error('Resend API key not configured');

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: import.meta.env.VITE_EMAIL_FROM ?? 'noreply@intern-training.com',
            to,
            subject,
            html: body,
          }),
        });

        if (!res.ok) throw new Error(`Resend responded with ${res.status}`);
      } else {
        console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
      }

      await updateEmailLogStatus(emailLogId, 'sent');
      return;
    } catch {
      if (attempt < maxRetries - 1) {
        await updateEmailLogStatus(emailLogId, 'retrying');
        await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
      } else {
        await updateEmailLogStatus(emailLogId, 'failed');
      }
    }
  }
}
