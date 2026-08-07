import type { TrainingTrackConfig } from './types';

// [Placeholder curriculum] Shape only -- see frontend.ts for the fully
// worked example of what a module's internals look like.
export const uiuxTrack: TrainingTrackConfig = {
  forte: 'UI / UX Design',
  trackName: 'UI / UX Design',
  description: 'Product design fundamentals: research, wireframing, and high-fidelity UI.',
  stages: [
    {
      id: 'uiux-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Design tooling and fundamentals.',
      order: 1,
      modules: [
        {
          id: 'uiux-foundation-tooling',
          title: '[Placeholder] Design Tooling',
          estimatedMinutes: 60,
          order: 1,
          lessons: [{ id: 'uiux-foundation-tooling-l1', title: '[Placeholder] Figma fundamentals', contentType: 'video', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'uiux-foundation-tooling-p1', title: '[Placeholder] Recreate a component in Figma', kind: 'file-upload', order: 1 }],
          assessment: { id: 'uiux-foundation-tooling-a1', title: '[Placeholder] Tooling check', kind: 'mcq', passingScore: 70, timeLimitMinutes: 10, maxAttempts: 3, order: 1 },
        },
        {
          id: 'uiux-foundation-principles',
          title: '[Placeholder] Design Principles',
          estimatedMinutes: 90,
          order: 2,
          lessons: [{ id: 'uiux-foundation-principles-l1', title: '[Placeholder] Typography & hierarchy', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'uiux-foundation-principles-p1', title: '[Placeholder] Critique exercise', kind: 'interactive', order: 1 }],
          assessment: { id: 'uiux-foundation-principles-a1', title: '[Placeholder] Design principles assessment', kind: 'mixed', passingScore: 70, timeLimitMinutes: 30, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'uiux-development',
      key: 'development',
      title: 'Development',
      description: 'Research, wireframing, and prototyping.',
      order: 2,
      modules: [
        {
          id: 'uiux-development-research',
          title: '[Placeholder] User Research',
          estimatedMinutes: 90,
          order: 1,
          lessons: [{ id: 'uiux-development-research-l1', title: '[Placeholder] Research methods', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'uiux-development-research-p1', title: '[Placeholder] Run a mock user interview', kind: 'interactive', order: 1 }],
          submission: { id: 'uiux-development-research-s1', title: '[Placeholder] Submit your research summary', requiresFile: true },
        },
        {
          id: 'uiux-development-prototype',
          title: '[Placeholder] Wireframing & Prototyping',
          estimatedMinutes: 90,
          order: 2,
          lessons: [{ id: 'uiux-development-prototype-l1', title: '[Placeholder] Low to high fidelity', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'uiux-development-prototype-p1', title: '[Placeholder] Prototype a flow', kind: 'file-upload', order: 1 }],
          assessment: { id: 'uiux-development-prototype-a1', title: '[Placeholder] Prototyping challenge', kind: 'file-upload', passingScore: 70, timeLimitMinutes: 90, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'uiux-project',
      key: 'project',
      title: 'Project',
      description: 'Apply everything on a real, mentor-reviewed design.',
      order: 3,
      modules: [
        { id: 'uiux-project-feature', title: '[Placeholder] Design Build', order: 1, lessons: [], practice: [], submission: { id: 'uiux-project-feature-s1', title: '[Placeholder] Submit your design file', requiresLink: true } },
      ],
    },
    {
      id: 'uiux-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Mentor evaluation of client-readiness before project placement.',
      order: 4,
      modules: [{ id: 'uiux-readiness-eval', title: '[Placeholder] Readiness Evaluation', order: 1, lessons: [], practice: [] }],
    },
    {
      id: 'uiux-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Certificate and project allocation.',
      order: 5,
      modules: [{ id: 'uiux-graduation-cert', title: '[Placeholder] Certificate & Project Allocation', order: 1, lessons: [], practice: [] }],
    },
  ],
};
