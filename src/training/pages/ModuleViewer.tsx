import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { findModule } from '../config/types';
import SkeletonBlock from '../components/SkeletonBlock';
import { ModuleStatusIcon } from '../components/ModuleStatusChip';
import {
  ArrowLeft, ArrowRight, CheckCircle, Circle, Clock, FileText, Zap,
} from '../../components/Icons';

const CONTENT_ICON = { markdown: FileText, video: FileText, code: FileText, image: FileText, download: FileText, reference: FileText } as const;

export default function ModuleViewer() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });

  if (loading || !track) {
    return <SkeletonBlock className="h-96" />;
  }

  const found = moduleId ? findModule(track, moduleId) : undefined;
  if (!found) return <Navigate to="/training/path" replace />;
  const { stage, module } = found;

  const mp = progress.getModuleProgress(module.id);
  const lessonsDone = module.lessons.every(l => mp.completedLessonIds.includes(l.id));
  const practiceDone = module.practice.every(p => mp.completedPracticeIds.includes(p.id));
  const assessmentDone = !module.assessment || mp.assessmentPassed;
  const canComplete = lessonsDone && practiceDone && assessmentDone && mp.status !== 'completed';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/training/path" className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors w-fit">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to learning path
      </Link>

      {/* Overview */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1.5">{stage.title}</p>
        <h1 className="text-2xl font-bold text-primary">{module.title}</h1>
        {module.description && <p className="text-sm text-secondary mt-2 max-w-xl">{module.description}</p>}
        {module.estimatedMinutes && (
          <div className="flex items-center gap-1.5 text-xs text-secondary mt-2">
            <Clock className="w-3.5 h-3.5" />
            {module.estimatedMinutes} min
          </div>
        )}
      </div>

      {/* Lessons */}
      <section className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line bg-surface-alt">
          <h2 className="text-sm font-semibold text-primary">Lessons</h2>
        </div>
        {module.lessons.length === 0 ? (
          <p className="px-5 py-4 text-sm text-secondary">No lessons yet — content will be added here.</p>
        ) : (
          <div className="divide-y divide-line">
            {module.lessons.slice().sort((a, b) => a.order - b.order).map(lesson => {
              const done = mp.completedLessonIds.includes(lesson.id);
              const Icon = CONTENT_ICON[lesson.contentType];
              return (
                <Link key={lesson.id} to={`/training/lesson/${lesson.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-alt transition-colors">
                  {done ? <CheckCircle className="w-4 h-4 text-accent shrink-0" /> : <Circle className="w-4 h-4 text-secondary shrink-0" />}
                  <Icon className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="text-sm text-primary flex-1 min-w-0 truncate">{lesson.title}</span>
                  {lesson.estimatedMinutes && <span className="text-xs text-secondary shrink-0">{lesson.estimatedMinutes} min</span>}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Practice */}
      <section className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line bg-surface-alt">
          <h2 className="text-sm font-semibold text-primary">Practice</h2>
        </div>
        {module.practice.length === 0 ? (
          <p className="px-5 py-4 text-sm text-secondary">No practice exercises yet.</p>
        ) : (
          <div className="divide-y divide-line">
            {module.practice.slice().sort((a, b) => a.order - b.order).map(p => {
              const done = mp.completedPracticeIds.includes(p.id);
              return (
                <Link key={p.id} to={`/training/practice/${p.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-alt transition-colors">
                  {done ? <CheckCircle className="w-4 h-4 text-accent shrink-0" /> : <Circle className="w-4 h-4 text-secondary shrink-0" />}
                  <span className="text-sm text-primary flex-1 min-w-0 truncate">{p.title}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-alt text-secondary shrink-0 capitalize">{p.kind}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Challenge */}
      {module.challenge && (
        <section className="bg-surface border border-line rounded-xl p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Challenge</p>
            <p className="text-sm font-medium text-primary truncate">{module.challenge.title}</p>
          </div>
          <Link to={`/training/practice/${module.challenge.id}`} className="text-xs font-medium text-accent hover:underline shrink-0">Start</Link>
        </section>
      )}

      {/* Assessment */}
      {module.assessment && (
        <section className="bg-surface border border-line rounded-xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-0.5">Assessment</p>
              <p className="text-sm font-medium text-primary truncate">{module.assessment.title}</p>
              <p className="text-xs text-secondary mt-1">
                Passing score {module.assessment.passingScore}%
                {module.assessment.timeLimitMinutes && ` · ${module.assessment.timeLimitMinutes} min`}
                {module.assessment.maxAttempts && ` · ${module.assessment.maxAttempts} attempts`}
              </p>
            </div>
            <Link
              to={`/training/assessment/${module.assessment.id}`}
              className="shrink-0 px-4 py-2 rounded-lg bg-accent text-accent-text text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {mp.assessmentPassed ? 'Review' : 'Start'}
            </Link>
          </div>
        </section>
      )}

      {/* Submission */}
      {module.submission && (
        <section className="bg-surface border border-line rounded-xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-0.5">Submission</p>
              <p className="text-sm font-medium text-primary truncate">{module.submission.title}</p>
            </div>
            <Link
              to={`/training/assignment/${module.submission.id}`}
              className="shrink-0 px-4 py-2 rounded-lg border border-line text-sm font-medium text-primary hover:bg-surface-alt transition-colors"
            >
              {mp.submissionStatus ?? 'Submit'}
            </Link>
          </div>
        </section>
      )}

      {/* Completion */}
      <section className="bg-surface border border-line rounded-xl p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ModuleStatusIcon state={progress.moduleState(module, undefined)} />
          <p className="text-sm font-medium text-primary">
            {mp.status === 'completed' ? 'Module complete' : 'Mark complete once you\'ve finished everything above'}
          </p>
        </div>
        {canComplete && (
          <button
            onClick={() => progress.markModuleComplete(module.id)}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-text text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Mark complete
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </section>
    </div>
  );
}
