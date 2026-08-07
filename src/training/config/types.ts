import type { OpportunityForte } from '../../lib/db';

// Static curriculum shape for a training track. Every per-forte config file
// (frontend.ts, backend.ts, ...) exports exactly one of these -- the UI
// never hardcodes a forte's stages/modules, it only ever renders whatever
// TrainingTrackConfig it's handed. Swapping in real content later means
// editing these config files, not the components that render them.

export type LessonContentType = 'markdown' | 'video' | 'code' | 'image' | 'download' | 'reference';

export interface LessonConfig {
  id: string;
  title: string;
  summary?: string;
  contentType: LessonContentType;
  // The lesson body, written in a small markdown-lite subset (##/### headings,
  // paragraphs, -/* bullet lists, ```fenced code blocks```, `inline code`,
  // **bold**) -- rendered by src/training/components/LessonContent.tsx.
  // Optional so tracks without real content yet still show the existing
  // "content will render here" placeholder.
  content?: string;
  estimatedMinutes?: number;
  order: number;
}

export type PracticeKind = 'coding' | 'mcq' | 'debugging' | 'file-upload' | 'interactive';

export interface PracticeConfig {
  id: string;
  title: string;
  kind: PracticeKind;
  description?: string;
  order: number;
}

export type AssessmentKind = 'mcq' | 'coding' | 'file-upload' | 'mixed';

export interface AssessmentConfig {
  id: string;
  title: string;
  kind: AssessmentKind;
  passingScore: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  order: number;
}

export interface SubmissionConfig {
  id: string;
  title: string;
  instructions?: string;
  requiresFile?: boolean;
  requiresLink?: boolean;
}

export interface ModuleConfig {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  lessons: LessonConfig[];
  practice: PracticeConfig[];
  // A harder, usually final, practice exercise -- structurally identical to
  // an entry in `practice`, kept separate because the module page renders
  // it as its own step (Overview -> Lessons -> Practice -> Challenge ->
  // Assessment -> Submission -> Completion). Optional: not every module
  // needs a distinct challenge beyond its regular practice set.
  challenge?: PracticeConfig;
  assessment?: AssessmentConfig;
  submission?: SubmissionConfig;
  order: number;
}

export type StageKey = 'foundation' | 'development' | 'project' | 'readiness' | 'graduation';

export interface StageConfig {
  id: string;
  key: StageKey;
  title: string;
  description?: string;
  modules: ModuleConfig[];
  order: number;
}

export interface TrainingTrackConfig {
  // 'General' covers interns with no forte-specific match; 'QA' is a
  // forward-looking track (no real QA forte exists in OPPORTUNITY_FORTES
  // yet) included per spec so the registry has somewhere to plug it in
  // without another type change once QA becomes a real opportunity forte.
  forte: OpportunityForte | 'General' | 'QA';
  trackName: string;
  description: string;
  stages: StageConfig[];
}

// Derived, computed at render time from a TrainingTrackConfig + an intern's
// progress state -- never stored on the config itself, since "locked" etc.
// depends on who's looking, not on the curriculum shape.
export type ModuleState = 'completed' | 'in-progress' | 'not-started' | 'locked';

export function flattenModules(track: TrainingTrackConfig): { stage: StageConfig; module: ModuleConfig }[] {
  return track.stages
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap(stage =>
      stage.modules
        .slice()
        .sort((a, b) => a.order - b.order)
        .map(module => ({ stage, module }))
    );
}

export function findModule(track: TrainingTrackConfig, moduleId: string): { stage: StageConfig; module: ModuleConfig } | undefined {
  return flattenModules(track).find(({ module }) => module.id === moduleId);
}

export function findLesson(track: TrainingTrackConfig, lessonId: string): { stage: StageConfig; module: ModuleConfig; lesson: LessonConfig } | undefined {
  for (const { stage, module } of flattenModules(track)) {
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (lesson) return { stage, module, lesson };
  }
  return undefined;
}

export function findPractice(track: TrainingTrackConfig, practiceId: string): { stage: StageConfig; module: ModuleConfig; practice: PracticeConfig } | undefined {
  for (const { stage, module } of flattenModules(track)) {
    const practice = module.practice.find(p => p.id === practiceId) ?? (module.challenge?.id === practiceId ? module.challenge : undefined);
    if (practice) return { stage, module, practice };
  }
  return undefined;
}

export function findAssessment(track: TrainingTrackConfig, assessmentId: string): { stage: StageConfig; module: ModuleConfig; assessment: AssessmentConfig } | undefined {
  for (const { stage, module } of flattenModules(track)) {
    if (module.assessment?.id === assessmentId) return { stage, module, assessment: module.assessment };
  }
  return undefined;
}

export function findSubmission(track: TrainingTrackConfig, submissionId: string): { stage: StageConfig; module: ModuleConfig; submission: SubmissionConfig } | undefined {
  for (const { stage, module } of flattenModules(track)) {
    if (module.submission?.id === submissionId) return { stage, module, submission: module.submission };
  }
  return undefined;
}
