import type { TrainingTrackConfig } from './types';

// Agentic AI Training Handbook v1.0 -- Lumora's 18-day, mentor-led + AI
// product development + project-based program. Days map onto modules
// (Days 1-4 -> Foundation, 5-10 -> Development, 11-13 -> Project sprint
// simulation, 15 -> Readiness, 16-18 -> Graduation capstone), same mapping
// as frontend.ts/backend.ts. The five mentor checkpoints (handbook section
// 12) are wired in as module assessments except the Day 15 readiness
// review, which stays a bare module: that evaluation runs through the
// app's separate real ReadinessEvaluation admin flow, not a self-service
// assessment here.
export const aiTrack: TrainingTrackConfig = {
  forte: 'Agentic AI',
  trackName: 'Agentic AI Engineering',
  description: 'An 18-day, mentor-led, project-based agentic AI program: LLM integration, prompt engineering, RAG, autonomous agents, and a capstone AI product -- per the Lumora Agentic AI Training Handbook v1.0.',
  stages: [
    {
      id: 'ai-foundation',
      key: 'foundation',
      title: 'Foundation',
      description: 'Days 1-4 · Modern AI fundamentals, prompt engineering, LLM integration, and AI product architecture.',
      order: 1,
      modules: [
        {
          id: 'ai-foundation-intro',
          title: 'Day 1 · Introduction to Modern AI',
          description: 'The LLM ecosystem, AI product lifecycle, and your first AI chatbot.',
          estimatedMinutes: 65,
          order: 1,
          lessons: [
            { id: 'ai-foundation-intro-l1', title: 'Evolution of AI & generative AI', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-foundation-intro-l2', title: 'The LLM ecosystem & AI applications', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'ai-foundation-intro-l3', title: 'AI product lifecycle', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
            { id: 'ai-foundation-intro-l4', title: 'OpenAI API integration', contentType: 'code', estimatedMinutes: 15, order: 4 },
          ],
          practice: [
            { id: 'ai-foundation-intro-p1', title: 'Set up AI-assisted coding tools and build your first AI chatbot', kind: 'interactive', order: 1 },
          ],
        },
        {
          id: 'ai-foundation-prompting',
          title: 'Day 2 · Prompt Engineering',
          description: 'Prompt design, system prompts, few-shot prompting, and structured outputs.',
          estimatedMinutes: 55,
          order: 2,
          lessons: [
            { id: 'ai-foundation-prompting-l1', title: 'Prompt design & system prompts', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-foundation-prompting-l2', title: 'Few-shot prompting & chain-of-thought', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'ai-foundation-prompting-l3', title: 'Structured outputs', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'ai-foundation-prompting-p1', title: 'Build a prompt library and evaluate AI responses', kind: 'interactive', order: 1 },
          ],
          challenge: { id: 'ai-foundation-prompting-c1', title: 'Optimize a prompt library for accuracy and structured-output reliability', kind: 'coding', description: 'Harder, capstone-style exercise for this module.', order: 1 },
        },
        {
          id: 'ai-foundation-integration',
          title: 'Day 3 · LLM Integration',
          description: 'API integration, context windows, token management, and streaming responses.',
          estimatedMinutes: 55,
          order: 3,
          lessons: [
            { id: 'ai-foundation-integration-l1', title: 'API integration & model parameters', contentType: 'code', estimatedMinutes: 15, order: 1 },
            { id: 'ai-foundation-integration-l2', title: 'Context windows & token management', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'ai-foundation-integration-l3', title: 'Streaming responses', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'ai-foundation-integration-p1', title: 'Build a context-aware AI chatbot with memory', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-foundation-architecture',
          title: 'Day 4 · AI Product Architecture',
          description: 'AI application architecture, backend/frontend integration, and secure API management.',
          estimatedMinutes: 55,
          order: 4,
          lessons: [
            { id: 'ai-foundation-architecture-l1', title: 'AI application architecture', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-foundation-architecture-l2', title: 'Backend & frontend integration', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
            { id: 'ai-foundation-architecture-l3', title: 'Secure API key management', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
          ],
          practice: [
            { id: 'ai-foundation-architecture-p1', title: 'Architect an AI assistant with a basic workflow', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'ai-foundation-checkpoint', title: '[Mentor Checkpoint] AI Foundations Review (Day 4)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'ai-development',
      key: 'development',
      title: 'Development',
      description: 'Days 5-10 · RAG, LangChain, LangGraph, AI agents, multi-agent systems, and AI evaluation.',
      order: 2,
      modules: [
        {
          id: 'ai-development-rag',
          title: 'Day 5 · Retrieval-Augmented Generation (RAG)',
          description: 'Embeddings, vector databases, and context injection.',
          estimatedMinutes: 55,
          order: 1,
          lessons: [
            { id: 'ai-development-rag-l1', title: 'Embeddings & vector databases', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-development-rag-l2', title: 'Document retrieval & chunking', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'ai-development-rag-l3', title: 'Context injection', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'ai-development-rag-p1', title: 'Build a PDF chatbot backed by a knowledge base', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-development-langchain',
          title: 'Day 6 · LangChain Fundamentals',
          description: 'Chains, memory, tool calling, and agents.',
          estimatedMinutes: 45,
          order: 2,
          lessons: [
            { id: 'ai-development-langchain-l1', title: 'Chains & memory', contentType: 'code', estimatedMinutes: 15, order: 1 },
            { id: 'ai-development-langchain-l2', title: 'Tool calling', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'ai-development-langchain-l3', title: 'Agents overview', contentType: 'markdown', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'ai-development-langchain-p1', title: 'Automate a workflow with LangChain', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-development-langgraph',
          title: 'Day 7 · LangGraph & Multi-Step Workflows',
          description: 'State management, workflow graphs, and conditional execution.',
          estimatedMinutes: 40,
          order: 3,
          lessons: [
            { id: 'ai-development-langgraph-l1', title: 'State management & workflow graphs', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-development-langgraph-l2', title: 'Decision paths & conditional execution', contentType: 'code', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'ai-development-langgraph-p1', title: 'Build a multi-step AI task pipeline with LangGraph', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-development-agents',
          title: 'Day 8 · AI Agents',
          description: 'Autonomous agents, planning, reasoning, and task execution.',
          estimatedMinutes: 55,
          order: 4,
          lessons: [
            { id: 'ai-development-agents-l1', title: 'Autonomous agents & planning', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-development-agents-l2', title: 'Reasoning & tool usage', contentType: 'code', estimatedMinutes: 15, order: 2 },
            { id: 'ai-development-agents-l3', title: 'Task execution', contentType: 'code', estimatedMinutes: 15, order: 3 },
          ],
          practice: [
            { id: 'ai-development-agents-p1', title: 'Build a resume screening agent', kind: 'coding', order: 1 },
          ],
          assessment: { id: 'ai-development-checkpoint', title: '[Mentor Checkpoint] Agent Development Assessment (Day 8)', kind: 'coding', passingScore: 70, timeLimitMinutes: 60, maxAttempts: 2, order: 1 },
        },
        {
          id: 'ai-development-multiagent',
          title: 'Day 9 · Multi-Agent Systems',
          description: 'Agent collaboration, delegation, and human-in-the-loop.',
          estimatedMinutes: 40,
          order: 5,
          lessons: [
            { id: 'ai-development-multiagent-l1', title: 'Agent collaboration & delegation', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-development-multiagent-l2', title: 'Coordination & human-in-the-loop', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'ai-development-multiagent-p1', title: 'Build a multi-agent research workflow', kind: 'coding', order: 1 },
          ],
        },
        {
          id: 'ai-development-evaluation',
          title: 'Day 10 · AI Evaluation',
          description: 'Hallucination detection, prompt testing, and AI safety.',
          estimatedMinutes: 40,
          order: 6,
          lessons: [
            { id: 'ai-development-evaluation-l1', title: 'Hallucination detection & prompt testing', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-development-evaluation-l2', title: 'Performance optimization & AI safety', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [
            { id: 'ai-development-evaluation-p1', title: 'Evaluate an AI system for quality and safety', kind: 'debugging', order: 1 },
          ],
        },
      ],
    },
    {
      id: 'ai-project',
      key: 'project',
      title: 'Project',
      description: "Days 11-13 · Industry simulation -- sprint planning, AI product feature development, and code review exactly as a real AI engineering team works.",
      order: 3,
      modules: [
        {
          id: 'ai-project-simulation',
          title: 'Industry Simulation Sprint',
          description: 'Work an assigned ticket end-to-end: design, build, review prompts, and open a pull request.',
          estimatedMinutes: 40,
          order: 1,
          lessons: [
            { id: 'ai-project-simulation-l1', title: 'Sprint planning & AI product design', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
            { id: 'ai-project-simulation-l2', title: 'Feature implementation & prompt reviews', contentType: 'markdown', estimatedMinutes: 10, order: 2 },
            { id: 'ai-project-simulation-l3', title: 'Model testing & API integration', contentType: 'markdown', estimatedMinutes: 10, order: 3 },
            { id: 'ai-project-simulation-l4', title: 'Code review & performance optimization', contentType: 'code', estimatedMinutes: 10, order: 4 },
          ],
          practice: [
            { id: 'ai-project-simulation-p1', title: 'Resolve your assigned sprint ticket end-to-end', kind: 'coding', order: 1 },
            { id: 'ai-project-simulation-p2', title: 'Fix a reported bug and verify it with QA testing', kind: 'debugging', order: 2 },
          ],
          submission: { id: 'ai-project-simulation-s1', title: 'Submit your sprint feature pull request', instructions: 'Link the pull request for the ticket you were assigned during the sprint.', requiresLink: true },
          assessment: { id: 'ai-project-simulation-checkpoint', title: '[Mentor Checkpoint] AI Workflow Review (Day 12)', kind: 'mixed', passingScore: 70, timeLimitMinutes: 45, maxAttempts: 2, order: 1 },
        },
      ],
    },
    {
      id: 'ai-readiness',
      key: 'readiness',
      title: 'Readiness',
      description: 'Day 15 · Mentor evaluation of your product-readiness before the capstone and client project allocation.',
      order: 4,
      modules: [
        {
          id: 'ai-readiness-eval',
          title: 'Product Readiness Evaluation (Day 15)',
          description: 'Your mentor reviews your AI product quality, prompt reliability, and collaboration before you begin the capstone.',
          order: 1,
          lessons: [
            { id: 'ai-readiness-eval-l1', title: 'What to expect from your product readiness review', contentType: 'markdown', estimatedMinutes: 10, order: 1 },
          ],
          practice: [],
        },
      ],
    },
    {
      id: 'ai-graduation',
      key: 'graduation',
      title: 'Graduation',
      description: 'Days 16-18 · Capstone AI product, live demonstration, interview preparation, and certification.',
      order: 5,
      modules: [
        {
          id: 'ai-graduation-capstone',
          title: 'Capstone Project (Days 16-18)',
          description: 'Build and ship a production-ready AI-powered application, then present it live for certification.',
          estimatedMinutes: 30,
          order: 1,
          lessons: [
            { id: 'ai-graduation-capstone-l1', title: 'Capstone briefing & project options', contentType: 'markdown', estimatedMinutes: 15, order: 1 },
            { id: 'ai-graduation-capstone-l2', title: 'Interview & portfolio preparation', contentType: 'markdown', estimatedMinutes: 15, order: 2 },
          ],
          practice: [],
          submission: { id: 'ai-graduation-capstone-s1', title: 'Submit your capstone AI project for certification review', instructions: 'Include your deployed app link, repository link, and AI architecture diagram. Your mentor reviews functionality, AI accuracy, and engineering quality before certification.', requiresLink: true },
          assessment: { id: 'ai-graduation-final', title: '[Mentor Checkpoint] Final AI Product Demonstration (Day 18)', kind: 'mixed', passingScore: 75, timeLimitMinutes: 90, maxAttempts: 1, order: 1 },
        },
      ],
    },
  ],
};
