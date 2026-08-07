import type { TrainingTrackConfig } from './types';

// Backend Development Training Handbook v1.0 -- Lumora's 18-day,
// mentor-led + project-based + industry-simulation program. Days map onto
// modules (Days 1-4 -> Foundation, 5-10 -> Development, 11-13 -> Project
// sprint simulation, 15 -> Readiness, 16-18 -> Graduation capstone), same
// mapping as frontend.ts. The five mentor checkpoints (handbook section 12)
// are wired in as module assessments except the Day 15 readiness review,
// which stays a bare module: that evaluation runs through the app's
// separate real ReadinessEvaluation admin flow, not a self-service
// assessment here.
export const backendTrack: TrainingTrackConfig = {
  forte: 'Backend',
  trackName: 'Backend Engineering',
  description: 'An 18-day, mentor-led, project-based backend engineering program: REST API design, relational databases with Prisma, authentication & authorization, and a capstone project -- per the Lumora Backend Development Training Handbook v1.0.',
  stages: [
    {
      id: 'be-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Backend project setup, API development, database design, and Prisma ORM.',
      order: 1,
      modules: [
        {
          id: 'be-foundation-setup',
          title: 'Day 1 · Backend Project Setup',
          description: 'Configure your Node.js/Express project, learn the team Git workflow, and ship your first API endpoint.',
          estimatedMinutes: 70,
          order: 1,
          lessons: [
            { id: 'be-foundation-setup-l1', title: 'Project structure & development environment', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-foundation-setup-l2', title: 'Node.js runtime fundamentals', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'be-foundation-setup-l3', title: 'Express framework basics', contentType: 'code', estimatedMinutes: 20, order: 3 },
            { id: 'be-foundation-setup-l4', title: 'Git workflow & environment configuration', contentType: 'markdown', estimatedMinutes: 10, order: 4 },
          ],
          practice: [
            { id: 'be-foundation-setup-p1', title: 'Configure your backend project, create an Express server, and ship your first API endpoint', kind: 'interactive', order: 1 },
          ],
        },
        {
          id: 'be-foundation-api',
          title: 'Day 2 · API Development',
          description: 'REST architecture, HTTP methods, middleware, and route organization.',
          estimatedMinutes: 60,
          order: 2,
          lessons: [
            { id: 'be-foundation-api-l1', title: 'REST architecture & HTTP methods', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-foundation-api-l2', title: 'Request & response handling', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'be-foundation-api-l3', title: 'Middleware & route organization', contentType: 'code', estimatedMinutes: 20, order: 3 },
          ],
          practice: [
            { id: 'be-foundation-api-p1', title: 'Build CRUD APIs with request validation', kind: 'coding', order: 1 },
          ],
          challenge: { id: 'be-foundation-api-c1', title: 'Build a fully validated resource API with pagination and filtering', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
        },
        {
          id: 'be-foundation-database',
          title: 'Day 3 · Database Design',
          description: 'Relational databases, PostgreSQL, schema design, and normalization.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            { id: 'be-foundation-database-l1', title: 'Relational databases & PostgreSQL', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-foundation-database-l2', title: 'Schema design & relationships', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'be-foundation-database-l3', title: 'Normalization', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'be-foundation-database-p1', title: 'Design the Internship Portal database: entity relationships and SQL queries', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-foundation-prisma',
          title: 'Day 4 · Prisma ORM',
          description: 'Prisma schema, models, relations, and database migrations.',
          estimatedMinutes: 70,
          order: 4,
          lessons: [
            { id: 'be-foundation-prisma-l1', title: 'Prisma schema & models', contentType: 'code', estimatedMinutes: 15, order: 1 },
            { id: 'be-foundation-prisma-l2', title: 'Relations & CRUD operations', contentType: 'code', estimatedMinutes: 20, order: 2 },
            { id: 'be-foundation-prisma-l3', title: 'Database migrations & seeding', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'be-foundation-prisma-p1', title: 'Create Prisma models, generate the client, and seed the database', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'be-foundation-checkpoint', title: '[Mentor Checkpoint] Backend Fundamentals Review (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'be-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-10 · Authentication, authorization, business logic, file management, integrations, and optimization.',
      order: 2,
      modules: [
        {
          id: 'be-development-auth',
          title: 'Day 5 · Authentication System',
          description: 'JWT, password hashing, and protected routes.',
          estimatedMinutes: 50,
          order: 1,
          lessons: [
            { id: 'be-development-auth-l1', title: 'JWT fundamentals', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-development-auth-l2', title: 'Password hashing', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'be-development-auth-l3', title: 'Login flow & protected routes', contentType: 'code', estimatedMinutes: 20, order: 3 },
          ],
          practice: [
            { id: 'be-development-auth-p1', title: 'Implement a JWT-based login flow with protected routes', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-development-authorization',
          title: 'Day 6 · Authorization',
          description: 'Role-based access control, permissions, and user roles.',
          estimatedMinutes: 45,
          order: 2,
          lessons: [
            { id: 'be-development-authorization-l1', title: 'Role-based access control (RBAC)', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-development-authorization-l2', title: 'Permission management & user roles', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'be-development-authorization-l3', title: 'Access control middleware', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'be-development-authorization-p1', title: 'Add role-based access control to your API', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-development-business-logic',
          title: 'Day 7 · Business Logic',
          description: 'Service layer, repository pattern, and modular architecture.',
          estimatedMinutes: 45,
          order: 3,
          lessons: [
            { id: 'be-development-business-logic-l1', title: 'Service layer & repository pattern', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-development-business-logic-l2', title: 'Modular architecture', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'be-development-business-logic-l3', title: 'Clean code practices', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'be-development-business-logic-p1', title: 'Refactor an endpoint into a service + repository layer', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-development-files',
          title: 'Day 8 · File Management',
          description: 'Resume upload, cloud storage, and file validation.',
          estimatedMinutes: 45,
          order: 4,
          lessons: [
            { id: 'be-development-files-l1', title: 'Resume & image upload', contentType: 'code', estimatedMinutes: 15, order: 1 },
            { id: 'be-development-files-l2', title: 'Cloud storage integration', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'be-development-files-l3', title: 'File validation', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'be-development-files-p1', title: 'Build a resume upload endpoint with cloud storage and validation', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'be-development-checkpoint', title: '[Mentor Checkpoint] API & Database Assessment (Day 8)', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
        {
          id: 'be-development-integrations',
          title: 'Day 9 · Third-Party Integrations',
          description: 'Email services, external APIs, and environment security.',
          estimatedMinutes: 45,
          order: 5,
          lessons: [
            { id: 'be-development-integrations-l1', title: 'Email & notification services', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-development-integrations-l2', title: 'Integrating external APIs', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'be-development-integrations-l3', title: 'Environment & secrets security', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'be-development-integrations-p1', title: 'Integrate an email notification service', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'be-development-optimization',
          title: 'Day 10 · Backend Optimization',
          description: 'Error handling, logging, and API performance.',
          estimatedMinutes: 45,
          order: 6,
          lessons: [
            { id: 'be-development-optimization-l1', title: 'Error handling & logging', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-development-optimization-l2', title: 'Performance & query optimization', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'be-development-optimization-l3', title: 'API optimization', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'be-development-optimization-p1', title: 'Profile and optimize a slow API endpoint', kind: 'debugging', order: 1 },
          ],
        },
      ],
    },
    {
      id: 'be-project',
      key: 'project',
      title: 'Project',
      description: "Days 11-13 · Industry simulation -- sprint planning, ticket-based feature development, and code review exactly as a real engineering team works.",
      order: 3,
      modules: [
        {
          id: 'be-project-simulation',
          title: 'Industry Simulation Sprint',
          description: 'Work an assigned ticket end-to-end: plan, build, document, and open a pull request.',
          estimatedMinutes: 40,
          order: 1,
          lessons: [
            { id: 'be-project-simulation-l1', title: 'Sprint planning & ticket assignment', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
            { id: 'be-project-simulation-l2', title: 'Feature development & database updates', contentType: 'markdown', estimatedMinutes: 10, order: 2 },
            { id: 'be-project-simulation-l3', title: 'Pull requests, code review & API documentation', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
            { id: 'be-project-simulation-l4', title: 'Merge conflict resolution', contentType: 'code', estimatedMinutes: 10, order: 4 },
          ],
          practice: [
            { id: 'be-project-simulation-p1', title: 'Resolve your assigned sprint ticket end-to-end', kind: 'coding', order: 1 },
            { id: 'be-project-simulation-p2', title: 'Fix a reported bug and verify it with QA testing', kind: 'debugging', order: 2 },
          ],
          submission: { id: 'be-project-simulation-s1', title: 'Submit your sprint feature pull request', instructions: 'Link the pull request for the ticket you were assigned during the sprint, including updated API documentation.', requiresLink: true },
          assessment: { id: 'be-project-simulation-checkpoint', title: '[Mentor Checkpoint] Sprint Review (Day 12)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'be-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Mentor evaluation of your production-readiness before the capstone and client project allocation.',
      order: 4,
      modules: [
        {
          id: 'be-readiness-eval',
          title: 'Production Readiness Assessment (Day 15)',
          description: 'Your mentor reviews backend service quality, security practices, and collaboration before you begin the capstone.',
          order: 1,
          lessons: [
            { id: 'be-readiness-eval-l1', title: 'What to expect from your production readiness review', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'be-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Capstone backend system, technical presentation, interview preparation, and certification.',
      order: 5,
      modules: [
        {
          id: 'be-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Build and ship a production-ready backend system, then present it for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            { id: 'be-graduation-capstone-l1', title: 'Capstone briefing & project options', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'be-graduation-capstone-l2', title: 'Interview & portfolio preparation', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [],
          submission: { id: 'be-graduation-capstone-s1', title: 'Submit your capstone backend project for certification review', instructions: 'Include your deployed API link, repository link, and API documentation. Your mentor reviews architecture, security, and database design before certification.', requiresLink: true },
          assessment: { id: 'be-graduation-final', title: '[Mentor Checkpoint] Final Technical Evaluation (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
