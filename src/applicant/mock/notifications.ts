// [Placeholder] Mock notifications for the compact preview widget. Real
// data will come from the existing notifications table (already used by
// NotificationBell / NotificationCenter for other roles).
import type { NotificationItem } from '../types';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Your interview is scheduled for Thursday, Aug 14', timestamp: '2 days ago', read: false, kind: 'interview' },
  { id: 'notif-2', title: 'Your application has been received', timestamp: '4 days ago', read: true, kind: 'application' },
  { id: 'notif-3', title: 'Resume screening in progress', timestamp: '3 days ago', read: true, kind: 'progress' },
];
