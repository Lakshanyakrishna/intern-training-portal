import { useState } from 'react';
import type { QuizQuestion, Lesson, AssessmentResult } from '../types';

interface QuizEngineProps {
  questions: QuizQuestion[];
  onPass: (score?: number, total?: number) => void;
  moduleTitle?: string;
  lessons?: Lesson[];
  existingResult?: AssessmentResult;
}

export default function QuizEngine({ questions, onPass, moduleTitle, lessons, existingResult }: QuizEngineProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const pct = correct / questions.length;
    setScore(correct);
    setSubmitted(true);
    if (pct >= 0.7) {
      setPassed(true);
    }
    onPass(correct, questions.length);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setPassed(false);
    setScore(0);
    setCurrent(0);
  };

  const question = questions[current];
  const selected = answers[question?.id];

  if (submitted && !passed) {
    const missed = questions.filter(q => answers[q.id] !== q.correctAnswer);
    const suggestedLessons = lessons
      ? lessons.slice(0, Math.min(3, lessons.length)).map(l => l.title)
      : [];

    return (
      <div className="space-y-5">
        {existingResult && existingResult.attempts.length > 0 && (
          <div className="border border-line rounded-xl p-4 bg-surface-alt">
            <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Attempt History</h4>
            <div className="space-y-1.5">
              {existingResult.attempts.map((a, i) => (
                <p key={i} className={`text-xs ${a.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  Attempt {i + 1}: {a.score}/{a.total} ({Math.round((a.score / a.total) * 100)}%) {a.passed ? '— Passed' : ''}
                </p>
              ))}
              <p className="text-xs text-secondary pt-1">Best score: {existingResult.bestScore}/{questions.length}</p>
            </div>
          </div>
        )}

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h3 className="font-bold text-red-800 dark:text-red-200 text-lg">Assessment Incomplete</h3>
              <p className="text-sm text-red-600 dark:text-red-400">Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%) — need 70% to pass</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Topics Requiring Improvement</h4>
              <ul className="space-y-1.5">
                {missed.map(q => (
                  <li key={q.id} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                    <span className="mt-0.5 shrink-0">•</span>
                    <span>{q.question}</span>
                  </li>
                ))}
              </ul>
            </div>

            {suggestedLessons.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Suggested Lessons to Revisit</h4>
                <ul className="space-y-1.5">
                  {suggestedLessons.map((l, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                      <span className="text-red-400">→</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white dark:bg-red-900/10 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
              <strong>Retry Guidance:</strong> Review the lessons above, then attempt the assessment again.
            </div>
          </div>
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors text-sm"
        >
          Retry Assessment
        </button>
      </div>
    );
  }

  if (passed) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mt-3">Assessment Passed!</h3>
        <p className="text-green-600 dark:text-green-400 mt-1">
          Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
        </p>
        {existingResult && existingResult.attempts.length > 0 && (
          <p className="text-xs text-green-500 dark:text-green-500 mt-1">
            Attempt {existingResult.attempts.length}: Best score {existingResult.bestScore}/{questions.length}
          </p>
        )}
        {moduleTitle && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">{moduleTitle} module complete. Next module unlocked.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary">Module Assessment</h3>
        <span className="text-sm text-secondary">Question {current + 1} of {questions.length}</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              answers[questions[i].id] !== undefined
                ? 'bg-neutral-500'
                : i === current
                ? 'bg-neutral-200 dark:bg-neutral-700'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {question && (
        <div className="bg-surface rounded-xl border border-line p-5">
          <p className="font-medium text-primary mb-4">{question.question}</p>
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isCorrect = submitted && idx === question.correctAnswer;
              const isWrong = submitted && idx === selected && idx !== question.correctAnswer;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(question.id, idx)}
                  disabled={submitted}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                    isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200'
                      : isWrong
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200'
                      : selected === idx
                      ? 'bg-neutral-50 dark:bg-neutral-900/30 border-neutral-400 text-neutral-700 dark:text-neutral-300'
                      : 'border-line text-gray-700 dark:text-gray-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setCurrent(p => Math.max(0, p - 1))}
          disabled={current === 0}
          className="px-4 py-2 text-sm rounded-lg border border-line text-secondary disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(p => p + 1)}
            disabled={selected === undefined}
            className="px-4 py-2 text-sm rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent-hover"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className="px-6 py-2 text-sm rounded-lg bg-green-600 text-white disabled:opacity-40 hover:bg-green-700 font-semibold"
          >
            Submit Assessment
          </button>
        )}
      </div>

      {Object.keys(answers).length < questions.length && current === questions.length - 1 && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          Answer all {questions.length} questions to submit
        </p>
      )}
    </div>
  );
}
