import { useState } from 'react';
import type { Practice, PracticeSubmission } from '../types';
import { Save } from './Icons';

interface PracticeCardProps {
  practice: Practice;
  completed: boolean;
  existingSubmission?: PracticeSubmission;
  onSaveSubmission: (submission: string) => void;
}

export default function PracticeCard({ practice, completed, existingSubmission, onSaveSubmission }: PracticeCardProps) {
  const [submission, setSubmission] = useState(existingSubmission?.submission || '');
  const [saved, setSaved] = useState(!!existingSubmission);

  const handleSave = () => {
    if (!submission.trim()) return;
    onSaveSubmission(submission);
    setSaved(true);
  };

  return (
    <div className={`rounded-xl border p-5 ${completed && saved ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-surface border-line'}`}>
      {completed && saved ? (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">Submission saved</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 whitespace-pre-wrap">{existingSubmission?.submission}</p>
          </div>
          <button
            onClick={() => {/* re-open for editing */}}
            className="text-xs px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={submission}
            onChange={e => setSubmission(e.target.value)}
            placeholder="Write your solution here..."
            rows={4}
            className="w-full text-sm border border-line rounded-lg px-3 py-2 bg-surface text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
          />
          {practice.hints && practice.hints.length > 0 && (
            <details className="group">
              <summary className="text-xs text-secondary cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors select-none">
                Need a hint? ({practice.hints.length} available)
              </summary>
              <div className="mt-2 space-y-1.5">
                {practice.hints.map((h, i) => (
                  <p key={i} className="text-xs text-secondary bg-surface-alt px-3 py-2 rounded-lg">Hint {i + 1}: {h}</p>
                ))}
              </div>
            </details>
          )}
          <button
            onClick={handleSave}
            disabled={!submission.trim()}
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Update Submission' : 'Save Submission'}
          </button>
        </div>
      )}
    </div>
  );
}
