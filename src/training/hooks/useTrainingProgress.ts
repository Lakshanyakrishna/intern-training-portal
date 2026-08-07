import { useCallback, useEffect, useState } from 'react';
import type { TrainingTrackConfig, ModuleConfig, ModuleState } from '../config/types';
import { flattenModules } from '../config/types';
import { createEmptyProgress, levelForXp, type MockTrainingProgress, type ModuleCompletionStatus } from '../mock/progress';

// The one place training progress gets read/written. Every page in
// src/training/ goes through this hook rather than touching localStorage
// (today's mock persistence) or a table (the real persistence later)
// directly -- swapping the storage backend means editing this file only.

function storageKey(userId: string, trackId: string): string {
  return `training-progress:${userId}:${trackId}`;
}

function load(userId: string, trackId: string): MockTrainingProgress {
  try {
    const raw = localStorage.getItem(storageKey(userId, trackId));
    if (raw) return JSON.parse(raw) as MockTrainingProgress;
  } catch { /* corrupt/unavailable -- fall through to a fresh start */ }
  return createEmptyProgress();
}

function save(userId: string, trackId: string, progress: MockTrainingProgress) {
  try {
    localStorage.setItem(storageKey(userId, trackId), JSON.stringify(progress));
  } catch { /* storage unavailable -- progress just won't persist this session */ }
}

const XP_PER_LESSON = 10;
const XP_PER_PRACTICE = 15;
const XP_PER_ASSESSMENT = 30;

export function useTrainingProgress(userId: string | undefined, track: TrainingTrackConfig) {
  const [progress, setProgress] = useState<MockTrainingProgress>(createEmptyProgress);

  useEffect(() => {
    if (!userId) return;
    setProgress(load(userId, track.forte));
  }, [userId, track.forte]);

  const persist = useCallback((next: MockTrainingProgress) => {
    setProgress(next);
    if (userId) save(userId, track.forte, next);
  }, [userId, track.forte]);

  const addXp = useCallback((amount: number) => {
    persist({ ...progress, xp: progress.xp + amount, level: levelForXp(progress.xp + amount) });
  }, [progress, persist]);

  function getModuleProgress(moduleId: string) {
    return progress.moduleProgress[moduleId] ?? { status: 'not-started' as ModuleCompletionStatus, completedLessonIds: [], completedPracticeIds: [] };
  }

  function bumpWeeklyGoal(goals: typeof progress.weeklyGoals, goalId: string) {
    return goals.map(g => (g.id === goalId ? { ...g, current: Math.min(g.target, g.current + 1) } : g));
  }

  const markLessonComplete = useCallback((moduleId: string, lessonId: string) => {
    const mp = getModuleProgress(moduleId);
    if (mp.completedLessonIds.includes(lessonId)) return;
    const nextMp = { ...mp, completedLessonIds: [...mp.completedLessonIds, lessonId], status: 'in-progress' as ModuleCompletionStatus };
    const next = {
      ...progress,
      moduleProgress: { ...progress.moduleProgress, [moduleId]: nextMp },
      weeklyGoals: bumpWeeklyGoal(progress.weeklyGoals, 'wg-lessons'),
    };
    persist({ ...next, xp: next.xp + XP_PER_LESSON, level: levelForXp(next.xp + XP_PER_LESSON) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, persist]);

  const markPracticeComplete = useCallback((moduleId: string, practiceId: string) => {
    const mp = getModuleProgress(moduleId);
    if (mp.completedPracticeIds.includes(practiceId)) return;
    const nextMp = { ...mp, completedPracticeIds: [...mp.completedPracticeIds, practiceId], status: 'in-progress' as ModuleCompletionStatus };
    const next = {
      ...progress,
      moduleProgress: { ...progress.moduleProgress, [moduleId]: nextMp },
      weeklyGoals: bumpWeeklyGoal(progress.weeklyGoals, 'wg-practice'),
    };
    persist({ ...next, xp: next.xp + XP_PER_PRACTICE, level: levelForXp(next.xp + XP_PER_PRACTICE) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, persist]);

  const markAssessmentPassed = useCallback((moduleId: string) => {
    const mp = getModuleProgress(moduleId);
    const nextMp = { ...mp, assessmentPassed: true };
    const next = { ...progress, moduleProgress: { ...progress.moduleProgress, [moduleId]: nextMp } };
    persist({ ...next, xp: next.xp + XP_PER_ASSESSMENT, level: levelForXp(next.xp + XP_PER_ASSESSMENT) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, persist]);

  const markModuleComplete = useCallback((moduleId: string) => {
    const mp = getModuleProgress(moduleId);
    const nextMp = { ...mp, status: 'completed' as ModuleCompletionStatus };
    persist({ ...progress, moduleProgress: { ...progress.moduleProgress, [moduleId]: nextMp } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, persist]);

  const setSubmissionStatus = useCallback((moduleId: string, status: 'pending' | 'submitted' | 'reviewed' | 'approved') => {
    const mp = getModuleProgress(moduleId);
    const nextMp = { ...mp, submissionStatus: status };
    persist({ ...progress, moduleProgress: { ...progress.moduleProgress, [moduleId]: nextMp } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, persist]);

  function moduleState(module: ModuleConfig, previousModule: ModuleConfig | undefined): ModuleState {
    const mp = getModuleProgress(module.id);
    if (mp.status === 'completed') return 'completed';
    if (mp.status === 'in-progress') return 'in-progress';
    if (!previousModule) return 'not-started';
    const prevStatus = getModuleProgress(previousModule.id).status;
    return prevStatus === 'completed' ? 'not-started' : 'locked';
  }

  const flat = flattenModules(track);
  const doneCount = flat.filter(({ module }) => getModuleProgress(module.id).status === 'completed').length;
  const overallPercent = flat.length > 0 ? Math.round((doneCount / flat.length) * 100) : 0;

  // Single pass: each module's state depends only on the one immediately
  // before it in curriculum order, so track "previous" as we walk instead
  // of re-deriving it per module.
  let previousModule: ModuleConfig | undefined;
  let currentEntry: { module: ModuleConfig; stage: typeof flat[number]['stage'] } | undefined;
  for (const entry of flat) {
    const state = moduleState(entry.module, previousModule);
    if (!currentEntry && (state === 'not-started' || state === 'in-progress')) {
      currentEntry = entry;
    }
    previousModule = entry.module;
  }

  return {
    progress,
    getModuleProgress,
    moduleState,
    markLessonComplete,
    markPracticeComplete,
    markAssessmentPassed,
    markModuleComplete,
    setSubmissionStatus,
    addXp,
    overallPercent,
    doneCount,
    totalCount: flat.length,
    currentModule: currentEntry?.module,
    currentStage: currentEntry?.stage,
  };
}
