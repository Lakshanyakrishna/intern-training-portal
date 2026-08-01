import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOpportunities, OPPORTUNITY_FORTES } from '../lib/db';
import type { DbOpportunity } from '../lib/db';

const categoryColors: Record<string, string> = {
  internship: 'bg-neutral-100 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300',
  training: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  fellowship: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  project: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ApplicantOpportunities() {
  const [opportunities, setOpportunities] = useState<DbOpportunity[] | null>(null);
  const [forteFilter, setForteFilter] = useState<string | null>(null);

  useEffect(() => {
    getOpportunities('active').then(setOpportunities).catch(() => setOpportunities([]));
  }, []);

  const filtered = forteFilter
    ? (opportunities ?? []).filter(o => o.forte === forteFilter)
    : opportunities ?? [];

  const forteCounts = new Map<string, number>();
  for (const opp of opportunities ?? []) {
    if (opp.forte) forteCounts.set(opp.forte, (forteCounts.get(opp.forte) ?? 0) + 1);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Open Opportunities</h1>
        <p className="text-sm text-secondary mt-1">Browse and apply without leaving your account.</p>
      </div>

      {opportunities === null ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-surface border border-line rounded-xl p-10 text-center">
          <h2 className="text-lg font-semibold text-primary mb-1">Nothing open right now</h2>
          <p className="text-sm text-secondary">Check back soon — new opportunities are posted regularly.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setForteFilter(null)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                forteFilter === null ? 'bg-accent text-accent-text border-accent' : 'border-line text-secondary hover:bg-surface-alt'
              }`}
            >
              All ({opportunities.length})
            </button>
            {OPPORTUNITY_FORTES.filter(f => forteCounts.has(f)).map(forte => (
              <button
                key={forte}
                onClick={() => setForteFilter(forte)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  forteFilter === forte ? 'bg-accent text-accent-text border-accent' : 'border-line text-secondary hover:bg-surface-alt'
                }`}
              >
                {forte} ({forteCounts.get(forte)})
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(opp => (
              <div key={opp.id} className="bg-surface border border-line rounded-xl p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${categoryColors[opp.category] || 'bg-gray-100 dark:bg-gray-700 text-secondary'}`}>
                    {opp.category}
                  </span>
                  {opp.forte && (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-alt text-primary">
                      {opp.forte}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-semibold text-primary leading-snug">{opp.title}</h2>
                <p className="text-sm text-secondary mt-1.5 line-clamp-3 flex-1">{opp.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
                  <p className="text-xs text-secondary">
                    {opp.startDate && opp.endDate
                      ? `${formatDate(opp.startDate)} – ${formatDate(opp.endDate)}`
                      : 'Dates TBD'}
                    {opp.slots !== undefined && ` • ${opp.slots} slot${opp.slots === 1 ? '' : 's'}`}
                  </p>
                  <Link
                    to={`/apply/${opp.id}`}
                    className="shrink-0 inline-flex items-center px-3.5 py-1.5 rounded-lg bg-accent text-accent-text text-xs font-medium hover:bg-accent-hover transition-colors"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
