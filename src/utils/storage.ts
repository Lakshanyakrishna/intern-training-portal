import type { UserProgress, CheckpointResult, AssessmentResult, ChallengeWorkspace } from '../types';
import * as db from '../lib/db';
import { requireSupabase } from '../lib/supabase';

// ─── Cache ────────────────────────────────────────────────────────
// Module-level cache: avoids full DB re-read on every save.
// localStorage is used as the synchronous read cache (write-through).
// DB is the source of truth.

let cachedUserId: string | null = null;

function getStorageKey(): string {
  if (cachedUserId) return `intern-training-portal-${cachedUserId}`;
  // Fallback: try reading Supabase session from localStorage
  try {
    const sessionRaw = localStorage.getItem('intern-training-supabase-auth');
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      const uid = parsed?.user?.id || parsed?.userId;
      if (uid) return `intern-training-portal-${uid}`;
    }
  } catch { /* ignore */ }
  return 'intern-training-portal';
}

function readCache(): UserProgress | null {
  const key = getStorageKey();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(progress: UserProgress): void {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(progress));
}

function clearCache(): void {
  const key = getStorageKey();
  localStorage.removeItem(key);
}

// ─── Default Progress ─────────────────────────────────────────────

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

// ─── Public API ───────────────────────────────────────────────────
// These maintain the same sync signatures that useProgress expects.
// The DB write is fire-and-forget (async, no await).

export function loadProgress(): UserProgress {
  const cached = readCache();
  return cached ? { ...defaultProgress, ...cached } : { ...defaultProgress };
}

export function saveProgress(progress: UserProgress): void {
  writeCache(progress);
  const uid = cachedUserId;
  if (uid) {
    persistProgress(uid, progress).catch(() => {});
  }
}

export function resetProgress(): void {
  clearCache();
  const uid = cachedUserId;
  if (uid) {
    wipeProgress(uid).catch(() => {});
  }
}

// ─── DB Persistence (parallel write) ──────────────────────────────

async function persistProgress(userId: string, p: UserProgress): Promise<void> {
  await db.upsertProgress(userId, {
    xp: p.xp,
    level: p.level,
    streak: p.streak,
    lastActive: p.lastActive,
    trainingStartDate: p.trainingStartDate,
  });

  await db.setCompletedItems(userId, [
    ...p.completedLessons.map(id => ({ itemType: 'lesson' as const, itemId: id })),
    ...p.completedPractices.map(id => ({ itemType: 'practice' as const, itemId: id })),
    ...p.completedChallenges.map(id => ({ itemType: 'challenge' as const, itemId: id })),
    ...p.completedDebugScenarios.map(id => ({ itemType: 'debug_scenario' as const, itemId: id })),
    ...p.clientProjectProgress.map(id => ({ itemType: 'client_project_day' as const, itemId: id })),
    ...p.reviewRequestsCompleted.map(id => ({ itemType: 'review_request' as const, itemId: id })),
    ...p.completedJourneyStages.map(id => ({ itemType: 'journey_stage' as const, itemId: id })),
  ]);

  await db.setPassedQuizzes(userId, p.passedQuizzes);

  await db.upsertModuleProgressMap(userId, p.moduleProgress);

  await db.setXpHistory(userId, p.xpHistory);

  if (p.weeklyGoal) {
    await db.upsertWeeklyGoal(userId, {
      weekStart: p.weeklyGoal.weekStart,
      labs: p.weeklyGoal.labs,
      labsCompleted: p.weeklyGoal.labsCompleted,
      assessments: p.weeklyGoal.assessments,
      assessmentsCompleted: p.weeklyGoal.assessmentsCompleted,
      weeklyXp: p.weeklyGoal.weeklyXp,
      weeklyXpTarget: p.weeklyGoal.weeklyXpTarget,
    });
  }

  await db.upsertMentorChecklist(userId, p.mentorChecklist);

  await db.setPracticeSubmissions(userId, p.practiceSubmissions);

  await db.setChallengeWorkspaces(userId, p.challengeWorkspaces);

  await db.setMentorFeedback(userId, p.mentorFeedback);
}

