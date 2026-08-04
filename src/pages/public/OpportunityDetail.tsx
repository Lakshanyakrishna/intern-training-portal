import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOpportunity } from '../../lib/db';
import type { DbOpportunity } from '../../lib/db';

const categoryColors: Record<string, string> = {
  internship: 'bg-neutral-100 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300',
  training: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  fellowship: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  project: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function OpportunityDetail() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const [opportunity, setOpportunity] = useState<DbOpportunity | null | undefined>(undefined);

  useEffect(() => {
    if (!opportunityId) return;
    getOpportunity(opportunityId).then(setOpportunity);
  }, [opportunityId]);

  if (opportunity === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-neutral-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (opportunity === null) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-line bg-surface">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="text-sm font-bold text-primary">Intern Readiness Program</Link>
            <div className="flex items-center gap-3">
              <Link to="/opportunities" className="text-xs text-accent font-medium">Opportunities</Link>
            </div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">Opportunity Not Found</h1>
          <p className="text-secondary mb-6">This opportunity may have been removed or doesn't exist.</p>
          <Link to="/opportunities" className="px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors text-sm">
            Browse Opportunities
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-primary">Intern Readiness Program</Link>
          <div className="flex items-center gap-3">
            <Link to="/opportunities" className="text-xs text-secondary hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Opportunities</Link>
            <Link to="/about" className="text-xs text-secondary hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
            <Link to="/login" className="text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Login</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/opportunities" className="inline-flex items-center gap-1 text-sm text-accent hover:underline mb-6">
          &larr; Back to Opportunities
        </Link>

        <div className="bg-surface border border-line rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${categoryColors[opportunity.category] || 'bg-gray-100 dark:bg-gray-700 text-secondary'}`}>
              {opportunity.category}
            </span>
            {opportunity.status === 'active' && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                Open
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-primary mb-4">{opportunity.title}</h1>

          <div className="prose prose-sm dark:prose-invert max-w-none text-secondary leading-relaxed whitespace-pre-wrap mb-8">
            {opportunity.description}
          </div>

          <div className="border-t border-line pt-6 space-y-3">
            {opportunity.startDate && opportunity.endDate && (
              <DetailRow label="Duration" value={`${formatDate(opportunity.startDate)} – ${formatDate(opportunity.endDate)}`} />
            )}
            {opportunity.slots !== undefined && (
              <DetailRow label="Slots Available" value={String(opportunity.slots)} />
            )}
            <DetailRow label="Posted" value={formatDate(opportunity.createdAt) || 'Unknown'} />
          </div>

          <div className="mt-8 pt-6 border-t border-line">
            <Link
              to={`/apply/${opportunity.id}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors text-sm"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-secondary">{label}</span>
      <span className="text-sm font-medium text-primary">{value}</span>
    </div>
  );
}
