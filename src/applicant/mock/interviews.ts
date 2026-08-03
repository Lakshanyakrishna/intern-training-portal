// [Placeholder] Mock interview slots + scheduled-interview data. Real
// implementation will fetch open slots from mentor availability and write
// the selection back via the same interviews table InterviewScheduling.tsx
// already uses on the admin side.
import type { InterviewSlot, ScheduledInterview } from '../types';

export const MOCK_INTERVIEW_SLOTS: { day: string; date: string; slots: InterviewSlot[] }[] = [
  {
    day: 'Monday',
    date: 'Aug 11',
    slots: [
      { id: 'slot-mon-10', day: 'Monday', date: 'Aug 11', time: '10:00 AM' },
      { id: 'slot-mon-11', day: 'Monday', date: 'Aug 11', time: '11:00 AM' },
      { id: 'slot-mon-14', day: 'Monday', date: 'Aug 11', time: '2:00 PM' },
    ],
  },
  {
    day: 'Thursday',
    date: 'Aug 14',
    slots: [
      { id: 'slot-thu-09', day: 'Thursday', date: 'Aug 14', time: '9:00 AM' },
      { id: 'slot-thu-16', day: 'Thursday', date: 'Aug 14', time: '4:00 PM' },
    ],
  },
];

export const MOCK_SCHEDULED_INTERVIEW: ScheduledInterview = {
  date: 'Thursday, Aug 14, 2026',
  time: '9:00 AM',
  mentor: '[Placeholder] Mentor Name',
  mentorRole: 'Senior Engineer',
  platform: 'Google Meet',
};
