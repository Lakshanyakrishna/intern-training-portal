import type { TrainingTrackConfig } from './types';

// [Placeholder curriculum] Real lessons/practice/assessments/projects get
// plugged in here later -- this file only defines the shape (stages,
// modules, and their sub-structure) for the Frontend track. The UI never
// hardcodes any of this; it only renders whatever config it's handed.
export const frontendTrack: TrainingTrackConfig = {
  forte: 'Frontend',
  trackName: 'Frontend Engineering',
  description: 'Client-side engineering: component architecture, state, styling, and shipping production UI.',
  stages: [
    {
      id: 'fe-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Core web + React fundamentals before touching a real feature.',
      order: 1,
      modules: [
        {
          id: 'fe-foundation-git',
          title: '[Placeholder] Git & Version Control',
          description: 'Branching, commits, pull requests, code review basics.',
          estimatedMinutes: 60,
          order: 1,
          lessons: [
            { id: 'fe-foundation-git-l1', title: '[Placeholder] Why version control', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
            { id: 'fe-foundation-git-l2', title: '[Placeholder] Branching workflows', contentType: 'video', estimatedMinutes: 15, order: 2 },
            { id: 'fe-foundation-git-l3', title: '[Placeholder] Writing a good PR', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
          ],
          practice: [
            { id: 'fe-foundation-git-p1', title: '[Placeholder] Resolve a merge conflict', kind: 'interactive', order: 1 },
          ],
          assessment: { id: 'fe-foundation-git-a1', title: '[Placeholder] Git fundamentals check', kind: 'mcq', passingScore: 70, timeLimitMinutes: 10, maxAttempts: 3, order: 1 },
        },
        {
          id: 'fe-foundation-react',
          title: '[Placeholder] React Fundamentals',
          description: 'Components, props, state, and the render cycle.',
          estimatedMinutes: 120,
          order: 2,
          lessons: [
            { id: 'fe-foundation-react-l1', title: '[Placeholder] Components & JSX', contentType: 'markdown', estimatedMinutes: 20, order: 1 },
            { id: 'fe-foundation-react-l2', title: '[Placeholder] Props & state', contentType: 'code', estimatedMinutes: 25, order: 2 },
            { id: 'fe-foundation-react-l3', title: '[Placeholder] Hooks overview', contentType: 'video', estimatedMinutes: 20, order: 3 },
          ],
          practice: [
            { id: 'fe-foundation-react-p1', title: '[Placeholder] Build a counter component', kind: 'coding', order: 1 },
            { id: 'fe-foundation-react-p2', title: '[Placeholder] React fundamentals quiz', kind: 'mcq', order: 2 },
          ],
          challenge: { id: 'fe-foundation-react-c1', title: '[Placeholder] Build a mini to-do app', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
          assessment: { id: 'fe-foundation-react-a1', title: '[Placeholder] React fundamentals assessment', kind: 'coding', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'fe-development',
      key: 'development',
      title: 'Development',
      description: 'Real component patterns, styling systems, and API integration.',
      order: 2,
      modules: [
        {
          id: 'fe-development-styling',
          title: '[Placeholder] Styling Systems',
          description: 'Tailwind, design tokens, responsive layout.',
          estimatedMinutes: 90,
          order: 1,
          lessons: [
            { id: 'fe-development-styling-l1', title: '[Placeholder] Utility-first CSS', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-development-styling-l2', title: '[Placeholder] Responsive breakpoints', contentType: 'code', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'fe-development-styling-p1', title: '[Placeholder] Rebuild a component from a design', kind: 'coding', order: 1 },
          ],
          submission: { id: 'fe-development-styling-s1', title: '[Placeholder] Submit your styled component', requiresLink: true },
        },
        {
          id: 'fe-development-api',
          title: '[Placeholder] Working with APIs',
          description: 'Fetching, loading/error states, data fetching patterns.',
          estimatedMinutes: 90,
          order: 2,
          lessons: [
            { id: 'fe-development-api-l1', title: '[Placeholder] Fetch & async state', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
          ],
          practice: [
            { id: 'fe-development-api-p1', title: '[Placeholder] Build a data table with loading states', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'fe-development-api-a1', title: '[Placeholder] API integration challenge', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'fe-project',
      key: 'project',
      title: 'Project',
      description: 'Apply everything on a real, mentor-reviewed feature.',
      order: 3,
      modules: [
        {
          id: 'fe-project-feature',
          title: '[Placeholder] Feature Build',
          description: 'End-to-end feature implementation with a real submission.',
          order: 1,
          lessons: [],
          practice: [],
          submission: { id: 'fe-project-feature-s1', title: '[Placeholder] Submit your feature PR', requiresLink: true },
        },
      ],
    },
    {
      id: 'fe-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Mentor evaluation of client-readiness before project placement.',
      order: 4,
      modules: [
        { id: 'fe-readiness-eval', title: '[Placeholder] Readiness Evaluation', order: 1, lessons: [], practice: [] },
      ],
    },
    {
      id: 'fe-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Certificate and project allocation.',
      order: 5,
      modules: [
        { id: 'fe-graduation-cert', title: '[Placeholder] Certificate & Project Allocation', order: 1, lessons: [], practice: [] },
      ],
    },
  ],
};
