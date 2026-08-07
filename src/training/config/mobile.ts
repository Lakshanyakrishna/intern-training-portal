import type { TrainingTrackConfig } from './types';

// [Placeholder curriculum] Shape only -- see frontend.ts for the fully
// worked example of what a module's internals look like.
export const mobileTrack: TrainingTrackConfig = {
  forte: 'Mobile Development',
  trackName: 'Mobile Development',
  description: 'Native and cross-platform mobile engineering fundamentals.',
  stages: [
    {
      id: 'mob-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Git and mobile UI fundamentals.',
      order: 1,
      modules: [
        {
          id: 'mob-foundation-git',
          title: '[Placeholder] Git & Version Control',
          estimatedMinutes: 60,
          order: 1,
          lessons: [{ id: 'mob-foundation-git-l1', title: '[Placeholder] Branching workflows', contentType: 'video', estimatedMinutes: 15, order: 1 }],
          practice: [{ id: 'mob-foundation-git-p1', title: '[Placeholder] Resolve a merge conflict', kind: 'interactive', order: 1 }],
          assessment: { id: 'mob-foundation-git-a1', title: '[Placeholder] Git fundamentals check', kind: 'mcq', passingScore: 70, timeLimitMinutes: 10, maxAttempts: 3, order: 1 },
        },
        {
          id: 'mob-foundation-ui',
          title: '[Placeholder] Mobile UI Fundamentals',
          estimatedMinutes: 120,
          order: 2,
          lessons: [{ id: 'mob-foundation-ui-l1', title: '[Placeholder] Layout & navigation', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'mob-foundation-ui-p1', title: '[Placeholder] Build a screen from a spec', kind: 'coding', order: 1 }],
          assessment: { id: 'mob-foundation-ui-a1', title: '[Placeholder] UI fundamentals assessment', kind: 'coding', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'mob-development',
      key: 'development',
      title: 'Development',
      description: 'State management and device APIs.',
      order: 2,
      modules: [
        {
          id: 'mob-development-state',
          title: '[Placeholder] State Management',
          estimatedMinutes: 90,
          order: 1,
          lessons: [{ id: 'mob-development-state-l1', title: '[Placeholder] Managing app state', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'mob-development-state-p1', title: '[Placeholder] Build a stateful list screen', kind: 'coding', order: 1 }],
          submission: { id: 'mob-development-state-s1', title: '[Placeholder] Submit your screen', requiresLink: true },
        },
      ],
    },
    {
      id: 'mob-project',
      key: 'project',
      title: 'Project',
      description: 'Apply everything on a real, mentor-reviewed feature.',
      order: 3,
      modules: [
        { id: 'mob-project-feature', title: '[Placeholder] Feature Build', order: 1, lessons: [], practice: [], submission: { id: 'mob-project-feature-s1', title: '[Placeholder] Submit your feature PR', requiresLink: true } },
      ],
    },
    {
      id: 'mob-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Mentor evaluation of client-readiness before project placement.',
      order: 4,
      modules: [{ id: 'mob-readiness-eval', title: '[Placeholder] Readiness Evaluation', order: 1, lessons: [], practice: [] }],
    },
    {
      id: 'mob-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Certificate and project allocation.',
      order: 5,
      modules: [{ id: 'mob-graduation-cert', title: '[Placeholder] Certificate & Project Allocation', order: 1, lessons: [], practice: [] }],
    },
  ],
};
