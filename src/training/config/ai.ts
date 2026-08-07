import type { TrainingTrackConfig } from './types';

// [Placeholder curriculum] Shape only -- see frontend.ts for the fully
// worked example of what a module's internals look like.
export const aiTrack: TrainingTrackConfig = {
  forte: 'Agentic AI',
  trackName: 'Agentic AI Engineering',
  description: 'LLM-backed agent workflows: prompting, tool use, and evaluation.',
  stages: [
    {
      id: 'ai-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Git, Python, and LLM fundamentals.',
      order: 1,
      modules: [
        {
          id: 'ai-foundation-git',
          title: '[Placeholder] Git & Version Control',
          estimatedMinutes: 60,
          order: 1,
          lessons: [{ id: 'ai-foundation-git-l1', title: '[Placeholder] Branching workflows', contentType: 'video', estimatedMinutes: 15, order: 1 }],
          practice: [{ id: 'ai-foundation-git-p1', title: '[Placeholder] Resolve a merge conflict', kind: 'interactive', order: 1 }],
          assessment: { id: 'ai-foundation-git-a1', title: '[Placeholder] Git fundamentals check', kind: 'mcq', passingScore: 70, timeLimitMinutes: 10, maxAttempts: 3, order: 1 },
        },
        {
          id: 'ai-foundation-llm',
          title: '[Placeholder] LLM Fundamentals',
          description: 'Prompting, context windows, and tool calling.',
          estimatedMinutes: 120,
          order: 2,
          lessons: [
            { id: 'ai-foundation-llm-l1', title: '[Placeholder] How LLMs generate text', contentType: 'markdown', estimatedMinutes: 20, order: 1 },
            { id: 'ai-foundation-llm-l2', title: '[Placeholder] Prompt design patterns', contentType: 'markdown', estimatedMinutes: 20, order: 2 },
          ],
          practice: [{ id: 'ai-foundation-llm-p1', title: '[Placeholder] Write a tool-calling prompt', kind: 'interactive', order: 1 }],
          assessment: { id: 'ai-foundation-llm-a1', title: '[Placeholder] Prompting assessment', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'ai-development',
      key: 'development',
      title: 'Development',
      description: 'Building and evaluating agent workflows.',
      order: 2,
      modules: [
        {
          id: 'ai-development-agents',
          title: '[Placeholder] Agent Workflows',
          estimatedMinutes: 90,
          order: 1,
          lessons: [{ id: 'ai-development-agents-l1', title: '[Placeholder] Tool use & orchestration', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'ai-development-agents-p1', title: '[Placeholder] Build a single-tool agent', kind: 'coding', order: 1 }],
          submission: { id: 'ai-development-agents-s1', title: '[Placeholder] Submit your agent', requiresLink: true },
        },
        {
          id: 'ai-development-eval',
          title: '[Placeholder] Evaluation & Guardrails',
          estimatedMinutes: 90,
          order: 2,
          lessons: [{ id: 'ai-development-eval-l1', title: '[Placeholder] Evaluation harnesses', contentType: 'markdown', estimatedMinutes: 20, order: 1 }],
          practice: [{ id: 'ai-development-eval-p1', title: '[Placeholder] Write an eval suite', kind: 'coding', order: 1 }],
          assessment: { id: 'ai-development-eval-a1', title: '[Placeholder] Evaluation challenge', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'ai-project',
      key: 'project',
      title: 'Project',
      description: 'Apply everything on a real, mentor-reviewed agent workflow.',
      order: 3,
      modules: [
        { id: 'ai-project-feature', title: '[Placeholder] Agent Build', order: 1, lessons: [], practice: [], submission: { id: 'ai-project-feature-s1', title: '[Placeholder] Submit your agent PR', requiresLink: true } },
      ],
    },
    {
      id: 'ai-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Mentor evaluation of client-readiness before project placement.',
      order: 4,
      modules: [{ id: 'ai-readiness-eval', title: '[Placeholder] Readiness Evaluation', order: 1, lessons: [], practice: [] }],
    },
    {
      id: 'ai-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Certificate and project allocation.',
      order: 5,
      modules: [{ id: 'ai-graduation-cert', title: '[Placeholder] Certificate & Project Allocation', order: 1, lessons: [], practice: [] }],
    },
  ],
};
