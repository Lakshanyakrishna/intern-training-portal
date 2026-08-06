import { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { roleHomePath } from '../../utils/roleHome';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      // When coming from the apply flow (e.g. the "Sign In" link on the
      // Create Account gate), return the user to the application form
      // instead of their role home. We check both query params and location state.
      const redirect = searchParams.get('redirect') || (location.state as any)?.from?.pathname;
      navigate(redirect && redirect.startsWith('/') ? redirect : roleHomePath(result.user?.role));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Welcome back</h1>
          <p className="text-sm text-secondary mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
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
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors text-sm"
          >
            {submitting ? 'Signing in...' : 'Login'}
          </button>

          <div className="text-center text-xs text-gray-400 dark:text-gray-500">
            <Link to="/login" className="text-accent hover:underline">Forgot Password</Link>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Don't have an account?{' '}
            <Link to={searchParams.has('redirect') ? `/signup?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : (location.state as any)?.from?.pathname ? `/signup?redirect=${encodeURIComponent((location.state as any).from.pathname)}` : '/signup'} className="text-accent hover:underline font-medium">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
