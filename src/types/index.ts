export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  whyModuleMatters: string;
  learningObjectives: string[];
  skillsGained: string[];
  estimatedMinutes: number;
  lessons: Lesson[];
  quizzes: QuizQuestion[];
  challenges: Challenge[];
  practices: Practice[];
  checkpointQuizzes: CheckpointQuiz[];
}

export interface LessonCommand {
  cmd: string;
  desc: string;
}

export interface CommandSpotlight {
  command: string;
  purpose: string;
  syntax: string;
  example: string;
}

export interface CheckpointAnswer {
  selected: number;
  correct: boolean;
}

export interface CheckpointResult {
  passed: boolean;
  score: number;
  total: number;
  attempts: number;
  answers: Record<number, CheckpointAnswer>;
  timeTaken: number;
}

export interface AssessmentAttempt {
  score: number;
  total: number;
  passed: boolean;
  timestamp: string;
}

export interface AssessmentResult {
  attempts: AssessmentAttempt[];
  bestScore: number;
  latestScore: number;
}

export interface CheckpointQuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface CheckpointQuiz {
  id: string;
  title: string;
  questions: CheckpointQuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  why?: string;
  keyConcepts?: string[];
  commandSpotlight?: CommandSpotlight[];
  tryItYourself?: string;
  scenario?: string;
  commands?: LessonCommand[];
  content?: string;
  code?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  task: string;
  hints: string[];
  solution: string;
}

export interface Practice {
  id: string;
  title: string;
  description: string;
  task: string;
  hints: string[];
}

export interface DebugScenario {
  id: string;
  title: string;
  clientReport: string;
  context: string;
  actions: DebugAction[];
  correctActionId: string;
  explanation: string;
  xpReward: number;
}

export interface DebugAction {
  id: string;
  label: string;
  description: string;
  outcome: string;
}

export interface ClientProjectDay {
  id: string;
  day: number;
  title: string;
  clientReport: string;
  availableActions: ClientAction[];
  correctActionId: string;
  consequence: string;
  xpReward: number;
}

export interface ClientAction {
  id: string;
  label: string;
  description: string;
  outcome: string;
  scoreImpact: number;
}

export interface ReviewRequest {
  id: string;
  title: string;
  description: string;
  code: string;
  issues: string[];
  correctReviews: string[];
  options: string[];
  xpReward: number;
}

export interface JourneyStage {
  id: string;
  title: string;
  moduleId: string;
  icon: string;
}

export interface PracticeSubmission {
  taskId: string;
  submission: string;
  savedAt: string;
}

export interface ChallengeWorkspace {
  challengeId: string;
  notes: string;
  submission: string;
  hintsRevealed: number;
  status: 'in-progress' | 'submitted';
}

export interface UserProgress {
  completedLessons: string[];
  completedPractices: string[];
  completedChallenges: string[];
  passedQuizzes: string[];
  moduleProgress: Record<string, { lessons: string[]; practices: string[]; challenges: string[]; quizPassed: boolean; xp: number; checkpoints: Record<string, CheckpointResult>; assessmentResult?: AssessmentResult }>;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  trainingStartDate: string;
  mentorChecklist: MentorChecklist;
  weeklyGoal: WeeklyGoal;
  completedDebugScenarios: string[];
  clientProjectProgress: string[];
  reviewRequestsCompleted: string[];
  xpHistory: XPHistoryEntry[];
  completedJourneyStages: string[];
  mentorFeedback: MentorFeedbackEntry[];
  practiceSubmissions: PracticeSubmission[];
  challengeWorkspaces: ChallengeWorkspace[];
}

export interface WeeklyGoal {
  labs: number;
  labsCompleted: number;
  assessments: number;
  assessmentsCompleted: number;
  weeklyXp: number;
  weeklyXpTarget: number;
  weekStart: string;
}

export interface XPHistoryEntry {
  date: string;
  amount: number;
  source: string;
}

export interface MentorChecklist {
  githubProfile: string;
  deployedProjectLink: string;
  repositoryLink: string;
  challengesCompleted: string[];
  submitted: boolean;
}

export interface Level {
  level: number;
  title: string;
  xpRequired: number;
}

export interface MentorFeedbackEntry {
  id: string;
  date: string;
  score: number;
  note: string;
  module: string;
}

export type UserRole = 'applicant' | 'intern' | 'mentor' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  college?: string;
  yearOfStudy?: string;
  phone?: string;
  major?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  batch: string;
  joinedDate: string;
  onboardingComplete: boolean;
}

export type SubmissionStatus = 'waiting-review' | 'reviewed' | 'revision-requested' | 'approved';

export interface SubmissionFeedback {
  id: string;
  submissionId: string;
  type: 'challenge' | 'practice' | 'assessment';
  moduleId: string;
  moduleTitle: string;
  submissionTitle: string;
  status: SubmissionStatus;
  mentorName: string;
  overallComment: string;
  strengths: string[];
  needsImprovement: string[];
  mentorScore: number;
  reviewDate: string;
}
