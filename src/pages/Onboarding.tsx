import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, ArrowRight } from '../components/Icons';

export default function Onboarding() {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome to the Intern Readiness Program
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            This program prepares you for real project work through structured training,
            practical assignments, assessments, and mentor reviews.
          </p>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-8">
            Your first step is to begin the Foundation Track.
          </p>

          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Start Training
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
