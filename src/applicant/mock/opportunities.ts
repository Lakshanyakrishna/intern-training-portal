// [Placeholder] Reusable mock data -- shaped exactly like the eventual
// getOpportunities() API response so swapping this for a real fetch later
// is a one-line change, not a rewrite of any component below this file.
import type { Opportunity } from '../types';
import feImg from '../../assets/forte-placeholders/fe.jpg';
import beImg from '../../assets/forte-placeholders/be.jpg';
import aiImg from '../../assets/forte-placeholders/ai.jpg';

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-frontend',
    title: '[Placeholder] Frontend Engineering Internship',
    description: 'Work with the platform team building reusable UI components used across the product.',
    skills: ['React', 'TypeScript', 'CSS'],
    duration: '8 weeks',
    seats: 3,
    deadline: 'Sep 15, 2026',
    category: 'Frontend',
    image: feImg,
  },
  {
    id: 'opp-backend',
    title: '[Placeholder] Backend Engineering Internship',
    description: 'Help design and ship internal APIs that power the core product experience.',
    skills: ['Node.js', 'PostgreSQL', 'System Design'],
    duration: '8 weeks',
    seats: 2,
    deadline: 'Sep 15, 2026',
    category: 'Backend',
    image: beImg,
  },
  {
    id: 'opp-ai',
    title: '[Placeholder] Agentic AI Internship',
    description: 'Build and evaluate autonomous agent workflows for internal tooling.',
    skills: ['Python', 'LLMs', 'Evaluation'],
    duration: '10 weeks',
    seats: 2,
    deadline: 'Sep 30, 2026',
    category: 'Agentic AI',
    image: aiImg,
  },
];
