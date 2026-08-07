import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { findAssessment } from '../config/types';
import SkeletonBlock from '../components/SkeletonBlock';
import { ArrowLeft, CheckCircle } from '../../components/Icons';

export default function AssessmentResult() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });

  if (loading || !track) return <SkeletonBlock className="h-64" />;

  const found = assessmentId ? findAssessment(track, assessmentId) : undefined;
  if (!found) return <Navigate to="/training/path" replace />;
  const { module, assessment } = found;
  const passed = progress.getModuleProgress(module.id).assessmentPassed;

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
        <CheckCircle className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-primary">{passed ? 'Assessment passed' : 'Result pending'}</h1>
        <p className="text-sm text-secondary mt-1">{assessment.title}</p>
      </div>

      <div className="bg-surface border border-line rounded-xl p-5 text-left">
        <p className="text-sm font-semibold text-primary mb-1">Feedback</p>
        <p className="text-sm text-secondary">
          [Placeholder] Detailed, per-question feedback will appear here once real grading exists.
        </p>
      </div>

      <Link
        to={`/training/module/${module.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {module.title}
      </Link>
    </div>
  );
}
