import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { findAssessment } from '../config/types';
import SkeletonBlock from '../components/SkeletonBlock';
import { ArrowLeft, Clock, RefreshCw, Target } from '../../components/Icons';

// [Placeholder] Real MCQ/coding/file-upload/mixed question rendering plugs
// in where the question placeholder is. "Start" here just transitions to
// an honest "questions will render here" state -- nothing is graded for
// real yet.
export default function Assessment() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });
  const [started, setStarted] = useState(false);

  if (loading || !track) return <SkeletonBlock className="h-96" />;

  const found = assessmentId ? findAssessment(track, assessmentId) : undefined;
  if (!found) return <Navigate to="/training/path" replace />;
  const { module, assessment } = found;
  const mp = progress.getModuleProgress(module.id);

  function handleSubmit() {
    progress.markAssessmentPassed(module.id);
    navigate(`/training/assessment/${assessment.id}/result`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/training/module/${module.id}`} className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors w-fit">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {module.title}
      </Link>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1.5 capitalize">{assessment.kind} assessment</p>
        <h1 className="text-2xl font-bold text-primary">{assessment.title}</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-line rounded-xl p-4 text-center">
          <Target className="w-4 h-4 text-secondary mx-auto mb-1.5" />
          <p className="text-sm font-bold text-primary">{assessment.passingScore}%</p>
          <p className="text-[11px] text-secondary">Passing score</p>
        </div>
        <div className="bg-surface border border-line rounded-xl p-4 text-center">
          <Clock className="w-4 h-4 text-secondary mx-auto mb-1.5" />
          <p className="text-sm font-bold text-primary">{assessment.timeLimitMinutes ?? '—'}</p>
          <p className="text-[11px] text-secondary">Minutes</p>
        </div>
        <div className="bg-surface border border-line rounded-xl p-4 text-center">
          <RefreshCw className="w-4 h-4 text-secondary mx-auto mb-1.5" />
          <p className="text-sm font-bold text-primary">{assessment.maxAttempts ?? '—'}</p>
          <p className="text-[11px] text-secondary">Attempts</p>
        </div>
      </div>

      {mp.assessmentPassed && (
        <div className="rounded-lg bg-accent/10 text-accent text-sm font-medium px-4 py-3 text-center">
          You've already passed this assessment.
        </div>
      )}

      {!started ? (
        <button
          onClick={() => setStarted(true)}
          className="w-full px-5 py-3 rounded-lg bg-accent text-accent-text text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Start Assessment
        </button>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 border-2 border-dashed border-line rounded-xl">
            <p className="text-sm text-secondary max-w-sm">
              {assessment.kind === 'mcq' && 'Multiple-choice questions will render here.'}
              {assessment.kind === 'coding' && 'A coding challenge will render here.'}
              {assessment.kind === 'file-upload' && 'A file submission interface will render here.'}
              {assessment.kind === 'mixed' && 'A mix of question types will render here.'}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full px-5 py-3 rounded-lg bg-accent text-accent-text text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Submit Assessment
          </button>
        </>
      )}
    </div>
  );
}
