// Journey structure -- the 5 nodes shown in JourneyTracker, and which node
// each of the 8 fine-grained Stage values belongs to. This is configuration
// rather than fetched data, but it lives in mock/ per the same
// "swap-in-later" contract: once stage transitions are driven by real
// application/interview rows, this file doesn't change at all.
import type { JourneyStepDef, Stage } from '../types';

export const JOURNEY_STEPS: JourneyStepDef[] = [
  { id: 'apply', label: 'Apply' },
  { id: 'review', label: 'Resume Review' },
  { id: 'interview', label: 'Interview' },
  { id: 'selection', label: 'Selection' },
  { id: 'training', label: 'Training' },
];

// 'rejected' still maps to the Selection node -- it's a real outcome of
// that step, not a missing one, so the tracker renders it as a terminal
// state on node 4 rather than silently regressing to an earlier step.
export const STAGE_STEP_INDEX: Record<Stage, number> = {
  no_application: 0,
  application_submitted: 0,
  resume_screening: 1,
  interview_scheduling: 2,
  interview_scheduled: 2,
  interview_completed: 2,
  selected: 3,
  rejected: 3,
};
