import { useState } from 'react';
import type { Lesson } from '../types';
import { CheckCircle } from './Icons';

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
  onComplete: () => void;
}

export default function LessonCard({ lesson, completed, onComplete }: LessonCardProps) {
  const [expanded, setExpanded] = useState(false);

  const borderClass = completed
    ? 'border-green-200 dark:border-green-800'
    : 'border-line';
  const bgClass = completed
    ? 'bg-green-50 dark:bg-green-900/20'
    : 'bg-surface';

  return (
    <div className={`${bgClass} ${borderClass} border rounded-lg overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-primary">{lesson.title}</h3>
            {completed && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
          </div>
          {lesson.why && <p className="text-xs text-accent mt-0.5 truncate">{lesson.why}</p>}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 ml-2 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-inherit pt-3">
          <div className="text-sm text-secondary leading-relaxed whitespace-pre-line">
            {lesson.content}
          </div>
          {lesson.code && (
            <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto">
              <code>{lesson.code}</code>
            </pre>
          )}
          {lesson.why && (
            <div className="bg-neutral-50 dark:bg-neutral-900/20 rounded-lg p-3 text-xs text-neutral-700 dark:text-neutral-300">
              <span className="font-semibold">Why this matters: </span>
              {lesson.why}
            </div>
          )}
          {!completed && (
            <button
              onClick={() => { onComplete(); }}
              className="px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors font-medium"
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
