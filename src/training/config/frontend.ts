import type { TrainingTrackConfig } from './types';

// Frontend Development Training Handbook v1.0 -- Lumora's 18-day,
// mentor-led + project-based + industry-simulation program. Days map onto
// modules (Days 1-4 -> Foundation, 5-10 -> Development, 11-13 -> Project
// sprint simulation, 15 -> Readiness, 16-18 -> Graduation capstone). The
// five mentor checkpoints (handbook section 12) are wired in as module
// assessments except the Day 15 readiness review, which stays a bare
// module: that evaluation runs through the app's separate real
// ReadinessEvaluation admin flow, not a self-service assessment here.
export const frontendTrack: TrainingTrackConfig = {
  forte: 'Frontend',
  trackName: 'Frontend Engineering',
  description: 'An 18-day, mentor-led, project-based frontend engineering program: production React architecture, real API integration, Agile sprint simulation, and a capstone project -- per the Lumora Frontend Development Training Handbook v1.0.',
  stages: [
    {
      id: 'fe-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Production environment setup, React architecture, styling systems, and state management.',
      order: 1,
      modules: [
        {
          id: 'fe-foundation-setup',
          title: 'Day 1 · Project Setup & Development Workflow',
          description: 'Configure your environment, learn the team Git workflow, and open your first pull request.',
          estimatedMinutes: 70,
          order: 1,
          lessons: [
            { id: 'fe-foundation-setup-l1', title: 'Development environment configuration', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-foundation-setup-l2', title: 'Git workflow & branching strategy', contentType: 'markdown', estimatedMinutes: 20, order: 2 },
            { id: 'fe-foundation-setup-l3', title: 'Repository structure & project standards', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
            { id: 'fe-foundation-setup-l4', title: 'Code formatting with ESLint & Prettier', contentType: 'code', estimatedMinutes: 10, order: 4 },
          ],
          practice: [
            { id: 'fe-foundation-setup-p1', title: 'Clone the repo, configure your project, and open your first pull request', kind: 'interactive', order: 1 },
          ],
        },
        {
          id: 'fe-foundation-architecture',
          title: 'Day 2 · Modern React Architecture',
          description: 'Folder structure, component organization, and separation of concerns.',
          estimatedMinutes: 60,
          order: 2,
          lessons: [
            { id: 'fe-foundation-architecture-l1', title: 'Folder structure & component organization', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-foundation-architecture-l2', title: 'Separation of concerns', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'fe-foundation-architecture-l3', title: 'Reusable components & props management', contentType: 'code', estimatedMinutes: 20, order: 3 },
          ],
          practice: [
            { id: 'fe-foundation-architecture-p1', title: 'Build a set of reusable UI components', kind: 'coding', order: 1 },
          ],
          challenge: { id: 'fe-foundation-architecture-c1', title: 'Build a small, documented component library', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
        },
        {
          id: 'fe-foundation-styling',
          title: 'Day 3 · Styling System',
          description: 'Tailwind CSS, design tokens, and responsive layout.',
          estimatedMinutes: 60,
          order: 3,
          lessons: [
            { id: 'fe-foundation-styling-l1', title: 'Tailwind CSS fundamentals', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-foundation-styling-l2', title: 'Design tokens & theme management', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'fe-foundation-styling-l3', title: 'Responsive layouts & component styling', contentType: 'code', estimatedMinutes: 20, order: 3 },
          ],
          practice: [
            { id: 'fe-foundation-styling-p1', title: 'Build a responsive landing page', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-foundation-state',
          title: 'Day 4 · State Management',
          description: 'useState, useEffect, the Context API, and custom hooks.',
          estimatedMinutes: 75,
          order: 4,
          lessons: [
            { id: 'fe-foundation-state-l1', title: 'useState & useEffect', contentType: 'code', estimatedMinutes: 20, order: 1 },
            { id: 'fe-foundation-state-l2', title: 'Context API', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'fe-foundation-state-l3', title: 'Custom hooks & data flow', contentType: 'code', estimatedMinutes: 20, order: 3 },
          ],
          practice: [
            { id: 'fe-foundation-state-p1', title: 'Build a dashboard with dynamic state', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'fe-foundation-checkpoint', title: '[Mentor Checkpoint] Foundation Review (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'fe-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-10 · API integration, authentication, dashboards, forms, performance, and accessibility.',
      order: 2,
      modules: [
        {
          id: 'fe-development-api',
          title: 'Day 5 · API Integration',
          description: 'REST APIs, Axios/Fetch, and loading & error states.',
          estimatedMinutes: 60,
          order: 1,
          lessons: [
            { id: 'fe-development-api-l1', title: 'REST APIs & HTTP fundamentals', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-development-api-l2', title: 'Fetching data with Axios & Fetch', contentType: 'code', estimatedMinutes: 20, order: 2 },
            { id: 'fe-development-api-l3', title: 'Loading states & error handling', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'fe-development-api-p1', title: 'Integrate a REST API with proper loading and error states', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-development-auth',
          title: 'Day 6 · Authentication',
          description: 'JWT, protected routes, and session management.',
          estimatedMinutes: 65,
          order: 2,
          lessons: [
            { id: 'fe-development-auth-l1', title: 'JWT fundamentals', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-development-auth-l2', title: 'Protected routes', contentType: 'code', estimatedMinutes: 20, order: 2 },
            { id: 'fe-development-auth-l3', title: 'Session management & authorization', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'fe-development-auth-p1', title: 'Implement protected routes secured with JWT authentication', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-development-dashboard',
          title: 'Day 7 · Dashboard Development',
          description: 'Cards, charts, tables, and filters.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            { id: 'fe-development-dashboard-l1', title: 'Cards & charts', contentType: 'code', estimatedMinutes: 20, order: 1 },
            { id: 'fe-development-dashboard-l2', title: 'Tables & filters', contentType: 'code', estimatedMinutes: 20, order: 2 },
          ],
          practice: [
            { id: 'fe-development-dashboard-p1', title: 'Build a data dashboard with filterable, sortable tables', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-development-forms',
          title: 'Day 8 · Forms',
          description: 'Validation, file upload, and dynamic forms.',
          estimatedMinutes: 60,
          order: 4,
          lessons: [
            { id: 'fe-development-forms-l1', title: 'Form validation', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-development-forms-l2', title: 'File upload', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'fe-development-forms-l3', title: 'Dynamic forms', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'fe-development-forms-p1', title: 'Build a multi-step form with validation and file upload', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'fe-development-checkpoint', title: '[Mentor Checkpoint] Midpoint Assessment (Day 8)', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
        {
          id: 'fe-development-performance',
          title: 'Day 9 · Performance',
          description: 'Lazy loading, memoization, and code splitting.',
          estimatedMinutes: 55,
          order: 5,
          lessons: [
            { id: 'fe-development-performance-l1', title: 'Lazy loading', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-development-performance-l2', title: 'Memoization', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'fe-development-performance-l3', title: 'Code splitting', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'fe-development-performance-p1', title: 'Optimize a slow-rendering component using memoization and lazy loading', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'fe-development-accessibility',
          title: 'Day 10 · Accessibility',
          description: 'WCAG standards, keyboard navigation, and screen readers.',
          estimatedMinutes: 50,
          order: 6,
          lessons: [
            { id: 'fe-development-accessibility-l1', title: 'WCAG fundamentals', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-development-accessibility-l2', title: 'Keyboard navigation', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'fe-development-accessibility-l3', title: 'Screen reader support', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'fe-development-accessibility-p1', title: 'Audit and fix accessibility issues in an existing page', kind: 'debugging', order: 1 },
          ],
        },
      ],
    },
    {
      id: 'fe-project',
      key: 'project',
      title: 'Project',
      description: "Days 11-13 · Industry simulation -- sprint planning, ticket-based feature development, and code review exactly as a real engineering team works.",
      order: 3,
      modules: [
        {
          id: 'fe-project-simulation',
          title: 'Industry Simulation Sprint',
          description: 'Work an assigned ticket end-to-end: plan, build, open a pull request, and respond to review feedback.',
          estimatedMinutes: 40,
          order: 1,
          lessons: [
            { id: 'fe-project-simulation-l1', title: 'Sprint planning & ticket assignment', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
            { id: 'fe-project-simulation-l2', title: 'Feature development workflow', contentType: 'markdown', estimatedMinutes: 10, order: 2 },
            { id: 'fe-project-simulation-l3', title: 'Pull requests & code reviews', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
            { id: 'fe-project-simulation-l4', title: 'Merge conflict resolution', contentType: 'code', estimatedMinutes: 10, order: 4 },
          ],
          practice: [
            { id: 'fe-project-simulation-p1', title: 'Resolve your assigned sprint ticket end-to-end', kind: 'coding', order: 1 },
            { id: 'fe-project-simulation-p2', title: 'Fix a reported bug and verify it with QA testing', kind: 'debugging', order: 2 },
          ],
          submission: { id: 'fe-project-simulation-s1', title: 'Submit your sprint feature pull request', instructions: 'Link the pull request for the ticket you were assigned during the sprint.', requiresLink: true },
          assessment: { id: 'fe-project-simulation-checkpoint', title: '[Mentor Checkpoint] Sprint Evaluation (Day 12)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'fe-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Mentor evaluation of your project-readiness before the capstone and client project allocation.',
      order: 4,
      modules: [
        {
          id: 'fe-readiness-eval',
          title: 'Project Readiness Review (Day 15)',
          description: 'Your mentor reviews sprint performance, code quality, and collaboration before you begin the capstone.',
          order: 1,
          lessons: [
            { id: 'fe-readiness-eval-l1', title: 'What to expect from your readiness review', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'fe-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Capstone project, technical presentation, interview preparation, and certification.',
      order: 5,
      modules: [
        {
          id: 'fe-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Build and ship a production-ready capstone application, then present it for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            { id: 'fe-graduation-capstone-l1', title: 'Capstone briefing & project options', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'fe-graduation-capstone-l2', title: 'Interview & portfolio preparation', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [],
          submission: { id: 'fe-graduation-capstone-s1', title: 'Submit your capstone project for certification review', instructions: 'Include your deployed application link and repository link. Your mentor reviews code quality, architecture, and presentation before certification.', requiresLink: true },
          assessment: { id: 'fe-graduation-final', title: '[Mentor Checkpoint] Final Technical Assessment (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
