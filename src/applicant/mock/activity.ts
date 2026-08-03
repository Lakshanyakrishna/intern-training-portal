// [Placeholder] Mock activity timeline. Real data will come from a
// unified events/audit feed (see audit_events, Phase 2 roadmap) filtered
// to this applicant.
import type { ActivityItem, Stage } from '../types';

const ALL_ACTIVITY: ActivityItem[] = [
  { id: 'act-1', icon: 'submitted', title: 'Application Submitted', description: 'Frontend Engineering Internship', timestamp: '2026-08-02' },
  { id: 'act-2', icon: 'resume', title: 'Resume Uploaded', description: 'resume.pdf received', timestamp: '2026-08-02' },
  { id: 'act-3', icon: 'mentor', title: 'Application Under Review', description: 'AI screening in progress', timestamp: '2026-08-03' },
  { id: 'act-4', icon: 'interview', title: 'Interview Slot Available', description: 'Choose a time that works for you', timestamp: '2026-08-05' },
  { id: 'act-5', icon: 'interview', title: 'Interview Scheduled', description: 'Thursday, Aug 14 at 9:00 AM', timestamp: '2026-08-06' },
  { id: 'act-6', icon: 'mentor', title: 'Mentor Assigned', description: '[Placeholder] Mentor Name', timestamp: '2026-08-06' },
  { id: 'act-7', icon: 'decision', title: 'Interview Completed', description: 'Awaiting mentor decision', timestamp: '2026-08-14' },
  { id: 'act-8', icon: 'training', title: 'Training Invitation', description: 'Welcome to the program', timestamp: '2026-08-16' },
];

// Trims the feed to what would realistically exist by this point in the
// journey, so an applicant on "Resume Screening" doesn't see future events
// like "Interview Scheduled" that haven't happened yet.
const STAGE_CUTOFF: Record<Stage, number> = {
  no_application: 0,
  application_submitted: 2,
  resume_screening: 3,
  interview_scheduling: 4,
  interview_scheduled: 6,
  interview_completed: 7,
  selected: 8,
  rejected: 7,
};

export function activityForStage(stage: Stage): ActivityItem[] {
  return ALL_ACTIVITY.slice(0, STAGE_CUTOFF[stage]).slice().reverse();
}
