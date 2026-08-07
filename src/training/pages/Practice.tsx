import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { findPractice } from '../config/types';
import SkeletonBlock from '../components/SkeletonBlock';
import { ArrowLeft, CheckCircle, Code, Upload } from '../../components/Icons';
import type { PracticeKind } from '../config/types';

// [Placeholder interface] Real interaction per kind plugs in here later --
// coding exercises route into the Coding Workspace shell; everything else
// gets an honest "this kind of exercise will render here" placeholder.
function PracticePlaceholder({ kind }: { kind: PracticeKind }) {
  const labels: Record<PracticeKind, string> = {
    coding: 'A coding exercise opens in the workspace below.',
    mcq: 'Multiple-choice questions will render here.',
    debugging: 'A debugging scenario will render here.',
    'file-upload': 'A file upload interface will render here.',
    interactive: 'An interactive exercise will render here.',
  };
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border-2 border-dashed border-line rounded-xl">
      {kind === 'file-upload' ? <Upload className="w-6 h-6 text-secondary mb-3" /> : <Code className="w-6 h-6 text-secondary mb-3" />}
      <p className="text-sm text-secondary max-w-sm">{labels[kind]}</p>
    </div>
  );
}

export default function Practice() {
  const { practiceId } = useParams<{ practiceId: string }>();
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });

  if (loading || !track) return <SkeletonBlock className="h-96" />;

  const found = practiceId ? findPractice(track, practiceId) : undefined;
  if (!found) return <Navigate to="/training/path" replace />;
  const { module, practice } = found;
  const done = progress.getModuleProgress(module.id).completedPracticeIds.includes(practice.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/training/module/${module.id}`} className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors w-fit">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {module.title}
      </Link>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1.5 capitalize">{practice.kind} practice</p>
        <h1 className="text-2xl font-bold text-primary">{practice.title}</h1>
        {practice.description && <p className="text-sm text-secondary mt-2">{practice.description}</p>}
      </div>

      <PracticePlaceholder kind={practice.kind} />

      {practice.kind === 'coding' && (
        <Link
          to={`/training/workspace/${practice.id}`}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-line text-sm font-medium text-primary hover:bg-surface-alt transition-colors"
        >
          <Code className="w-4 h-4" />
          Open Coding Workspace
        </Link>
      )}

      <button
        onClick={() => progress.markPracticeComplete(module.id, practice.id)}
        disabled={done}
        className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
          done ? 'border border-line text-secondary' : 'bg-accent text-accent-text hover:opacity-90'
        }`}
      >
        <CheckCircle className="w-4 h-4" />
        {done ? 'Completed' : 'Mark as complete'}
      </button>
    </div>
  );
}
