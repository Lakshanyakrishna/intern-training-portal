import { Grid } from '../../components/Icons';
import EmptyState from '../components/EmptyState';
import OpportunityCard from '../components/OpportunityCard';
import type { Opportunity } from '../types';

export default function NoApplicationStage({
  opportunities,
  onApply,
}: {
  opportunities: Opportunity[];
  onApply: (opportunityId: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-1">Browse opportunities</h2>
      <p className="text-sm text-secondary mb-6">Find something worth applying to — it takes a few minutes.</p>

      {opportunities.length === 0 ? (
        <EmptyState
          icon={<Grid className="w-5 h-5" />}
          title="Nothing open right now"
          description="Check back soon — new opportunities are posted regularly."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} onApply={onApply} />
          ))}
        </div>
      )}
    </div>
  );
}
