import { useState, useCallback, useRef } from 'react';
import type { CheckpointQuiz as CheckpointQuizType } from '../types';
import { CheckCircle, ArrowRight } from './Icons';

interface CheckpointQuizProps {
  quiz: CheckpointQuizType;
  existingResult?: { passed: boolean; score: number; total: number; attempts: number; answers: Record<number, { selected: number; correct: boolean }> };
  onComplete: (result: { passed: boolean; score: number; total: number; attempts: number; answers: Record<number, { selected: number; correct: boolean }>; timeTaken: number }) => void;
  onContinue?: () => void;
}

interface QuestionAnswer {
  selected: number;
  correct: boolean;
}

function resultStyle(score: number, total: number) {
  if (score === total) return {
    border: 'border-green-200 dark:border-green-800',
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-200',
    subtext: 'text-green-600 dark:text-green-400',
    message: 'Excellent work.',
  };
  if (score >= total * 0.66) return {
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-200',
    subtext: 'text-blue-600 dark:text-blue-400',
    message: 'Good progress. Review the explanations before continuing.',
  };
  return {
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-800 dark:text-amber-200',
    subtext: 'text-amber-600 dark:text-amber-400',
    message: score === 0
      ? 'Review the lesson concepts before moving forward.'
      : 'You may want to revisit the lesson, but you can continue.',
  };
}

export default function CheckpointQuiz({ quiz, existingResult, onComplete, onContinue }: CheckpointQuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [answers, setAnswers] = useState<Record<number, QuestionAnswer>>({});
  const [done, setDone] = useState(false);
  const questionStartTime = useRef(Date.now());
  const totalTime = useRef(0);

  const question = quiz.questions[current];

  const handleSelect = useCallback((optionIdx: number) => {
    if (submitted) return;
    setSelected(optionIdx);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (selected < 0 || submitted) return;
    const timeSec = Math.round((Date.now() - questionStartTime.current) / 1000);
    totalTime.current += timeSec;
    const isCorrect = selected === question.answer;
    setCorrect(isCorrect);
    setSubmitted(true);
    setAnswers(prev => ({
      ...prev,
      [current]: { selected, correct: isCorrect },
    }));
  }, [selected, submitted, current, question]);

  const handleNext = useCallback(() => {
    if (current + 1 < quiz.questions.length) {
      questionStartTime.current = Date.now();
      setSelected(-1);
      setSubmitted(false);
      setCorrect(false);
      setCurrent(prev => prev + 1);
    } else {
      setDone(true);
      const correctCount = quiz.questions.filter((q, i) => {
        const a = { ...answers, [current]: { selected, correct: selected === q.answer } };
        return a[i]?.correct;
      }).length;
      const allAnswers = { ...answers, [current]: { selected, correct: selected === question.answer } };
      onComplete({
        passed: correctCount === quiz.questions.length,
        score: correctCount,
        total: quiz.questions.length,
        attempts: 1,
        answers: allAnswers,
        timeTaken: totalTime.current + Math.round((Date.now() - questionStartTime.current) / 1000),
      });
    }
  }, [current, quiz, answers, selected, question, onComplete]);

  if (existingResult) {
    const s = resultStyle(existingResult.score, existingResult.total);
    return (
      <div className="space-y-5">
        <div className={`border rounded-xl p-5 ${s.border} ${s.bg}`}>
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-6 h-6 shrink-0 ${s.text}`} />
            <div>
              <p className={`text-sm font-semibold ${s.text}`}>Checkpoint Complete</p>
              <p className={`text-xs mt-0.5 ${s.subtext}`}>Score: {existingResult.score}/{existingResult.total}</p>
              <p className={`text-xs mt-1.5 ${s.subtext}`}>{s.message}</p>
            </div>
          </div>
        </div>
        {onContinue && (
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Continue <ArrowRight />
          </button>
        )}
      </div>
    );
  }

  if (done) {
    const score = quiz.questions.filter((_, i) => answers[i]?.correct).length;
    const s = resultStyle(score, quiz.questions.length);
    return (
      <div className="space-y-6">
        <div className={`border rounded-xl p-5 ${s.border} ${s.bg}`}>
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-6 h-6 shrink-0 ${s.text}`} />
            <div>
              <p className={`text-sm font-semibold ${s.text}`}>Checkpoint Complete</p>
              <p className={`text-xs mt-0.5 ${s.subtext}`}>Score: {score}/{quiz.questions.length}</p>
              <p className={`text-xs mt-1.5 ${s.subtext}`}>{s.message}</p>
            </div>
          </div>
        </div>

        {quiz.questions.map((qq, i) => {
          const a = answers[i];
          if (!qq) return null;
          return (
            <div key={i} className={`rounded-xl border p-5 ${a?.correct ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10'}`}>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">{i + 1}. {qq.q}</p>
              <ul className="space-y-1.5 mb-3">
                {qq.options.map((opt, j) => {
                  const isSelected = a?.selected === j;
                  const isCorrectAnswer = j === qq.answer;
                  return (
                    <li key={j}>
                      <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                        isCorrectAnswer
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : isSelected && !isCorrectAnswer
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        <span className="shrink-0">{String.fromCharCode(65 + j)}.</span>
                        <span className="flex-1">{opt}</span>
                        {isCorrectAnswer && <span className="text-green-600 dark:text-green-400 text-xs font-medium shrink-0">✓</span>}
                        {isSelected && !isCorrectAnswer && <span className="text-amber-600 dark:text-amber-400 text-xs font-medium shrink-0">✗</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {onContinue && (
          <div className="flex justify-end pt-2">
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Continue <ArrowRight />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Question {current + 1} of {quiz.questions.length}
        </span>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div key={i} className={`w-6 h-1.5 rounded-full ${
              answers[i]?.correct
                ? 'bg-green-500'
                : answers[i] !== undefined && !answers[i]?.correct
                ? 'bg-amber-400'
                : i === current
                ? 'bg-blue-400'
                : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-5">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-4">{question.q}</p>

        <ul className="space-y-2">
          {question.options.map((opt, j) => {
            const isSelected = selected === j;
            const showCorrect = submitted && j === question.answer;
            const showWrong = submitted && isSelected && j !== question.answer;

            return (
              <li key={j}>
                <button
                  onClick={() => handleSelect(j)}
                  disabled={submitted}
                  className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm transition-all ${
                    showCorrect
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-2 border-green-400'
                      : showWrong
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-2 border-amber-400'
                      : isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-400'
                      : 'bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium shrink-0 ${
                    showCorrect ? 'border-green-500 bg-green-500 text-white' :
                    showWrong ? 'border-amber-500 bg-amber-500 text-white' :
                    isSelected ? 'border-blue-500 bg-blue-500 text-white' :
                    'border-gray-300 dark:border-gray-600'
                  }`}>
                    {String.fromCharCode(65 + j)}
                  </span>
                  <span>{opt}</span>
                  {showCorrect && <span className="ml-auto text-green-600 dark:text-green-400 text-xs font-medium">Correct</span>}
                  {showWrong && <span className="ml-auto text-amber-600 dark:text-amber-400 text-xs font-medium">Your answer</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {submitted && (
          <div className={`mt-4 text-xs px-4 py-3 rounded-lg ${
            correct
              ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20'
              : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20'
          }`}>
            {correct ? (
              <p>{question.explanation}</p>
            ) : (
              <div className="space-y-1">
                <p className="font-medium">Correct answer: {question.options[question.answer]}</p>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected < 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            {current + 1 < quiz.questions.length ? 'Next →' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
