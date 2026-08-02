// Applicant Experience -- shared types.
//
// Stage is the single source of truth for "where is this applicant right
// now." Every component downstream (JourneyTracker, CurrentMission, the
// individual Stage components) is a pure function of a Stage plus its
// associated data -- no component reaches into mock data or an API
// directly. When the real backend lands, only the data-loading hook at the
// top (useApplicantJourney) needs to change; everything below stays as-is.
export type Stage =
  | 'no_application'
  | 'application_submitted'
  | 'resume_screening'
  | 'interview_scheduling'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'selected'
  | 'rejected';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  seats: number;
  deadline: string;
  category: string;
}

export interface ApplicationSummary {
  id: string;
  opportunityTitle: string;
  submittedAt: string;
  status: Stage;
  estimatedReviewDays: [number, number];
}

export interface InterviewSlot {
  id: string;
  day: string;
  date: string;
  time: string;
}

export interface ScheduledInterview {
  date: string;
  time: string;
  mentor: string;
  mentorRole: string;
  platform: string;
}

export type ActivityIcon = 'submitted' | 'resume' | 'interview' | 'mentor' | 'training' | 'decision';

export interface ActivityItem {
  id: string;
  icon: ActivityIcon;
  title: string;
  description: string;
  timestamp: string;
}

export type NotificationKind = 'interview' | 'application' | 'progress';

export interface NotificationItem {
  id: string;
  title: string;
  timestamp: string;
  read: boolean;
  kind: NotificationKind;
}

export type QuickStatIcon = 'briefcase' | 'users' | 'clock' | 'award';

export interface QuickStat {
  id: string;
  icon: QuickStatIcon;
  value: string;
  label: string;
  linkLabel: string;
}

export interface JourneyStepDef {
  id: string;
  label: string;
}

// Callback surface every stage component receives -- the "no business
// logic inside components" contract. Stage components call these; the
// actual mock-state mutation (and, later, the real API calls) lives in the
// single hook at the top (useApplicantJourney).
export interface JourneyActions {
  onApply: (opportunityId: string) => void;
  onEditApplication: (newWhyJoin: string) => void;
  onWithdrawApplication: () => void;
  onScheduleInterview: (slotId: string) => void;
  onRescheduleInterview: () => void;
  onCancelInterview: () => void;
  onAcceptOffer: () => void;
  onBeginTraining: () => void;
  onUpdateProfile: () => void;
}
