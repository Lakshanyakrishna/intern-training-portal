import { Link } from 'react-router-dom';
import { ArrowRight, Grid } from '../../components/Icons';
import EmptyState from '../components/EmptyState';
import OpportunityCard from '../components/OpportunityCard';
import type { Opportunity } from '../types';

// Only ever teases a handful here -- as the real opportunity list grows
// past a screenful, this cap keeps the dashboard from turning into an
// endless scroll. The full, searchable list lives at /applicant/opportunities.
const PREVIEW_LIMIT = 6;

export default function NoApplicationStage({
  opportunities,
  onApply,
}: {
  opportunities: Opportunity[];
  onApply: (opportunityId: string) => void;
}) {
  const preview = opportunities.slice(0, PREVIEW_LIMIT);

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-1">Browse opportunities</h2>
          <p className="text-sm text-secondary">Find something worth applying to — it takes a few minutes.</p>
        </div>
        {opportunities.length > 0 && (
          <Link
            to="/applicant/opportunities"
            className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg px-1 py-0.5"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {opportunities.length === 0 ? (
        <EmptyState
          icon={<Grid className="w-5 h-5" />}
          title="Nothing open right now"
          description="Check back soon — new opportunities are posted regularly."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {preview.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} onApply={onApply} />
          ))}
        </div>
      )}
    </div>
  );
}
