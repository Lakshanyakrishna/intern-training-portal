import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getOpportunity } from '../../lib/db';
import type { DbOpportunity } from '../../lib/db';
import { ArrowRight } from '../../components/Icons';

// Gate page placed in front of the application form: applying now requires
// an account, so every unauthenticated "Apply" click lands here first and
// the chosen opportunity is carried through the URL (/apply/:slug/
// create-account). Signup reuses the exact same AuthContext.signUp path as
// the existing /signup page (which assigns the lowest-privilege 'applicant'
// role), and on success the user is dropped straight onto
// /apply/:slug -- pre-filled from the account they just created.
export default function CreateAccount() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [opportunity, setOpportunity] = useState<DbOpportunity | null | undefined>(undefined);

  useEffect(() => {
    if (!opportunityId) return;
    let cancelled = false;
    getOpportunity(opportunityId)
      .then(o => { if (!cancelled) setOpportunity(o); })
      .catch(() => { if (!cancelled) setOpportunity(null); });
    return () => { cancelled = true; };
  }, [opportunityId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-line border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={opportunityId ? `/apply/${opportunityId}` : '/opportunities'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const result = await signUp({ name, email, password });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(opportunityId ? `/apply/${opportunityId}` : '/opportunities');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Create Your Account</h1>
          <p className="text-sm text-secondary mt-1">
            {opportunity
              ? `Create an account to apply for ${opportunity.title}.`
              : 'Create an account to apply to the Intern Readiness Program.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-line bg-surface text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-line bg-surface text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-line bg-surface text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-line bg-surface text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors text-sm inline-flex items-center justify-center gap-2"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Already have an account?{' '}
            <Link
              to={opportunityId ? `/login?redirect=${encodeURIComponent(`/apply/${opportunityId}`)}` : '/login'}
              className="text-accent hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
