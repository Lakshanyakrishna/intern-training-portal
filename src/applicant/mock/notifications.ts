// [Placeholder] Mock notifications for the compact preview widget. Real
// data will come from the existing notifications table (already used by
// NotificationBell / NotificationCenter for other roles).
import type { NotificationItem, Stage } from '../types';

const ALL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Your application has been received', timestamp: '4 days ago', read: true, kind: 'application' },
  { id: 'notif-2', title: 'Resume screening in progress', timestamp: '3 days ago', read: true, kind: 'progress' },
  { id: 'notif-3', title: 'Your interview is scheduled for Thursday, Aug 14', timestamp: '2 days ago', read: false, kind: 'interview' },
];

// Mirrors activityForStage's cutoff pattern -- a notification only shows
// once the applicant has actually reached the stage it describes. Without
// this, "your interview is scheduled" would show before any application
// even exists.
const STAGE_CUTOFF: Record<Stage, number> = {
  no_application: 0,
  application_submitted: 1,
  resume_screening: 2,
  interview_scheduling: 2,
  interview_scheduled: 3,
  interview_completed: 3,
  selected: 3,
  rejected: 3,
};

export function notificationsForStage(stage: Stage): NotificationItem[] {
  return ALL_NOTIFICATIONS.slice(0, STAGE_CUTOFF[stage]).slice().reverse();
}
