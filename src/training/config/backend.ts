import type { TrainingTrackConfig } from './types';

// [Placeholder curriculum] Shape only -- see frontend.ts for the fully
// worked example of what a module's internals look like.
export const backendTrack: TrainingTrackConfig = {
  forte: 'Backend',
  trackName: 'Backend Engineering',
  description: 'Server-side engineering: APIs, databases, and system design fundamentals.',
  stages: [
    {
      id: 'be-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Git, databases, and API fundamentals.',
      order: 1,
      modules: [
        {
          id: 'be-foundation-git',
          title: '[Placeholder] Git & Version Control',
          estimatedMinutes: 60,
          order: 1,
          lessons: [
            { id: 'be-foundation-git-l1', title: '[Placeholder] Branching workflows', contentType: 'video', estimatedMinutes: 15, order: 1 },
          ],
          practice: [{ id: 'be-foundation-git-p1', title: '[Placeholder] Resolve a merge conflict', kind: 'interactive', order: 1 }],
          assessment: { id: 'be-foundation-git-a1', title: '[Placeholder] Git fundamentals check', kind: 'mcq', passingScore: 70, timeLimitMinutes: 10, maxAttempts: 3, order: 1 },
        },
        {
          id: 'be-foundation-db',
          title: '[Placeholder] Databases & SQL',
          description: 'Schema design, queries, and PostgreSQL basics.',
          estimatedMinutes: 120,
          order: 2,
          lessons: [
            { id: 'be-foundation-db-l1', title: '[Placeholder] Relational modeling', contentType: 'markdown', estimatedMinutes: 20, order: 1 },
            { id: 'be-foundation-db-l2', title: '[Placeholder] Writing queries', contentType: 'code', estimatedMinutes: 25, order: 2 },
          ],
          practice: [{ id: 'be-foundation-db-p1', title: '[Placeholder] Query exercises', kind: 'coding', order: 1 }],
          assessment: { id: 'be-foundation-db-a1', title: '[Placeholder] SQL assessment', kind: 'coding', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'be-development',
      key: 'development',
      title: 'Development',
      description: 'Building and securing real API endpoints.',
      order: 2,
      modules: [
        {
          id: 'be-development-api',
          title: '[Placeholder] REST API Design',
          estimatedMinutes: 90,
          order: 1,
          lessons: [{ id: 'be-development-api-l1', title: '[Placeholder] Resource-oriented design', contentType: 'markdown', estimatedMinutes: 15, order: 1 }],
          practice: [{ id: 'be-development-api-p1', title: '[Placeholder] Build a CRUD endpoint', kind: 'coding', order: 1 }],
          submission: { id: 'be-development-api-s1', title: '[Placeholder] Submit your endpoint', requiresLink: true },
        },
        {
          id: 'be-development-auth',
          title: '[Placeholder] Auth & Security',
          estimatedMinutes: 90,
          order: 2,
          lessons: [{ id: 'be-development-auth-l1', title: '[Placeholder] Auth patterns & RLS', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'be-development-auth-p1', title: '[Placeholder] Secure an endpoint', kind: 'coding', order: 1 }],
          assessment: { id: 'be-development-auth-a1', title: '[Placeholder] Security review challenge', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'be-project',
      key: 'project',
      title: 'Project',
      description: 'Apply everything on a real, mentor-reviewed service.',
      order: 3,
      modules: [
        { id: 'be-project-feature', title: '[Placeholder] Service Build', order: 1, lessons: [], practice: [], submission: { id: 'be-project-feature-s1', title: '[Placeholder] Submit your service PR', requiresLink: true } },
      ],
    },
    {
      id: 'be-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Mentor evaluation of client-readiness before project placement.',
      order: 4,
      modules: [{ id: 'be-readiness-eval', title: '[Placeholder] Readiness Evaluation', order: 1, lessons: [], practice: [] }],
    },
    {
      id: 'be-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Certificate and project allocation.',
      order: 5,
      modules: [{ id: 'be-graduation-cert', title: '[Placeholder] Certificate & Project Allocation', order: 1, lessons: [], practice: [] }],
    },
  ],
};
