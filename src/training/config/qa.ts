import type { TrainingTrackConfig } from './types';

// [Placeholder curriculum] Forward-looking track -- QA isn't a real
// opportunity forte yet (see OPPORTUNITY_FORTES in src/lib/db.ts), so this
// isn't wired into the registry in index.ts. Included per spec so adding a
// real QA forte later is "add one line to index.ts," not "design a new
// track from scratch."
export const qaTrack: TrainingTrackConfig = {
  forte: 'QA',
  trackName: 'Quality Assurance',
  description: 'Testing fundamentals: manual QA, test automation, and bug triage.',
  stages: [
    {
      id: 'qa-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Git and manual testing fundamentals.',
      order: 1,
      modules: [
        {
          id: 'qa-foundation-git',
          title: '[Placeholder] Git & Version Control',
          estimatedMinutes: 60,
          order: 1,
          lessons: [{ id: 'qa-foundation-git-l1', title: '[Placeholder] Branching workflows', contentType: 'video', estimatedMinutes: 15, order: 1 }],
          practice: [{ id: 'qa-foundation-git-p1', title: '[Placeholder] Resolve a merge conflict', kind: 'interactive', order: 1 }],
          assessment: { id: 'qa-foundation-git-a1', title: '[Placeholder] Git fundamentals check', kind: 'mcq', passingScore: 70, timeLimitMinutes: 10, maxAttempts: 3, order: 1 },
        },
        {
          id: 'qa-foundation-manual',
          title: '[Placeholder] Manual Testing Fundamentals',
          estimatedMinutes: 90,
          order: 2,
          lessons: [{ id: 'qa-foundation-manual-l1', title: '[Placeholder] Writing test cases', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'qa-foundation-manual-p1', title: '[Placeholder] Find bugs in a sample app', kind: 'debugging', order: 1 }],
          assessment: { id: 'qa-foundation-manual-a1', title: '[Placeholder] Manual testing assessment', kind: 'mixed', passingScore: 70, timeLimitMinutes: 30, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'qa-development',
      key: 'development',
      title: 'Development',
      description: 'Automated testing and bug triage.',
      order: 2,
      modules: [
        {
          id: 'qa-development-automation',
          title: '[Placeholder] Test Automation',
          estimatedMinutes: 90,
          order: 1,
          lessons: [{ id: 'qa-development-automation-l1', title: '[Placeholder] Writing automated tests', contentType: 'code', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'qa-development-automation-p1', title: '[Placeholder] Automate a test suite', kind: 'coding', order: 1 }],
          submission: { id: 'qa-development-automation-s1', title: '[Placeholder] Submit your test suite', requiresLink: true },
        },
      ],
    },
    {
      id: 'qa-project',
      key: 'project',
      title: 'Project',
      description: 'Apply everything on a real, mentor-reviewed test plan.',
      order: 3,
      modules: [
        { id: 'qa-project-feature', title: '[Placeholder] Test Plan Build', order: 1, lessons: [], practice: [], submission: { id: 'qa-project-feature-s1', title: '[Placeholder] Submit your test plan', requiresLink: true } },
      ],
    },
    {
      id: 'qa-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Mentor evaluation of client-readiness before project placement.',
      order: 4,
      modules: [{ id: 'qa-readiness-eval', title: '[Placeholder] Readiness Evaluation', order: 1, lessons: [], practice: [] }],
    },
    {
      id: 'qa-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Certificate and project allocation.',
      order: 5,
      modules: [{ id: 'qa-graduation-cert', title: '[Placeholder] Certificate & Project Allocation', order: 1, lessons: [], practice: [] }],
    },
  ],
};
