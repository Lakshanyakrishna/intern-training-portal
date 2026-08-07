// Mock mentor-section data. Shaped to match the future mentor_feedback
// table plus a per-mentor profile that doesn't have a dedicated table yet.
// Values are placeholder content, not real assignments -- the real mentor
// pipeline is intern_track_assignments / AdminMentors, untouched by this.

export interface MockMentorProfile {
  name: string;
  role: string;
  officeHours: string;
  avatarInitial: string;
}

export interface MockAnnouncement {
  id: string;
  title: string;
  body: string;
  postedAt: string;
}

export interface MockMentorFeedback {
  id: string;
  moduleTitle: string | null;
  message: string;
  createdAt: string;
}

export const MOCK_MENTOR: MockMentorProfile = {
  name: '[Placeholder] Mentor Name',
  role: 'Senior Engineer',
  officeHours: '[Placeholder] Tue & Thu, 3–4pm',
  avatarInitial: 'M',
};

export const MOCK_ANNOUNCEMENTS: MockAnnouncement[] = [
  {
    id: 'ann-1',
    title: '[Placeholder] Welcome to the program',
    body: 'Real announcements from your mentor and program team will show up here.',
    postedAt: new Date().toISOString(),
  },
];

export const MOCK_MENTOR_FEEDBACK: MockMentorFeedback[] = [];
