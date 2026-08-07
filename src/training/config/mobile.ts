import type { TrainingTrackConfig } from './types';

// Mobile Development Training Handbook v1.0 -- Lumora's 18-day, mentor-led
// + project-based + product development simulation program (Flutter).
// Days map onto modules (Days 1-4 -> Foundation, 5-10 -> Development,
// 11-13 -> Project sprint simulation, 15 -> Readiness, 16-18 -> Graduation
// capstone), same mapping as frontend.ts/backend.ts/ai.ts. The five mentor
// checkpoints (handbook section 12) are wired in as module assessments
// except the Day 15 readiness review, which stays a bare module: that
// evaluation runs through the app's separate real ReadinessEvaluation
// admin flow, not a self-service assessment here.
export const mobileTrack: TrainingTrackConfig = {
  forte: 'Mobile Development',
  trackName: 'Mobile Development',
  description: 'An 18-day, mentor-led, project-based Flutter mobile engineering program: responsive UI, state management, Firebase integration, and a capstone app -- per the Lumora Mobile Development Training Handbook v1.0.',
  stages: [
    {
      id: 'mob-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Flutter project setup, UI development, Dart programming, and state management.',
      order: 1,
      modules: [
        {
          id: 'mob-foundation-setup',
          title: 'Day 1 · Flutter Project Setup',
          description: 'Configure your Flutter project, learn the team Git workflow, and ship your first application.',
          estimatedMinutes: 65,
          order: 1,
          lessons: [
            { id: 'mob-foundation-setup-l1', title: 'Flutter architecture & project structure', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'mob-foundation-setup-l2', title: 'Development environment & emulator configuration', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'mob-foundation-setup-l3', title: 'Git workflow', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'mob-foundation-setup-p1', title: 'Create a Flutter project, configure your environment, and ship your first application', kind: 'interactive', order: 1 },
          ],
        },
        {
          id: 'mob-foundation-ui',
          title: 'Day 2 · UI Development',
          description: 'Widget tree, layout widgets, responsive design, and navigation.',
          estimatedMinutes: 60,
          order: 2,
          lessons: [
            { id: 'mob-foundation-ui-l1', title: 'Widget tree & layout widgets', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'mob-foundation-ui-l2', title: 'Responsive design & Material Design', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'mob-foundation-ui-l3', title: 'Navigation', contentType: 'code', estimatedMinutes: 20, order: 3 },
          ],
          practice: [
            { id: 'mob-foundation-ui-p1', title: 'Build authentication screens, a dashboard layout, and a navigation system', kind: 'coding', order: 1 },
          ],
          challenge: { id: 'mob-foundation-ui-c1', title: 'Build a fully responsive, adaptive dashboard with custom navigation', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
        },
        {
          id: 'mob-foundation-dart',
          title: 'Day 3 · Dart Programming',
          description: 'Object-oriented programming, async programming, and clean code.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            { id: 'mob-foundation-dart-l1', title: 'Object-oriented programming in Dart', contentType: 'code', estimatedMinutes: 15, order: 1 },
            { id: 'mob-foundation-dart-l2', title: 'Async programming & collections', contentType: 'code', estimatedMinutes: 20, order: 2 },
            { id: 'mob-foundation-dart-l3', title: 'Exception handling & clean code', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'mob-foundation-dart-p1', title: 'Write utility functions, data models, and business logic', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'mob-foundation-state',
          title: 'Day 4 · State Management',
          description: 'Provider, Riverpod, and application architecture.',
          estimatedMinutes: 65,
          order: 4,
          lessons: [
            { id: 'mob-foundation-state-l1', title: 'Provider & local state', contentType: 'code', estimatedMinutes: 20, order: 1 },
            { id: 'mob-foundation-state-l2', title: 'Riverpod introduction & global state', contentType: 'code', estimatedMinutes: 20, order: 2 },
            { id: 'mob-foundation-state-l3', title: 'Application architecture', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'mob-foundation-state-p1', title: 'Build user profile management, a dynamic dashboard, and theme switching', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'mob-foundation-checkpoint', title: '[Mentor Checkpoint] Flutter Fundamentals Review (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'mob-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-10 · Backend integration, authentication, local storage, Firebase, performance, and testing.',
      order: 2,
      modules: [
        {
          id: 'mob-development-backend',
          title: 'Day 5 · Backend Integration',
          description: 'REST APIs, HTTP requests, and JSON parsing.',
          estimatedMinutes: 50,
          order: 1,
          lessons: [
            { id: 'mob-development-backend-l1', title: 'REST APIs & HTTP requests', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'mob-development-backend-l2', title: 'JSON parsing & error handling', contentType: 'code', estimatedMinutes: 20, order: 2 },
          ],
          practice: [
            { id: 'mob-development-backend-p1', title: 'Build an internship listings screen and a user profile API integration', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'mob-development-auth',
          title: 'Day 6 · Authentication',
          description: 'JWT, Firebase Authentication, and secure login.',
          estimatedMinutes: 50,
          order: 2,
          lessons: [
            { id: 'mob-development-auth-l1', title: 'JWT & session management', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'mob-development-auth-l2', title: 'Firebase Authentication & secure login', contentType: 'code', estimatedMinutes: 20, order: 2 },
          ],
          practice: [
            { id: 'mob-development-auth-p1', title: 'Build a login flow with registration and password recovery', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'mob-development-storage',
          title: 'Day 7 · Local Storage',
          description: 'Shared Preferences, SQLite, Hive, and offline data.',
          estimatedMinutes: 45,
          order: 3,
          lessons: [
            { id: 'mob-development-storage-l1', title: 'Shared Preferences & SQLite', contentType: 'code', estimatedMinutes: 15, order: 1 },
            { id: 'mob-development-storage-l2', title: 'Hive & offline data', contentType: 'code', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'mob-development-storage-p1', title: 'Build offline user settings and cache API data locally', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'mob-development-firebase',
          title: 'Day 8 · Firebase Integration',
          description: 'Cloud Firestore, Cloud Storage, push notifications, and analytics.',
          estimatedMinutes: 55,
          order: 4,
          lessons: [
            { id: 'mob-development-firebase-l1', title: 'Cloud Firestore & Cloud Storage', contentType: 'code', estimatedMinutes: 20, order: 1 },
            { id: 'mob-development-firebase-l2', title: 'Push notifications & analytics', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'mob-development-firebase-p1', title: 'Build a notification system and an image upload feature', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'mob-development-checkpoint', title: '[Mentor Checkpoint] API & Firebase Assessment (Day 8)', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
        {
          id: 'mob-development-performance',
          title: 'Day 9 · Performance Optimization',
          description: 'Widget optimization, lazy loading, and memory management.',
          estimatedMinutes: 40,
          order: 5,
          lessons: [
            { id: 'mob-development-performance-l1', title: 'Widget optimization & lazy loading', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'mob-development-performance-l2', title: 'Image optimization & memory management', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'mob-development-performance-p1', title: 'Improve app performance and debug a slow screen', kind: 'debugging', order: 1 },
          ],
        },
        {
          id: 'mob-development-testing',
          title: 'Day 10 · Testing',
          description: 'Widget testing, integration testing, and debugging.',
          estimatedMinutes: 40,
          order: 6,
          lessons: [
            { id: 'mob-development-testing-l1', title: 'Widget & integration testing', contentType: 'code', estimatedMinutes: 20, order: 1 },
            { id: 'mob-development-testing-l2', title: 'Debugging & error tracking', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'mob-development-testing-p1', title: 'Write test cases and fix a reported bug', kind: 'debugging', order: 1 },
          ],
        },
      ],
    },
    {
      id: 'mob-project',
      key: 'project',
      title: 'Project',
      description: "Days 11-13 · Industry simulation -- sprint planning, ticket-based feature development, and code review exactly as a real mobile engineering team works.",
      order: 3,
      modules: [
        {
          id: 'mob-project-simulation',
          title: 'Industry Simulation Sprint',
          description: 'Work an assigned ticket end-to-end: plan, build, test, and open a pull request.',
          estimatedMinutes: 40,
          order: 1,
          lessons: [
            { id: 'mob-project-simulation-l1', title: 'Sprint planning & ticket assignment', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
            { id: 'mob-project-simulation-l2', title: 'Feature development & API integration', contentType: 'markdown', estimatedMinutes: 10, order: 2 },
            { id: 'mob-project-simulation-l3', title: 'Code reviews & UI fixes', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
            { id: 'mob-project-simulation-l4', title: 'QA testing & deployment preparation', contentType: 'markdown', estimatedMinutes: 10, order: 4 },
          ],
          practice: [
            { id: 'mob-project-simulation-p1', title: 'Resolve your assigned sprint ticket end-to-end', kind: 'coding', order: 1 },
            { id: 'mob-project-simulation-p2', title: 'Fix a reported bug and verify it with QA testing', kind: 'debugging', order: 2 },
          ],
          submission: { id: 'mob-project-simulation-s1', title: 'Submit your sprint feature pull request', instructions: 'Link the pull request for the ticket you were assigned during the sprint.', requiresLink: true },
          assessment: { id: 'mob-project-simulation-checkpoint', title: '[Mentor Checkpoint] Sprint Review (Day 12)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'mob-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Mentor evaluation of your application-readiness before the capstone and client project allocation.',
      order: 4,
      modules: [
        {
          id: 'mob-readiness-eval',
          title: 'Application Readiness Assessment (Day 15)',
          description: 'Your mentor reviews app quality, performance, and collaboration before you begin the capstone.',
          order: 1,
          lessons: [
            { id: 'mob-readiness-eval-l1', title: 'What to expect from your application readiness assessment', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'mob-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Capstone mobile application, technical presentation, interview preparation, and certification.',
      order: 5,
      modules: [
        {
          id: 'mob-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Build and ship a production-ready mobile application, then present it for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            { id: 'mob-graduation-capstone-l1', title: 'Capstone briefing & project options', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'mob-graduation-capstone-l2', title: 'Interview & portfolio preparation', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [],
          submission: { id: 'mob-graduation-capstone-s1', title: 'Submit your capstone mobile application for certification review', instructions: 'Include your source code repository link and a deployment build. Your mentor reviews usability, performance, and production readiness before certification.', requiresLink: true },
          assessment: { id: 'mob-graduation-final', title: '[Mentor Checkpoint] Final Mobile Application Demonstration (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
