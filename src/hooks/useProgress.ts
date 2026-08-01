import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, PracticeSubmission, ChallengeWorkspace } from '../types';
import { loadProgress, saveProgress } from '../utils/storage';
import { levels } from '../data/levels';
import { modules } from '../data/modules';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setProgress(prev => {
      const updates: Partial<UserProgress> = {};
      if (!prev.trainingStartDate) {
        updates.trainingStartDate = prev.xpHistory[0]?.date || today;
      }
      if (!prev.mentorFeedback) {
        updates.mentorFeedback = [];
      }
      if (prev.lastActive !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        updates.lastActive = today;
        updates.streak = prev.lastActive === yesterday ? prev.streak + 1 : 1;
      }
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const addXP = useCallback((amount: number, moduleId: string, source?: string) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      for (let i = levels.length - 1; i >= 0; i--) {
        if (newXP >= levels[i].xpRequired) {
          newLevel = levels[i].level;
          break;
        }
      }
      const moduleProg = prev.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0 };
      const today = new Date().toISOString().split('T')[0];
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        weeklyGoal: {
          ...prev.weeklyGoal,
          weeklyXp: prev.weeklyGoal.weeklyXp + amount,
        },
        xpHistory: [...prev.xpHistory, { date: today, amount, source: source || moduleId }],
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: { ...moduleProg, xp: moduleProg.xp + amount },
        },
      };
    });
  }, []);

  const completeCheckpoint = useCallback((moduleId: string, quizId: string, result: { passed: boolean; score: number; total: number; attempts: number; answers: Record<number, { selected: number; correct: boolean }>; timeTaken: number }) => {
    setProgress(prev => {
      const moduleProg = prev.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0, checkpoints: {}, assessmentResult: undefined };
      const existing = moduleProg.checkpoints?.[quizId];
      if (existing?.passed) return prev;
      return {
        ...prev,
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: {
            ...moduleProg,
            checkpoints: { ...moduleProg.checkpoints, [quizId]: result },
          },
        },
      };
    });
    if (result.passed) addXP(20, moduleId, 'checkpoint');
  }, [addXP]);

  const completeLesson = useCallback((moduleId: string, lessonId: string) => {
    setProgress(prev => {
      const moduleProg = prev.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0 };
      if (moduleProg.lessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: { ...moduleProg, lessons: [...moduleProg.lessons, lessonId] },
        },
      };
    });
  }, []);

  const completePractice = useCallback((moduleId: string, practiceId: string) => {
    setProgress(prev => {
      const moduleProg = prev.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0 };
      if (moduleProg.practices.includes(practiceId)) return prev;
      return {
        ...prev,
        completedPractices: [...prev.completedPractices, practiceId],
        weeklyGoal: { ...prev.weeklyGoal, labsCompleted: prev.weeklyGoal.labsCompleted + 1 },
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: { ...moduleProg, practices: [...moduleProg.practices, practiceId] },
        },
      };
    });
    addXP(15, moduleId, 'lab');
  }, [addXP]);

  const completeChallenge = useCallback((moduleId: string, challengeId: string) => {
    setProgress(prev => {
      const moduleProg = prev.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0 };
      if (moduleProg.challenges.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: { ...moduleProg, challenges: [...moduleProg.challenges, challengeId] },
        },
      };
    });
    addXP(30, moduleId, 'challenge');
  }, [addXP]);

  const passQuiz = useCallback((moduleId: string, attempt?: { score: number; total: number }) => {
    setProgress(prev => {
      const moduleProg = prev.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0, checkpoints: {}, assessmentResult: undefined };
      const prevAssessment = moduleProg.assessmentResult;
      const newAttempt = {
        score: attempt?.score ?? 0,
        total: attempt?.total ?? 0,
        passed: (attempt?.score ?? 0) >= (attempt?.total ?? 1) * 0.7,
        timestamp: new Date().toISOString(),
      };
      const allAttempts = [...(prevAssessment?.attempts || []), newAttempt];
      const bestScore = Math.max(...allAttempts.map(a => a.score));
      const assessmentResult: { attempts: { score: number; total: number; passed: boolean; timestamp: string }[]; bestScore: number; latestScore: number } = {
        attempts: allAttempts,
        bestScore,
        latestScore: newAttempt.score,
      };

      const alreadyPassed = prevAssessment?.attempts?.some(a => a.passed) || moduleProg.quizPassed;

      return {
        ...prev,
        passedQuizzes: newAttempt.passed && !alreadyPassed ? [...prev.passedQuizzes, moduleId] : prev.passedQuizzes,
        weeklyGoal: newAttempt.passed && !alreadyPassed ? { ...prev.weeklyGoal, assessmentsCompleted: prev.weeklyGoal.assessmentsCompleted + 1 } : prev.weeklyGoal,
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: { ...moduleProg, quizPassed: moduleProg.quizPassed || newAttempt.passed, assessmentResult },
        },
      };
    });
    addXP(50, moduleId, 'assessment');
  }, [addXP]);

  const getModuleProgress = useCallback((moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return { percent: 0, completed: 0, total: 0 };
    const modProg = progress.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0, checkpoints: {}, assessmentResult: undefined };
    const total = module.lessons.length + module.practices.length + module.challenges.length + 1 + module.checkpointQuizzes.length;
    let completed = modProg.lessons.length + modProg.practices.length + modProg.challenges.length;
    if (modProg.quizPassed) completed += 1;
    if (modProg.checkpoints) {
      completed += Object.values(modProg.checkpoints).filter(c => c.passed).length;
    }
    return { percent: Math.round((completed / total) * 100), completed, total };
  }, [progress]);

  const updateMentorChecklist = useCallback((checklist: UserProgress['mentorChecklist']) => {
    setProgress(prev => ({ ...prev, mentorChecklist: checklist }));
  }, []);

  const completeDebugScenario = useCallback((scenarioId: string, xp: number) => {
    setProgress(prev => {
      if (prev.completedDebugScenarios.includes(scenarioId)) return prev;
      return { ...prev, completedDebugScenarios: [...prev.completedDebugScenarios, scenarioId] };
    });
    addXP(xp, 'debugging', 'debug-simulator');
  }, [addXP]);

  const advanceClientProject = useCallback((dayId: string) => {
    setProgress(prev => {
      if (prev.clientProjectProgress.includes(dayId)) return prev;
      return { ...prev, clientProjectProgress: [...prev.clientProjectProgress, dayId] };
    });
  }, []);

  const completeReviewRequest = useCallback((reviewId: string, xp: number) => {
    setProgress(prev => {
      if (prev.reviewRequestsCompleted.includes(reviewId)) return prev;
      return { ...prev, reviewRequestsCompleted: [...prev.reviewRequestsCompleted, reviewId] };
    });
    addXP(xp, 'code-review', 'code-review');
  }, [addXP]);

  const completeJourneyStage = useCallback((stageId: string) => {
    setProgress(prev => {
      if (prev.completedJourneyStages.includes(stageId)) return prev;
      return { ...prev, completedJourneyStages: [...prev.completedJourneyStages, stageId] };
    });
  }, []);

  const getSkillBreakdown = useCallback(() => {
    const skillMap: Record<string, { moduleId: string; percent: number; icon: string }> = {
      'Git': { moduleId: 'git', percent: 0, icon: 'git' },
      'Deployment': { moduleId: 'deployment', percent: 0, icon: 'deployment' },
      'Supabase': { moduleId: 'supabase', percent: 0, icon: 'supabase' },
      'AI': { moduleId: 'ai', percent: 0, icon: 'ai' },
      'Debugging': { moduleId: 'debugging', percent: 0, icon: 'debugging' },
      'API': { moduleId: 'api', percent: 0, icon: 'api' },
      'Communication': { moduleId: 'communication', percent: 0, icon: 'communication' },
    };
    for (const [, info] of Object.entries(skillMap)) {
      const mp = getModuleProgress(info.moduleId);
      info.percent = mp.percent;
    }
    return skillMap;
  }, [getModuleProgress]);

  const getClientReadinessScore = useCallback(() => {
    let score = 0;
    const totalModules = modules.length;
    const completedModules = modules.filter(m => getModuleProgress(m.id).percent >= 80).length;
    score += (completedModules / totalModules) * 40;
    const totalChallenges = modules.reduce((a, m) => a + m.challenges.length, 0);
    score += (progress.completedChallenges.length / Math.max(totalChallenges, 1)) * 20;
    score += (progress.passedQuizzes.length / totalModules) * 20;
    score += Math.min(progress.streak / 7, 1) * 10;
    score += Math.min(progress.level / 5, 1) * 10;
    return Math.round(score);
  }, [progress, getModuleProgress]);

  const getClientReadinessStatus = useCallback(() => {
    const score = getClientReadinessScore();
    if (score < 25) return { label: 'Not Ready', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
    if (score < 50) return { label: 'Needs Supervision', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    if (score < 75) return { label: 'Almost Ready', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' };
    return { label: 'Client Ready', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
  }, [getClientReadinessScore]);

  const savePracticeSubmission = useCallback((moduleId: string, taskId: string, submission: string) => {
    setProgress(prev => {
      const existing = prev.practiceSubmissions || [];
      const idx = existing.findIndex(s => s.taskId === taskId);
      const entry: PracticeSubmission = { taskId, submission, savedAt: new Date().toISOString() };
      const updated = idx >= 0
        ? existing.map((s, i) => i === idx ? entry : s)
        : [...existing, entry];
      const moduleProg = prev.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0 };
      const practices = moduleProg.practices.includes(taskId) ? moduleProg.practices : [...moduleProg.practices, taskId];
      return {
        ...prev,
        practiceSubmissions: updated,
        completedPractices: prev.completedPractices.includes(taskId) ? prev.completedPractices : [...prev.completedPractices, taskId],
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: { ...moduleProg, practices },
        },
      };
    });
    addXP(15, moduleId, 'lab');
  }, [addXP]);

  const saveChallengeWorkspace = useCallback((_moduleId: string, challengeId: string, data: { notes?: string; submission?: string; hintsRevealed?: number }) => {
    setProgress(prev => {
      const workspaces = prev.challengeWorkspaces || [];
      const existing = workspaces.find(w => w.challengeId === challengeId);
      const entry: ChallengeWorkspace = {
        challengeId,
        notes: data.notes ?? existing?.notes ?? '',
        submission: data.submission ?? existing?.submission ?? '',
        hintsRevealed: data.hintsRevealed ?? existing?.hintsRevealed ?? 0,
        status: existing?.status === 'submitted' ? 'submitted' : 'in-progress',
      };
      const updated = existing
        ? workspaces.map(w => w.challengeId === challengeId ? entry : w)
        : [...workspaces, entry];
      return { ...prev, challengeWorkspaces: updated };
    });
  }, []);

  const submitChallenge = useCallback((moduleId: string, challengeId: string, submission: string) => {
    setProgress(prev => {
      const workspaces = prev.challengeWorkspaces || [];
      const existing = workspaces.find(w => w.challengeId === challengeId);
      const entry: ChallengeWorkspace = {
        challengeId,
        notes: existing?.notes ?? '',
        submission,
        hintsRevealed: existing?.hintsRevealed ?? 0,
        status: 'submitted',
      };
      const updated = existing
        ? workspaces.map(w => w.challengeId === challengeId ? entry : w)
        : [...workspaces, entry];
      const moduleProg = prev.moduleProgress[moduleId] || { lessons: [], practices: [], challenges: [], quizPassed: false, xp: 0 };
      const challenges = moduleProg.challenges.includes(challengeId) ? moduleProg.challenges : [...moduleProg.challenges, challengeId];
      return {
        ...prev,
        challengeWorkspaces: updated,
        completedChallenges: prev.completedChallenges.includes(challengeId) ? prev.completedChallenges : [...prev.completedChallenges, challengeId],
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleId]: { ...moduleProg, challenges },
        },
      };
    });
    addXP(30, moduleId, 'challenge');
  }, [addXP]);

  return {
    progress,
    addXP,
    completeCheckpoint,
    completeLesson,
    completePractice,
    completeChallenge,
    passQuiz,
    getModuleProgress,
    updateMentorChecklist,
    completeDebugScenario,
    advanceClientProject,
    completeReviewRequest,
    completeJourneyStage,
    getSkillBreakdown,
    getClientReadinessScore,
    getClientReadinessStatus,
    savePracticeSubmission,
    saveChallengeWorkspace,
    submitChallenge,
    setProgress,
  };
}
