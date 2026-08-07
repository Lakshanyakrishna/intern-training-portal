// Mock achievement-system data. Shaped to match the future achievements
// table. `earned` here is illustrative placeholder state, not derived from
// real progress -- that wiring happens once achievement rules exist.

export interface MockAchievement {
  id: string;
  key: string;
  title: string;
  description: string;
  earned: boolean;
  earnedAt: string | null;
}

export const MOCK_ACHIEVEMENTS: MockAchievement[] = [
  { id: 'ach-first-lesson', key: 'first_lesson', title: '[Placeholder] First Steps', description: 'Complete your first lesson.', earned: false, earnedAt: null },
  { id: 'ach-first-module', key: 'first_module', title: '[Placeholder] Module Master', description: 'Complete your first module.', earned: false, earnedAt: null },
  { id: 'ach-streak-7', key: 'streak_7', title: '[Placeholder] Week Warrior', description: 'Maintain a 7-day streak.', earned: false, earnedAt: null },
  { id: 'ach-first-submission', key: 'first_submission', title: '[Placeholder] Shipped It', description: 'Submit your first project.', earned: false, earnedAt: null },
];

export const MOCK_LEADERBOARD_POSITION = { position: null as number | null, cohortSize: 0 };
