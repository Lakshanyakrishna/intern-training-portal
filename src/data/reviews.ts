import type { SubmissionFeedback } from '../types';
import { modules } from './modules';
import type { UserProgress } from '../types';

const MENTOR_NAMES = ['Sarah Chen', 'Marcus Johnson', 'Priya Singh'];

const STRENGTHS_BY_MODULE: Record<string, string[]> = {
  git: ['Good commit messages', 'Proper repository structure', 'Clear branching strategy', 'Well-documented PRs', 'Clean merge conflict resolution'],
  deployment: ['Proper environment configuration', 'Clean build pipeline setup', 'Good understanding of hosting', 'Well-structured deployment scripts'],
  supabase: ['Efficient table design', 'Proper RLS policies', 'Clean query patterns', 'Good authentication flow'],
  ai: ['Effective prompt engineering', 'Well-structured code generation', 'Good AI tool utilization', 'Clear documentation of AI usage'],
  api: ['Clean endpoint design', 'Proper error handling', 'Good request validation', 'Well-structured API documentation'],
  debugging: ['Systematic debugging approach', 'Effective use of dev tools', 'Good error analysis', 'Clear reproduction steps'],
  communication: ['Clear written communication', 'Good client-facing documentation', 'Effective status updates', 'Professional email drafts'],
  testing: ['Comprehensive test coverage', 'Well-structured test cases', 'Good edge case handling', 'Clean test organization'],
  'code-review': ['Thorough review comments', 'Good code quality suggestions', 'Clear explanations', 'Constructive feedback style'],
};

const IMPROVEMENTS_BY_MODULE: Record<string, string[]> = {
  git: ['Use feature branches consistently', 'Improve documentation', 'Add more descriptive commit messages', 'Follow conventional commit format'],
  deployment: ['Add monitoring and alerting', 'Document rollback procedures', 'Improve CI/CD pipeline', 'Add staging environment'],
  supabase: ['Optimize query performance', 'Add data validation', 'Improve error handling', 'Document schema decisions'],
  ai: ['Review AI-generated code before committing', 'Add more context to prompts', 'Validate AI outputs', 'Document AI tool limitations'],
  api: ['Add rate limiting', 'Improve input sanitization', 'Add API versioning', 'Implement request logging'],
  debugging: ['Add more logging points', 'Document debugging process', 'Use breakpoints more effectively', 'Add integration tests'],
  communication: ['Be more concise in updates', 'Use more structured formats', 'Follow up on open items', 'Practice active listening'],
  testing: ['Add integration tests', 'Improve test data management', 'Add performance tests', 'Mock external services properly'],
  'code-review': ['Focus on higher-level concerns', 'Provide more actionable feedback', 'Review security implications', 'Follow review checklist'],
};

const OVERALL_COMMENTS: Record<string, string[]> = {
  git: ['Solid understanding of Git fundamentals. Continue practicing with branching strategies.', 'Good work on version control. Focus on collaborative workflows in future tasks.'],
  deployment: ['Deployment pipeline is well set up. Monitor production closely.', 'Good deployment configuration. Add monitoring for production readiness.'],
  supabase: ['Database design is well structured. Continue optimizing query performance.', 'Good schema design. Work on data validation and error handling.'],
  ai: ['Effective use of AI tools. Remember to review generated code thoroughly.', 'Good prompt engineering. Continue validating AI outputs.'],
  api: ['API design follows best practices. Add versioning for long-term maintenance.', 'Clean endpoint structure. Focus on rate limiting and security.'],
  debugging: ['Strong debugging methodology. Continue developing systematic approaches.', 'Good diagnostic skills. Add more proactive logging.'],
  communication: ['Communication is clear and professional. Keep up the good work.', 'Good client-ready communication. Work on conciseness in updates.'],
  testing: ['Comprehensive testing approach. Keep covering edge cases.', 'Good test coverage. Add integration and performance tests.'],
  'code-review': ['Thorough and constructive reviews. Focus on higher-level architecture concerns.', 'Good review practices. Continue being thorough and actionable.'],
};

export function getMockSubmissionFeedback(progress: UserProgress): SubmissionFeedback[] {
  const feedback: SubmissionFeedback[] = [];
  const existingIds = new Set<string>();
  let idCounter = 1;

  for (const mod of modules) {
    const modProg = progress.moduleProgress[mod.id];
    if (!modProg) continue;

    const strengths = STRENGTHS_BY_MODULE[mod.id] || ['Good understanding of concepts', 'Clean implementation'];
    const improvements = IMPROVEMENTS_BY_MODULE[mod.id] || ['Add more documentation', 'Consider edge cases'];
    const comments = OVERALL_COMMENTS[mod.id] || ['Good work overall. Keep improving.', 'Solid effort. Continue building on these skills.'];

    for (const challenge of mod.challenges) {
      if (modProg.challenges.includes(challenge.id) && !existingIds.has(challenge.id)) {
        existingIds.add(challenge.id);
        const mentorIdx = idCounter % MENTOR_NAMES.length;
        const commentIdx = idCounter % comments.length;
        const isEarlyFeedback = idCounter <= 2;
        feedback.push({
          id: `sf-${idCounter++}`,
          submissionId: challenge.id,
          type: 'challenge',
          moduleId: mod.id,
          moduleTitle: mod.title,
          submissionTitle: challenge.title,
          status: isEarlyFeedback ? 'reviewed' : 'waiting-review',
          mentorName: MENTOR_NAMES[mentorIdx],
          overallComment: comments[commentIdx],
          strengths: strengths.slice(0, 2),
          needsImprovement: improvements.slice(0, 2),
          mentorScore: isEarlyFeedback ? 8 : 0,
          reviewDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }

  return feedback;
}

export function getMentorUpdates(progress: UserProgress): { label: string; count: number; urgent: boolean } | null {
  const feedback = getMockSubmissionFeedback(progress);
  if (feedback.length === 0) return null;

  const waitingCount = feedback.filter(f => f.status === 'waiting-review').length;
  const newReviewed = feedback.filter(f => f.status === 'reviewed').length;
  const revisions = feedback.filter(f => f.status === 'revision-requested').length;

  if (revisions > 0) return { label: 'Revision Requested', count: revisions, urgent: true };
  if (waitingCount > 0) return { label: 'Waiting for Review', count: waitingCount, urgent: false };
  if (newReviewed > 0) return { label: `${newReviewed} New Feedback Available`, count: newReviewed, urgent: false };
  return null;
}
