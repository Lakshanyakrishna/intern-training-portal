import { useState, useEffect } from 'react';
import type { UserProgress } from '../types';
import { loadProgress, saveProgress } from '../utils/storage';

// Trimmed down to just the raw progress reader -- every mutator that used
// to live here (XP, lessons, challenges, quizzes, checkpoints...) only had
// callers in the mock training pages, which are gone until real modules
// replace them. Profile.tsx is the sole remaining consumer, and it only
// reads progress.level/xp/completedChallenges/passedQuizzes off the raw
// stored object.
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

  return { progress };
}
