import type { Badge } from '../types';

export const badges: Badge[] = [
  { id: 'first-commit', name: 'First Commit', description: 'Complete your first Git challenge', icon: '', requirement: { type: 'challenge', value: 1 } },
  { id: 'git-explorer', name: 'Git Explorer', description: 'Complete all Git challenges', icon: '', requirement: { type: 'module-challenges', value: 0 } },
  { id: 'api-integrator', name: 'API Integrator', description: 'Complete API Integration module', icon: '', requirement: { type: 'module', value: 4 } },
  { id: 'bug-hunter', name: 'Bug Hunter', description: 'Complete Debugging module', icon: '', requirement: { type: 'module', value: 5 } },
  { id: 'deployment-hero', name: 'Deployment Hero', description: 'Complete Deployment module', icon: '', requirement: { type: 'challenge', value: 5 } },
  { id: 'qa-champion', name: 'QA Champion', description: 'Complete Testing & QA module', icon: '', requirement: { type: 'module', value: 7 } },
  { id: 'review-expert', name: 'Review Expert', description: 'Complete Code Review module', icon: '', requirement: { type: 'module', value: 8 } },
  { id: 'project-ready', name: 'Project Ready', description: 'Reach level 9 — project eligible', icon: '', requirement: { type: 'level', value: 9 } },
  { id: 'ai-whisperer', name: 'AI Whisperer', description: 'Complete AI Development module', icon: '', requirement: { type: 'module', value: 3 } },
  { id: 'db-designer', name: 'DB Designer', description: 'Complete Supabase module', icon: '', requirement: { type: 'module', value: 2 } },
  { id: 'communicator', name: 'Pro Communicator', description: 'Complete Communication module', icon: '', requirement: { type: 'module', value: 6 } },
  { id: 'capstone-champion', name: 'Capstone Champion', description: 'Complete the final capstone project', icon: '', requirement: { type: 'capstone', value: 1 } },
  { id: 'streak-3', name: '3-Day Streak', description: 'Log in for 3 consecutive days', icon: '', requirement: { type: 'streak', value: 3 } },
  { id: 'streak-7', name: '7-Day Streak', description: 'Log in for 7 consecutive days', icon: '', requirement: { type: 'streak', value: 7 } },
  { id: 'challenge-10', name: 'Challenge Addict', description: 'Complete 10 challenges', icon: '', requirement: { type: 'challenge', value: 10 } },
  { id: 'quiz-whiz', name: 'Quiz Whiz', description: 'Pass 5 assessments', icon: '', requirement: { type: 'quiz', value: 5 } },
  { id: 'mentor-ready', name: 'Mentor Approved', description: 'Submit mentor review checklist', icon: '', requirement: { type: 'mentor', value: 1 } },
  { id: 'sim-master', name: 'Debug Simulator', description: 'Complete 5 debug scenarios', icon: '', requirement: { type: 'debug', value: 5 } },
  { id: 'client-pro', name: 'Client Pro', description: 'Complete client project simulator', icon: '', requirement: { type: 'client', value: 5 } },
  { id: 'review-pro', name: 'Review Pro', description: 'Complete 3 code reviews', icon: '', requirement: { type: 'review', value: 3 } },
];
