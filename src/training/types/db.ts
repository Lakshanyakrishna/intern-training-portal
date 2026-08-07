// Future Supabase table shapes for the training system. Nothing here is
// wired to a real table or migration yet -- these interfaces exist so the
// mock data layer (src/training/mock/*) and every page in src/training/
// already match what a real fetch will eventually return, so swapping mock
// data for real queries later is a data-layer change, not a component
// rewrite.
//
// Naming mirrors what the actual migrations would create:
//   training_tracks, training_modules, training_lessons, practice_exercises,
//   assessments, assessment_attempts, lesson_progress, module_progress,
//   training_progress, mentor_feedback, resources, achievements

export interface DbTrainingTrackRow {
  id: string;
  forte: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTrainingModuleRow {
  id: string;
  track_id: string;
  stage_key: string;
  title: string;
  description: string | null;
  estimated_minutes: number | null;
  sort_order: number;
}

export interface DbTrainingLessonRow {
  id: string;
  module_id: string;
  title: string;
  summary: string | null;
  content_type: string;
  content: string | null;
  estimated_minutes: number | null;
  sort_order: number;
}

export interface DbPracticeExerciseRow {
  id: string;
  module_id: string;
  title: string;
  kind: string;
  description: string | null;
  sort_order: number;
}

export interface DbAssessmentRow {
  id: string;
  module_id: string;
  title: string;
  kind: string;
  passing_score: number;
  time_limit_minutes: number | null;
  max_attempts: number | null;
}

export interface DbAssessmentAttemptRow {
  id: string;
  assessment_id: string;
  intern_id: string;
  score: number | null;
  passed: boolean | null;
  started_at: string;
  submitted_at: string | null;
}

export interface DbLessonProgressRow {
  intern_id: string;
  lesson_id: string;
  completed_at: string | null;
  last_position: string | null;
}

export interface DbModuleProgressRow {
  intern_id: string;
  module_id: string;
  status: 'not-started' | 'in-progress' | 'completed';
  completed_at: string | null;
}

export interface DbTrainingProgressRow {
  intern_id: string;
  track_id: string;
  xp: number;
  level: number;
  streak_days: number;
  started_at: string;
  estimated_completion: string | null;
}

export interface DbMentorFeedbackRow {
  id: string;
  intern_id: string;
  mentor_id: string;
  module_id: string | null;
  message: string;
  created_at: string;
}

export interface DbResourceRow {
  id: string;
  track_id: string | null;
  title: string;
  url: string | null;
  kind: string;
}

export interface DbAchievementRow {
  id: string;
  intern_id: string;
  key: string;
  title: string;
  description: string | null;
  earned_at: string;
}
