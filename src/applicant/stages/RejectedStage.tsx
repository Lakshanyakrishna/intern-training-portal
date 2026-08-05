import OpportunityCard from '../components/OpportunityCard';
import type { Opportunity } from '../types';

export default function RejectedStage({
  recommended,
  onApply,
  onUpdateProfile,
}: {
  recommended: Opportunity[];
  onApply: (opportunityId: string) => void;
  onUpdateProfile: () => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-1">This one didn't work out</h2>
      <p className="text-sm text-secondary mb-6">
        That's specific to this opportunity, not a verdict on you — plenty of applicants land somewhere else on a later round.
      </p>

      <div className="rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.03] p-5">
        <p className="text-sm text-primary font-medium mb-1">General feedback</p>
        <p className="text-sm text-secondary">
          [Placeholder] Structured feedback per applicant isn't available yet — this section will summarize what stood out and what to strengthen once that's built.
        </p>
        <button
          onClick={onUpdateProfile}
          className="mt-4 px-4 py-2 rounded-lg bg-accent text-accent-text text-sm font-medium hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Update Profile
        </button>
      </div>

      {recommended.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-primary mb-3">Other opportunities you might like</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {recommended.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} onApply={onApply} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
