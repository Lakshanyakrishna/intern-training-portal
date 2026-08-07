import type { TrainingTrackConfig } from './types';

// Lumora UI/UX Design Internship Program handbook (18-20 day fast track).
// Days map onto modules following the handbook's own phase boundaries
// (Days 1-4 -> Foundation, 5-9 -> Development, 10-14 -> Project design
// sprint, 15 -> Readiness, 16-18 -> Graduation capstone) -- the same
// Program -> Stage -> Module -> Lesson/Practice/Challenge/Assessment/
// Submission schema as frontend.ts/backend.ts/ai.ts/mobile.ts, so the
// existing generic UI needs no changes. Each day's "Exercise" maps to
// `practice`, its "Assignment" maps to `challenge` (a harder, distinct
// step the module page renders separately) -- this handbook is the only
// one of the five that gives every foundation/development day both, so
// the mapping is used consistently through Day 9. The three "Mentor
// Review" checkpoints (Days 4, 9, 14) and the Day 18 capstone
// presentation are wired in as module assessments; the Day 15 "Design
// Review Session" stays a bare module, same as every other track's
// Readiness stage -- that evaluation runs through the app's separate
// real ReadinessEvaluation admin flow.
export const uiuxTrack: TrainingTrackConfig = {
  forte: 'UI / UX Design',
  trackName: 'UI / UX Design',
  description: 'An 18-day, mentor-led, project-based UI/UX design program: research, information architecture, visual design systems, prototyping, and a capstone platform design -- per the Lumora UI/UX Design Internship Program handbook.',
  stages: [
    {
      id: 'uiux-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Product design process, user research, information architecture, and wireframing.',
      order: 1,
      modules: [
        {
          id: 'uiux-foundation-intro',
          title: 'Day 1 · Introduction to Product Design',
          description: 'UI vs UX, the product design process, and the Lumora design workflow.',
          estimatedMinutes: 55,
          order: 1,
          lessons: [
            { id: 'uiux-foundation-intro-l1', title: 'UI vs UX', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
            { id: 'uiux-foundation-intro-l2', title: 'Product design process & design thinking', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'uiux-foundation-intro-l3', title: 'Role of a UI/UX designer & the Lumora design workflow', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
          ],
          practice: [
            { id: 'uiux-foundation-intro-p1', title: 'Analyze 3 popular apps and identify good and bad UX', kind: 'interactive', order: 1 },
          ],
          challenge: { id: 'uiux-foundation-intro-c1', title: 'Write a UX audit for an existing application', kind: 'file-upload', description: "The day's assignment -- a harder, take-home deliverable beyond the in-class exercise.", order: 1 },
        },
        {
          id: 'uiux-foundation-research',
          title: 'Day 2 · User Research',
          description: 'Personas, journey mapping, empathy maps, and problem statements.',
          estimatedMinutes: 55,
          order: 2,
          lessons: [
            { id: 'uiux-foundation-research-l1', title: 'User personas', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-foundation-research-l2', title: 'User journey mapping & empathy maps', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'uiux-foundation-research-l3', title: 'User interviews & problem statements', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
          ],
          practice: [
            { id: 'uiux-foundation-research-p1', title: 'Create a persona for an internship platform', kind: 'file-upload', order: 1 },
          ],
          challenge: { id: 'uiux-foundation-research-c1', title: 'Build a journey map', kind: 'file-upload', description: "The day's assignment -- a harder, take-home deliverable beyond the in-class exercise.", order: 1 },
        },
        {
          id: 'uiux-foundation-ia',
          title: 'Day 3 · Information Architecture',
          description: 'Site maps, navigation systems, content hierarchy, and user flows.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            { id: 'uiux-foundation-ia-l1', title: 'Site maps & navigation systems', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-foundation-ia-l2', title: 'Content hierarchy', contentType: 'markdown', estimatedMinutes: 10, order: 2 },
            { id: 'uiux-foundation-ia-l3', title: 'User flows & task flows', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'uiux-foundation-ia-p1', title: 'Create a sitemap', kind: 'file-upload', order: 1 },
          ],
          challenge: { id: 'uiux-foundation-ia-c1', title: 'Design the user flow for the applicant journey', kind: 'file-upload', description: "The day's assignment -- a harder, take-home deliverable beyond the in-class exercise.", order: 1 },
        },
        {
          id: 'uiux-foundation-wireframing',
          title: 'Day 4 · Wireframing',
          description: 'Low-fidelity wireframes, layout principles, spacing, and grid systems.',
          estimatedMinutes: 60,
          order: 4,
          lessons: [
            { id: 'uiux-foundation-wireframing-l1', title: 'Low-fidelity wireframes', contentType: 'image', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-foundation-wireframing-l2', title: 'Layout principles, spacing & visual hierarchy', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'uiux-foundation-wireframing-l3', title: 'Grid systems', contentType: 'image', estimatedMinutes: 10, order: 3 },
          ],
          practice: [
            { id: 'uiux-foundation-wireframing-p1', title: 'Sketch dashboard wireframes', kind: 'file-upload', order: 1 },
          ],
          challenge: { id: 'uiux-foundation-wireframing-c1', title: 'Wireframe the Applicant Interface', kind: 'file-upload', description: "The day's assignment -- a harder, take-home deliverable beyond the in-class exercise.", order: 1 },
          assessment: { id: 'uiux-foundation-checkpoint', title: '[Mentor Checkpoint] Mentor Review 1 (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'uiux-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-9 · Figma fundamentals, visual design, components, responsive design, and prototyping.',
      order: 2,
      modules: [
        {
          id: 'uiux-development-figma',
          title: 'Day 5 · Figma Fundamentals',
          description: 'Frames, components, auto layout, constraints, and variables.',
          estimatedMinutes: 45,
          order: 1,
          lessons: [
            { id: 'uiux-development-figma-l1', title: 'Frames & components', contentType: 'video', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-development-figma-l2', title: 'Auto layout & constraints', contentType: 'video', estimatedMinutes: 15, order: 2 },
            { id: 'uiux-development-figma-l3', title: 'Variables', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
          ],
          practice: [
            { id: 'uiux-development-figma-p1', title: 'Recreate an existing landing page in Figma', kind: 'file-upload', order: 1 },
          ],
        },
        {
          id: 'uiux-development-visual',
          title: 'Day 6 · Visual Design',
          description: 'Typography, color systems, contrast, icons, and accessibility.',
          estimatedMinutes: 45,
          order: 2,
          lessons: [
            { id: 'uiux-development-visual-l1', title: 'Typography', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-development-visual-l2', title: 'Color systems & contrast', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'uiux-development-visual-l3', title: 'Icons & accessibility', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
          ],
          practice: [
            { id: 'uiux-development-visual-p1', title: 'Build a color system', kind: 'file-upload', order: 1 },
          ],
        },
        {
          id: 'uiux-development-components',
          title: 'Day 7 · Components',
          description: 'Design systems, buttons, inputs, cards, and reusable components.',
          estimatedMinutes: 50,
          order: 3,
          lessons: [
            { id: 'uiux-development-components-l1', title: 'Design systems overview', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-development-components-l2', title: 'Buttons, inputs & cards', contentType: 'video', estimatedMinutes: 15, order: 2 },
            { id: 'uiux-development-components-l3', title: 'Navigation & reusable components', contentType: 'video', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'uiux-development-components-p1', title: 'Create a reusable UI kit', kind: 'file-upload', order: 1 },
          ],
        },
        {
          id: 'uiux-development-responsive',
          title: 'Day 8 · Responsive Design',
          description: 'Desktop, tablet, mobile layouts, breakpoints, and adaptive layouts.',
          estimatedMinutes: 40,
          order: 4,
          lessons: [
            { id: 'uiux-development-responsive-l1', title: 'Desktop, tablet & mobile layouts', contentType: 'image', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-development-responsive-l2', title: 'Breakpoints & adaptive layouts', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'uiux-development-responsive-p1', title: 'Convert desktop screens to mobile', kind: 'file-upload', order: 1 },
          ],
        },
        {
          id: 'uiux-development-prototyping',
          title: 'Day 9 · Prototyping',
          description: 'Interactive components, Smart Animate, microinteractions, and design handoff.',
          estimatedMinutes: 50,
          order: 5,
          lessons: [
            { id: 'uiux-development-prototyping-l1', title: 'Interactive components & Smart Animate', contentType: 'video', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-development-prototyping-l2', title: 'Microinteractions', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'uiux-development-prototyping-l3', title: 'Design handoff', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
          ],
          practice: [
            { id: 'uiux-development-prototyping-p1', title: 'Prototype the onboarding flow', kind: 'file-upload', order: 1 },
          ],
          assessment: { id: 'uiux-development-checkpoint', title: '[Mentor Checkpoint] Mentor Review 2 (Day 9)', kind: 'file-upload', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'uiux-project',
      key: 'project',
      title: 'Project',
      description: 'Days 10-14 · Product design sprint -- design the real Lumora platform surfaces end-to-end, exactly as a working product design team would.',
      order: 3,
      modules: [
        {
          id: 'uiux-project-applicant',
          title: 'Day 10 · Applicant Interface',
          description: 'Design the applicant-facing experience for the Lumora platform.',
          estimatedMinutes: 20,
          order: 1,
          lessons: [{ id: 'uiux-project-applicant-l1', title: 'Applicant interface brief', contentType: 'markdown', estimatedMinutes: 10, order: 1 }],
          practice: [{ id: 'uiux-project-applicant-p1', title: 'Design the Applicant Interface', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-training',
          title: 'Day 11 · Training Workspace',
          description: 'Design the training workspace experience for the Lumora platform.',
          estimatedMinutes: 20,
          order: 2,
          lessons: [{ id: 'uiux-project-training-l1', title: 'Training workspace brief', contentType: 'markdown', estimatedMinutes: 10, order: 1 }],
          practice: [{ id: 'uiux-project-training-p1', title: 'Design the Training Workspace', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-mentor',
          title: 'Day 12 · Mentor Dashboard',
          description: 'Design the mentor-facing dashboard for the Lumora platform.',
          estimatedMinutes: 20,
          order: 3,
          lessons: [{ id: 'uiux-project-mentor-l1', title: 'Mentor dashboard brief', contentType: 'markdown', estimatedMinutes: 10, order: 1 }],
          practice: [{ id: 'uiux-project-mentor-p1', title: 'Design the Mentor Dashboard', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-admin',
          title: 'Day 13 · Admin Portal',
          description: 'Design the admin portal for the Lumora platform.',
          estimatedMinutes: 20,
          order: 4,
          lessons: [{ id: 'uiux-project-admin-l1', title: 'Admin portal brief', contentType: 'markdown', estimatedMinutes: 10, order: 1 }],
          practice: [{ id: 'uiux-project-admin-p1', title: 'Design the Admin Portal', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-system',
          title: 'Day 14 · Design System Refinement',
          description: 'Consolidate and refine your design system across every screen you\'ve built this sprint.',
          estimatedMinutes: 20,
          order: 5,
          lessons: [{ id: 'uiux-project-system-l1', title: 'Design system refinement brief', contentType: 'markdown', estimatedMinutes: 10, order: 1 }],
          practice: [{ id: 'uiux-project-system-p1', title: 'Refine and consolidate your design system across all screens', kind: 'file-upload', order: 1 }],
        },
        {
          id: 'uiux-project-miniproject',
          title: 'Mini Project · Internship Workflow Design',
          description: 'Design one complete internship workflow end-to-end: landing page, opportunities, application, interview scheduling, and training dashboard.',
          estimatedMinutes: 20,
          order: 6,
          lessons: [{ id: 'uiux-project-miniproject-l1', title: 'Mini project brief', contentType: 'markdown', estimatedMinutes: 10, order: 1 }],
          practice: [{ id: 'uiux-project-miniproject-p1', title: 'Design the landing page, opportunities, application, and interview scheduling flows', kind: 'file-upload', order: 1 }],
          submission: { id: 'uiux-project-miniproject-s1', title: 'Submit your mini project for review', instructions: 'Link your Figma file covering the landing page, opportunities, application, interview scheduling, and training dashboard.', requiresLink: true },
          assessment: { id: 'uiux-project-checkpoint', title: '[Mentor Checkpoint] Mentor Review 3 (Day 14)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'uiux-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Design review session -- mentor feedback and revisions before the capstone.',
      order: 4,
      modules: [
        {
          id: 'uiux-readiness-eval',
          title: 'Design Review Session (Day 15)',
          description: 'Your mentor reviews your work and you revise designs based on feedback before the final stretch.',
          order: 1,
          lessons: [
            { id: 'uiux-readiness-eval-l1', title: 'What to expect from your design review session', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'uiux-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Developer handoff, portfolio preparation, and capstone presentation.',
      order: 5,
      modules: [
        {
          id: 'uiux-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Prepare your developer handoff and portfolio, then present the complete Lumora Internship Platform for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            { id: 'uiux-graduation-capstone-l1', title: 'Developer collaboration & handoff', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'uiux-graduation-capstone-l2', title: 'Portfolio & case study preparation', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [],
          submission: { id: 'uiux-graduation-capstone-s1', title: 'Submit your capstone project for certification review', instructions: 'Include your Figma file link, prototype link, and case study document covering the landing page, opportunities, applicant experience, interview scheduling, training workspace, mentor dashboard, admin portal, responsive screens, and design system.', requiresLink: true },
          assessment: { id: 'uiux-graduation-final', title: '[Mentor Checkpoint] Capstone Presentation (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
