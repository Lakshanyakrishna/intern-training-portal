import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOpportunities } from '../../lib/db';
import type { DbOpportunity } from '../../lib/db';

const categoryColors: Record<string, string> = {
  internship: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  training: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  fellowship: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  project: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
};

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<DbOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOpportunities('active')
      .then(setOpportunities)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-gray-900 dark:text-white">Intern Readiness Program</Link>
          <div className="flex items-center gap-3">
            <Link to="/about" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
            <Link to="/login" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Login</Link>
            <Link to="/signup" className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Opportunities</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Explore internships, training programs, fellowships, and projects.</p>
        </div>

        {opportunities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">No open opportunities right now. Check back later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map(opp => (
              <article key={opp.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-gray-900 dark:text-white">{opp.title}</h2>
                  <span className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${categoryColors[opp.category] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                    {opp.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">
                  {truncate(opp.description, 120)}
                </p>
                <div className="space-y-1.5 mb-4 text-xs text-gray-500 dark:text-gray-400">
                  {opp.startDate && opp.endDate && (
                    <p>{formatDate(opp.startDate)} – {formatDate(opp.endDate)}</p>
                  )}
                  {opp.slots !== undefined && opp.slots > 0 && (
                    <p>{opp.slots} slot{opp.slots !== 1 ? 's' : ''} available</p>
                  )}
                </div>
                <Link
                  to={`/apply/${opp.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
