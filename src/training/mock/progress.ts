// Mock per-intern progress state. Shaped to match the future
// training_progress / module_progress / lesson_progress tables
// (src/training/types/db.ts) so swapping this for a real fetch later is a
// data-layer change, not a rewrite of every page that reads progress.

export type ModuleCompletionStatus = 'not-started' | 'in-progress' | 'completed';

export interface MockModuleProgress {
  status: ModuleCompletionStatus;
  completedLessonIds: string[];
  completedPracticeIds: string[];
  assessmentPassed?: boolean;
  submissionStatus?: 'pending' | 'submitted' | 'reviewed' | 'approved';
}

export interface WeeklyGoal {
  id: string;
  label: string;
  target: number;
  current: number;
}

export interface UpcomingDeadline {
  id: string;
  label: string;
  dueDate: string;
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  kind: 'lesson' | 'practice' | 'assessment' | 'submission' | 'milestone';
}

export interface MockTrainingProgress {
  xp: number;
  level: number;
  streakDays: number;
  startedAt: string;
  estimatedCompletion: string | null;
  moduleProgress: Record<string, MockModuleProgress>;
  weeklyGoals: WeeklyGoal[];
  upcomingDeadlines: UpcomingDeadline[];
  timeline: TimelineEvent[];
}

export function createEmptyProgress(): MockTrainingProgress {
  const now = new Date().toISOString();
  return {
    xp: 0,
    level: 1,
    streakDays: 0,
    startedAt: now,
    estimatedCompletion: null,
    moduleProgress: {},
    weeklyGoals: [
      { id: 'wg-lessons', label: 'Lessons completed', target: 5, current: 0 },
      { id: 'wg-practice', label: 'Practice exercises', target: 3, current: 0 },
    ],
    upcomingDeadlines: [],
    timeline: [
      { id: 'tl-start', label: 'Started training', timestamp: now, kind: 'milestone' },
    ],
  };
}

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400];

export function levelForXp(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}
