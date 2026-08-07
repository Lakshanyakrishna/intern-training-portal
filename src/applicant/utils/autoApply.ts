import {
  getApplicationByUserId, getProfileResume, submitApplication, attachResumeToApplication,
} from '../../lib/db';
import { notifyEvent } from '../../lib/notifications';
import type { AuthUser } from '../../types';

export type AutoApplyResult =
  | { status: 'applied' }
  | { status: 'already-applied' }
  | { status: 'needs-form' }
  | { status: 'error'; message: string };

// One-click apply: if a profile resume already exists, submits for real
// immediately instead of sending them through the form again. Without a
// resume there's nothing to auto-attach, so the real form (with its
// required Resume field) is the honest next step instead of a fake success.
// opportunityId is what lets useInternTrack later resolve the intern's
// correct training track -- always pass the real DB opportunity id through
// from the card that was actually clicked, never omit it.
export async function autoApply(user: AuthUser, opportunityId?: string): Promise<AutoApplyResult> {
  try {
    const existing = await getApplicationByUserId(user.id);
    if (existing && !existing.withdrawnAt) {
      return { status: 'already-applied' };
    }
    const resume = await getProfileResume(user.id);
    if (!resume) {
      return { status: 'needs-form' };
    }
    const applicationId = await submitApplication({
      name: user.name,
      email: user.email,
      phone: user.phone,
      college: user.college,
      yearOfStudy: user.yearOfStudy,
      major: user.major,
      userId: user.id,
      opportunityId,
    });
    await attachResumeToApplication(resume.id, applicationId);
    notifyEvent('application_submitted', user.id, { name: user.name, opportunity: 'the program' }).catch(() => {});
    return { status: 'applied' };
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : 'Could not submit — try again.' };
  }
}
