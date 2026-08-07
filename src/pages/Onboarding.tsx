import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInternTrackAssignment } from '../lib/db';
import { BookOpen, ArrowRight } from '../components/Icons';

export default function Onboarding() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [trackName, setTrackName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getInternTrackAssignment(user.id).then(a => setTrackName(a?.trackName ?? null)).catch(() => {});
  }, [user]);

  const handleStart = () => {
    completeOnboarding();
    navigate('/training');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-line rounded-xl p-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900/30 text-accent">
            <BookOpen className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-primary mb-3">
            Welcome to the Intern Readiness Program
          </h1>

          <p className="text-sm text-secondary mb-4 leading-relaxed">
            This program prepares you for real project work through structured training,
            practical assignments, assessments, and mentor reviews.
          </p>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-8">
            {trackName
              ? `You've been assigned to ${trackName}. Your first step is to begin it.`
              : 'Your first step is to begin the Foundation Track.'}
          </p>

          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Start Training
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
