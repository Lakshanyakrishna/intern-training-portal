import { useState } from 'react';
import type { Challenge, ChallengeWorkspace } from '../types';
import { CheckCircle, Save, Send } from './Icons';

interface ChallengeCardProps {
  challenge: Challenge;
  completed: boolean;
  workspace?: ChallengeWorkspace;
  onSaveWorkspace: (data: { notes?: string; submission?: string; hintsRevealed?: number }) => void;
  onSubmitChallenge: (submission: string) => void;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  intermediate: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  advanced: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function ChallengeCard({ challenge, completed, workspace, onSaveWorkspace, onSubmitChallenge }: ChallengeCardProps) {
  const [hintsRevealed, setHintsRevealed] = useState(workspace?.hintsRevealed || 0);
  const [notes, setNotes] = useState(workspace?.notes || '');
  const [submission, setSubmission] = useState(workspace?.submission || '');

  const handleRevealHint = () => {
    const next = hintsRevealed + 1;
    setHintsRevealed(next);
    onSaveWorkspace({ hintsRevealed: next, notes, submission });
  };

  const handleSaveProgress = () => {
    onSaveWorkspace({ notes, submission, hintsRevealed });
  };

  const handleSubmit = () => {
    if (!submission.trim()) return;
    onSubmitChallenge(submission);
  };

  const submitted = workspace?.status === 'submitted';
  const borderClass = completed ? 'border-green-200 dark:border-green-800' : 'border-line';
  const bgClass = completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-surface';

  return (
    <div className={`${bgClass} ${borderClass} border rounded-xl overflow-hidden`}>
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold text-primary">{challenge.title}</h4>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
          </div>
          {completed && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
        </div>

        <p className="text-sm text-secondary">{challenge.description}</p>

        <div className="bg-surface-alt rounded-xl p-4">
          <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-1.5">Task</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{challenge.task}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-secondary block mb-1.5">Notes / Scratchpad</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Jot down your thoughts, approach, or findings..."
            rows={3}
            className="w-full text-sm border border-line rounded-lg px-3 py-2 bg-surface text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-secondary block mb-1.5">
            {submitted ? 'Submitted Solution' : 'Solution Submission'}
          </label>
          <textarea
            value={submission}
            onChange={e => setSubmission(e.target.value)}
            placeholder="Provide your solution, code, or explanation..."
            rows={4}
            className="w-full text-sm border border-line rounded-lg px-3 py-2 bg-surface text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {!submitted && challenge.hints && hintsRevealed < challenge.hints.length && (
            <button onClick={handleRevealHint} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-secondary border border-line hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Show Hint ({hintsRevealed + 1}/{challenge.hints.length})
            </button>
          )}
          <button onClick={handleSaveProgress} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-secondary border border-line hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Save className="w-3.5 h-3.5" /> Save Progress
          </button>
          {!submitted && (
            <button onClick={handleSubmit} disabled={!submission.trim()} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
              <Send className="w-3.5 h-3.5" /> Submit Challenge
            </button>
          )}
          {submitted && (
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Submitted
            </span>
          )}
        </div>

        {hintsRevealed > 0 && challenge.hints && (
          <div className="space-y-1.5">
            {challenge.hints.slice(0, hintsRevealed).map((h, i) => (
              <p key={i} className="text-xs text-secondary bg-surface-alt px-3 py-2 rounded-lg">Hint {i + 1}: {h}</p>
            ))}
          </div>
        )}

        {workspace?.notes && workspace.notes !== notes && (
          <div className="pt-3 border-t border-inherit">
            <p className="text-xs text-green-700 dark:text-green-300 whitespace-pre-wrap">{workspace.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
