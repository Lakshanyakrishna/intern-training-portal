import { useState } from 'react';
import type { ReviewRequest } from '../types';

interface PRReviewPanelProps {
  reviews: ReviewRequest[];
  completedReviews: string[];
  onComplete: (reviewId: string, xp: number) => void;
}

export default function PRReviewPanel({ reviews, completedReviews, onComplete }: PRReviewPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const activeReviews = reviews.filter(r => !completedReviews.includes(r.id));
  const review = activeReviews[currentIndex] ?? null;

  if (!review) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-green-600 dark:text-green-400 font-medium">All reviews completed!</p>
      </div>
    );
  }

  const toggleOption = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    const correct = review.correctReviews;
    const allCorrectSelected = correct.every(c => selectedOptions.includes(c));
    const noExtra = selectedOptions.every(s => correct.includes(s));
    if (allCorrectSelected && noExtra) {
      onComplete(review.id, review.xpReward);
    }
  };

  const correct = review.correctReviews;
  const allCorrectSelected = correct.every(c => selectedOptions.includes(c));
  const noExtra = selectedOptions.every(s => correct.includes(s));
  const isCorrect = allCorrectSelected && noExtra;
  const allSelected = selectedOptions.length > 0;
  const completed = completedReviews.includes(review.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{review.title}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">{completedReviews.length}/{reviews.length} reviews</span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">{review.description}</p>

      <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 overflow-x-auto">
        <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">{review.code}</pre>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Select all issues found:</p>
        {review.options.map(option => {
          const isChecked = selectedOptions.includes(option);
          const isCorrectOption = correct.includes(option);
          let bgClass = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
          if (completed || (allSelected && isCorrectOption && isChecked)) bgClass = 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
          else if (allSelected && isChecked && !isCorrectOption) bgClass = 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';

          return (
            <label
              key={option}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${bgClass} ${
                completed ? 'pointer-events-none' : 'hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleOption(option)}
                disabled={completed}
                className="mt-0.5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          );
        })}
      </div>

      {allSelected && !completed && (
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isCorrect}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isCorrect
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isCorrect ? '✓ Correct! Submit Review' : 'Submit Review'}
          </button>
          {isCorrect && (
            <button
              onClick={() => { setSelectedOptions([]); setCurrentIndex(i => i + 1); }}
              className="w-full py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Next Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
