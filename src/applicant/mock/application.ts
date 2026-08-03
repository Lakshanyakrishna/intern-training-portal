// [Placeholder] Mock application data, shaped to match the real
// DbApplication fields already used elsewhere in the app so swapping this
// for getApplicationByUserId() later is a one-line change.
import type { ApplicationSummary, Stage } from '../types';

export const MOCK_APPLICATION: ApplicationSummary = {
  id: 'app-mock-1',
  opportunityTitle: '[Placeholder] Frontend Engineering Internship',
  submittedAt: '2026-08-02',
  status: 'application_submitted',
  estimatedReviewDays: [2, 3],
};

export function applicationForStage(stage: Stage): ApplicationSummary {
  return { ...MOCK_APPLICATION, status: stage };
}
