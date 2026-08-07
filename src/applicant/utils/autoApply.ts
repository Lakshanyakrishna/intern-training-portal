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

// Opportunities are still placeholder content (src/applicant/mock/
// opportunities.ts) -- no real opportunity_id exists yet to attach, so this
// submits the same general application /apply already allows without one.
// One-click only works when a profile resume already exists to attach;
// without one there's nothing to auto-submit, so the real form (with its
// required Resume field) is the honest next step instead of a fake success.
export async function autoApply(user: AuthUser): Promise<AutoApplyResult> {
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
    });
    await attachResumeToApplication(resume.id, applicationId);
    notifyEvent('application_submitted', user.id, { name: user.name, opportunity: 'the program' }).catch(() => {});
    return { status: 'applied' };
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : 'Could not submit — try again.' };
  }
}
