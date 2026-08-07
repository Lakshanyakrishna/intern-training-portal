import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { findPractice } from '../config/types';
import SkeletonBlock from '../components/SkeletonBlock';
import { ArrowLeft, ChevronDown, Send, Target } from '../../components/Icons';

// [Placeholder shell] Monaco Editor plugs in where the editor placeholder
// is; a real execution/console backend plugs in where the console
// placeholder is. Nothing here is real yet -- structure only.
export default function CodingWorkspace() {
  const { practiceId } = useParams<{ practiceId: string }>();
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });
  const [hintsOpen, setHintsOpen] = useState(false);

  if (loading || !track) return <SkeletonBlock className="h-96" />;

  const found = practiceId ? findPractice(track, practiceId) : undefined;
  if (!found) return <Navigate to="/training/path" replace />;
  const { module, practice } = found;

  return (
    <div className="space-y-4">
      <Link to={`/training/practice/${practice.id}`} className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors w-fit">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to practice
      </Link>

      <h1 className="text-xl font-bold text-primary">{practice.title}</h1>

      <div className="grid lg:grid-cols-[280px_1fr] gap-4 items-start">
        {/* Instructions + hints panel */}
        <div className="space-y-4">
          <div className="bg-surface border border-line rounded-xl p-4">
            <h2 className="text-sm font-semibold text-primary mb-2">Instructions</h2>
            <p className="text-sm text-secondary">
              {practice.description ?? 'Exercise instructions will appear here once this practice is written.'}
            </p>
          </div>

          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <button
              onClick={() => setHintsOpen(p => !p)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-surface-alt transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Target className="w-4 h-4 text-secondary" />
                Hints
              </span>
              <ChevronDown className={`w-4 h-4 text-secondary transition-transform ${hintsOpen ? 'rotate-180' : ''}`} />
            </button>
            {hintsOpen && (
              <p className="px-4 pb-4 text-sm text-secondary">Hints for this exercise will appear here.</p>
            )}
          </div>
        </div>

        {/* Editor + console */}
        <div className="space-y-4">
          <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-line">
            <div className="flex items-center justify-between px-4 py-2 bg-black/20 text-xs text-neutral-400">
              <span>editor.tsx</span>
              <span>Monaco Editor — not wired up yet</span>
            </div>
            <div className="h-72 flex items-center justify-center text-sm text-neutral-500">
              [ Code editor placeholder ]
            </div>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-line">
            <div className="px-4 py-2 bg-black/20 text-xs text-neutral-400">Console</div>
            <div className="h-24 flex items-center justify-center text-sm text-neutral-500">
              [ Console output placeholder ]
            </div>
          </div>

          <button
            onClick={() => progress.markPracticeComplete(module.id, practice.id)}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-text text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
