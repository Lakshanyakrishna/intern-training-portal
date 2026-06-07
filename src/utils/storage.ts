import type { UserProgress } from '../types';

function getStorageKey(): string {
  try {
    const auth = localStorage.getItem('intern-training-auth');
    if (auth) {
      const { userId } = JSON.parse(auth);
      if (userId) return `intern-training-portal-${userId}`;
    }
  } catch { /* ignore */ }
  return 'intern-training-portal';
}

const weekStart = (() => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
})();

export const defaultProgress: UserProgress = {
  completedLessons: [],
  completedPractices: [],
  completedChallenges: [],
  passedQuizzes: [],
  moduleProgress: {},
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: new Date().toISOString().split('T')[0],
  trainingStartDate: new Date().toISOString().split('T')[0],
  mentorChecklist: {
    githubProfile: '',
    deployedProjectLink: '',
    repositoryLink: '',
    challengesCompleted: [],
    submitted: false,
  },
  weeklyGoal: {
    labs: 3,
    labsCompleted: 0,
    assessments: 1,
    assessmentsCompleted: 0,
    weeklyXp: 0,
    weeklyXpTarget: 300,
    weekStart,
  },
  completedDebugScenarios: [],
  clientProjectProgress: [],
  reviewRequestsCompleted: [],
  xpHistory: [],
  completedJourneyStages: [],
  mentorFeedback: [],
  practiceSubmissions: [],
  challengeWorkspaces: [],
};

export function loadProgress(): UserProgress {
  const key = getStorageKey();
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...defaultProgress, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...defaultProgress };
}

export function saveProgress(progress: UserProgress): void {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(progress));
}

export function resetProgress(): void {
  const key = getStorageKey();
  localStorage.removeItem(key);
}
