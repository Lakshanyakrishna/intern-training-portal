import { useState } from 'react';
import type { ClientProjectDay } from '../types';

interface ClientSimDayProps {
  days: ClientProjectDay[];
  completedDays: string[];
  onAdvance: (dayId: string) => void;
}

export default function ClientSimDay({ days, completedDays, onAdvance }: ClientSimDayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const activeDays = days.filter(d => !completedDays.includes(d.id));
  const day = activeDays[currentIndex] ?? null;

  if (!day) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-green-600 dark:text-green-400 font-medium">Project complete!</p>
      </div>
    );
  }

  const handleAction = (actionId: string) => {
    setSelectedAction(actionId);
    setShowResult(true);
    if (actionId === day.correctActionId) {
      onAdvance(day.id);
    }
  };

  const handleNext = () => {
    setSelectedAction(null);
    setShowResult(false);
    setCurrentIndex(i => i + 1);
  };

  const handleRetry = () => {
    setSelectedAction(null);
    setShowResult(false);
  };

  const isCorrect = selectedAction === day.correctActionId;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span className="font-medium">Day {day.day}/{days.length} - {day.title}</span>
        <span>{completedDays.length}/{days.length} days</span>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4">
        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Client Update</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{day.clientReport}</p>
      </div>

      {!showResult ? (
        <div className="grid gap-2">
          {day.availableActions.map(action => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="text-left p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-white">{action.label}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{action.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-xl p-4 border ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <p className={`text-sm font-medium mb-1 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {isCorrect ? '✓ Great choice!' : '✗ That didn\'t go well'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isCorrect ? day.consequence : day.availableActions.find(a => a.id === selectedAction)?.outcome}
            </p>
          </div>
          {isCorrect ? (
            <button
              onClick={handleNext}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Next Day →
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