async function wipeProgress(userId: string): Promise<void> {
  const sb = requireSupabase();
  const tables = ['progress', 'completed_items', 'passed_quizzes', 'module_progress',
    'xp_history', 'weekly_goals', 'mentor_checklist', 'practice_submissions',
    'challenge_workspaces', 'mentor_feedback'] as const;
  for (const table of tables) {
    await sb.from(table).delete().eq('user_id', userId);
  }
}

// ─── Sync (hydrate localStorage cache from DB on init) ────────────

async function loadFromDb(userId: string): Promise<UserProgress | null> {
  try {
    const [prog, completed, passedQuizzes, moduleProgressMap, xpHistory, weeklyGoal, checklist, submissions, workspaces, feedback] = await Promise.all([
      db.getProgress(userId),
      db.getCompletedItems(userId),
      db.getPassedQuizzes(userId),
      db.getModuleProgressMap(userId),
      db.getXpHistory(userId),
      db.getWeeklyGoal(userId),
      db.getMentorChecklist(userId),
      db.getPracticeSubmissions(userId),
      db.getChallengeWorkspaces(userId),
      db.getMentorFeedback(userId),
    ]);

    if (!prog) return null;

    const completedLessons = completed.filter(c => c.itemType === 'lesson').map(c => c.itemId);
    const completedPractices = completed.filter(c => c.itemType === 'practice').map(c => c.itemId);
    const completedChallenges = completed.filter(c => c.itemType === 'challenge').map(c => c.itemId);
    const completedDebugScenarios = completed.filter(c => c.itemType === 'debug_scenario').map(c => c.itemId);
    const clientProjectProgress = completed.filter(c => c.itemType === 'client_project_day').map(c => c.itemId);
    const reviewRequestsCompleted = completed.filter(c => c.itemType === 'review_request').map(c => c.itemId);
    const completedJourneyStages = completed.filter(c => c.itemType === 'journey_stage').map(c => c.itemId);

    const moduleProgress: UserProgress['moduleProgress'] = {};
    for (const [modId, mp] of Object.entries(moduleProgressMap)) {
      const modLessons = completedLessons.filter(id => id.startsWith(modId));
      const modPractices = completedPractices.filter(id => id.startsWith(modId));
      const modChallenges = completedChallenges.filter(id => id.startsWith(modId));
      moduleProgress[modId] = {
        lessons: modLessons,
        practices: modPractices,
        challenges: modChallenges,
        quizPassed: mp.quizPassed,
        xp: mp.xp,
        checkpoints: mp.checkpoints as Record<string, CheckpointResult>,
        assessmentResult: mp.assessmentResult as AssessmentResult | undefined,
      };
    }

    const result: UserProgress = {
      completedLessons,
      completedPractices,
      completedChallenges,
      passedQuizzes,
      moduleProgress,
      xp: prog.xp,
      level: prog.level,
      streak: prog.streak,
      lastActive: prog.lastActive,
      trainingStartDate: prog.trainingStartDate,
      mentorChecklist: checklist || {
        githubProfile: '',
        deployedProjectLink: '',
        repositoryLink: '',
        challengesCompleted: [],
        submitted: false,
      },
      weeklyGoal: weeklyGoal || defaultProgress.weeklyGoal,
      completedDebugScenarios,
      clientProjectProgress,
      reviewRequestsCompleted,
      xpHistory,
      completedJourneyStages,
      mentorFeedback: feedback.map(f => ({
        id: f.id,
        date: f.date,
        score: f.score,
        note: f.note,
        module: f.module,
      })),
      practiceSubmissions: submissions,
      challengeWorkspaces: workspaces as ChallengeWorkspace[],
    };

    return result;
  } catch {
    return null;
  }
}

// Called by AuthContext on session restore to hydrate localStorage from DB
export async function syncProgressFromDb(userId: string): Promise<void> {
  cachedUserId = userId;
  const dbProgress = await loadFromDb(userId);
  if (dbProgress) {
    writeCache(dbProgress);
  }
}

// Called when user signs out
export function clearProgressCache(): void {
  cachedUserId = null;
}
