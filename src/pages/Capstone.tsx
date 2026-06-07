import { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import ProgressBar from '../components/ProgressBar';
import { Trophy } from '../components/Icons';

interface Step {
  id: string;
  title: string;
  description: string;
  task: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const capstoneSteps: Step[] = [
  {
    id: 'cp-1',
    title: 'Clone the Repository',
    description: 'You join a client project. The project is hosted on GitHub.',
    task: 'What command do you use to get a local copy of the repository?',
    options: ['git init', 'git clone <url>', 'git fork <url>', 'git download <url>'],
    correctAnswer: 1,
    explanation: 'git clone creates a local copy of a remote repository with its full history.',
  },
  {
    id: 'cp-2',
    title: 'Create a Feature Branch',
    description: 'You need to add a new feature: user profile page.',
    task: 'Which command creates and switches to a new branch called "feature/profile"?',
    options: ['git branch feature/profile', 'git checkout -b feature/profile', 'git switch feature/profile', 'git branch -m feature/profile'],
    correctAnswer: 1,
    explanation: 'git checkout -b creates and switches to the new branch in one step.',
  },
  {
    id: 'cp-3',
    title: 'Make Changes',
    description: 'You update the profile component with new fields.',
    task: 'After editing the files, what command shows which files were changed?',
    options: ['git log', 'git diff', 'git status', 'git show'],
    correctAnswer: 2,
    explanation: 'git status shows the current state: modified files, staged files, and untracked files.',
  },
  {
    id: 'cp-4',
    title: 'Commit Changes',
    description: 'Your changes are ready to be committed.',
    task: 'What is the correct sequence to commit your changes?',
    options: ['git commit -m "msg" then git add .', 'git add . then git commit -m "msg"', 'git push then git commit', 'git commit then git push'],
    correctAnswer: 1,
    explanation: 'First stage changes with git add ., then commit with git commit -m "message".',
  },
  {
    id: 'cp-5',
    title: 'Push Code',
    description: 'Your feature branch is ready to share with the team.',
    task: 'What command pushes your new branch to GitHub for the first time?',
    options: ['git push origin main', 'git push -u origin feature/profile', 'git push feature/profile', 'git upload origin feature/profile'],
    correctAnswer: 1,
    explanation: 'git push -u origin <branch> pushes and sets upstream tracking for the first push.',
  },
  {
    id: 'cp-6',
    title: 'Deploy Frontend',
    description: 'The team asks you to deploy the frontend for testing.',
    task: 'Which platform is best suited for deploying a React frontend?',
    options: ['Railway with Docker', 'Vercel with Git integration', 'AWS EC2 manually', 'A shared hosting server'],
    correctAnswer: 1,
    explanation: 'Vercel is optimized for frontend deployment with automatic Git integration and preview deployments.',
  },
  {
    id: 'cp-7',
    title: 'Configure Supabase',
    description: 'The app needs a database for user profiles.',
    task: 'How do you create a "profiles" table with RLS?',
    options: ['Use the Supabase Table Editor or SQL Editor, then enable RLS', 'Create a JSON file in the project', 'Use localStorage instead', 'Add it to the React component state'],
    correctAnswer: 0,
    explanation: 'Supabase provides a Table Editor and SQL Editor. After creating the table, enable RLS and add policies.',
  },
  {
    id: 'cp-8',
    title: 'Debug the Issue',
    description: 'The deployment is failing with a build error.',
    task: 'The error says "Module not found: Can\'t resolve \'axios\'". What is the most likely fix?',
    options: ['Rename the import', 'Run npm install axios', 'Delete node_modules', 'Use fetch() instead'],
    correctAnswer: 1,
    explanation: 'The module is missing. Running npm install axios adds the dependency to node_modules.',
  },
  {
    id: 'cp-9',
    title: 'Create Pull Request',
    description: 'Your feature is complete and deployed.',
    task: 'What should a good PR description include?',
    options: ['Just "Done"', 'A list of changes, testing steps, and related issues', 'Only the commit messages', 'A screenshot of your code'],
    correctAnswer: 1,
    explanation: 'A good PR includes a description of changes, how to test, and references to related issues.',
  },
  {
    id: 'cp-10',
    title: 'Professional Communication',
    description: 'The client reports an issue.',
    task: 'Bad: "Your app is broken." What is the professional way to report this?',
    options: ['"Its not working fix it"', '"The login form returns a 401 error when submitting valid credentials on Chrome v120. Steps: 1. Go to /login 2. Enter credentials 3. Click submit 4. See error"', '"Something is wrong"', '"The app crashed"'],
    correctAnswer: 1,
    explanation: 'A professional bug report includes environment details, clear steps, expected vs actual behavior.',
  },
];

export default function Capstone() {
  const { progress, addXP, completeChallenge } = useProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const isCapstoneDone = progress.completedChallenges.includes('capstone');

  if (isCapstoneDone || completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
        <span className="text-6xl"><Trophy className="w-12 h-12 inline-block" /></span>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Capstone Complete!</h1>
        <p className="text-gray-500 dark:text-gray-400">You have demonstrated all the skills needed to work on client projects.</p>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white mt-6">
          <h3 className="text-lg font-bold mt-2">Congratulations!</h3>
          <p className="text-yellow-100 text-sm mt-1">You are now Project Ready!</p>
        </div>
      </div>
    );
  }

  const step = capstoneSteps[currentStep];
  const selected = answers[step.id];

  const handleAnswer = (idx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [step.id]: idx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correctCount = capstoneSteps.filter(s => answers[s.id] === s.correctAnswer).length;
    if (correctCount === capstoneSteps.length) {
      setCompleted(true);
      completeChallenge('capstone', 'capstone');
      addXP(200, 'capstone');
    }
  };

  const handleNext = () => {
    setSubmitted(false);
    setCurrentStep(p => p + 1);
  };

  const handleRetry = () => {
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <span className="text-5xl"><Trophy className="w-10 h-10 inline-block" /></span>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">Final Capstone</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Complete all steps to demonstrate your readiness for client projects.</p>
      </div>

      <ProgressBar percent={Math.round(((currentStep + (submitted && selected !== undefined ? 1 : 0)) / capstoneSteps.length) * 100)} />

      <div className="flex gap-2 justify-center">
        {capstoneSteps.map((s, i) => (
          <div key={s.id} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i < currentStep || (i === currentStep && submitted)
              ? 'bg-green-500 text-white'
              : i === currentStep
              ? 'bg-blue-500 text-white ring-2 ring-blue-300'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            {i < currentStep || (i === currentStep && submitted) ? '✓' : i + 1}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">Step {currentStep + 1}/{capstoneSteps.length}</span>
          <span>{step.title}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <p className="font-medium text-gray-800 dark:text-white text-sm">{step.task}</p>
        </div>
        <div className="space-y-2">
          {step.options.map((opt, idx) => {
            const isCorrect = submitted && idx === step.correctAnswer;
            const isWrong = submitted && idx === selected && idx !== step.correctAnswer;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200'
                    : isWrong
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200'
                    : selected === idx
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Explanation:</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{step.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Previous
        </button>
        {submitted ? (
          currentStep < capstoneSteps.length - 1 ? (
            <button onClick={handleNext} className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Next Step
            </button>
          ) : (
            selected === step.correctAnswer ? (
              <button onClick={handleSubmit} className="px-6 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700">
                Complete Capstone
              </button>
            ) : (
              <button onClick={handleRetry} className="px-6 py-2 text-sm rounded-lg bg-yellow-600 text-white hover:bg-yellow-700">
                Try Again
              </button>
            )
          )
        ) : (
          <button
            onClick={() => handleSubmit()}
            disabled={selected === undefined}
            className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700"
          >
            Check Answer
          </button>
        )}
      </div>
    </div>
  );
}
