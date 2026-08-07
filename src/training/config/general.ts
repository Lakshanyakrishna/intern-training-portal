import type { TrainingTrackConfig } from './types';

// [Placeholder curriculum] Fallback track for an intern whose forte has no
// dedicated config yet (or whose application never carried a forte). Kept
// intentionally minimal -- it's a safety net, not a real curriculum.
export const generalTrack: TrainingTrackConfig = {
  forte: 'General',
  trackName: 'General Onboarding',
  description: 'Baseline onboarding while your track-specific curriculum is finalized.',
  stages: [
    {
      id: 'gen-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Company & tooling onboarding.',
      order: 1,
      modules: [
        {
          id: 'gen-foundation-git',
          title: '[Placeholder] Git & Version Control',
          estimatedMinutes: 60,
          order: 1,
          lessons: [{ id: 'gen-foundation-git-l1', title: '[Placeholder] Branching workflows', contentType: 'video', estimatedMinutes: 15, order: 1 }],
          practice: [{ id: 'gen-foundation-git-p1', title: '[Placeholder] Resolve a merge conflict', kind: 'interactive', order: 1 }],
          assessment: { id: 'gen-foundation-git-a1', title: '[Placeholder] Git fundamentals check', kind: 'mcq', passingScore: 70, timeLimitMinutes: 10, maxAttempts: 3, order: 1 },
        },
      ],
    },
    {
      id: 'gen-development',
      key: 'development',
      title: 'Development',
      description: 'Track-specific curriculum lands here once assigned.',
      order: 2,
      modules: [],
    },
    {
      id: 'gen-project',
      key: 'project',
      title: 'Project',
      description: 'Track-specific curriculum lands here once assigned.',
      order: 3,
      modules: [],
    },
    {
      id: 'gen-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Mentor evaluation of client-readiness before project placement.',
      order: 4,
      modules: [{ id: 'gen-readiness-eval', title: '[Placeholder] Readiness Evaluation', order: 1, lessons: [], practice: [] }],
    },
    {
      id: 'gen-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Certificate and project allocation.',
      order: 5,
      modules: [{ id: 'gen-graduation-cert', title: '[Placeholder] Certificate & Project Allocation', order: 1, lessons: [], practice: [] }],
    },
  ],
};
