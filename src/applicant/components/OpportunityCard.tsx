import type { Opportunity } from '../types';

// Structural card, not real listing UI -- the point right now is the shape
// (image slot, title, description, skills, duration, seats, deadline),
// not the specific opportunities, which are mock. Apply itself is real:
// onApply triggers the shared autoApply flow (src/applicant/utils/
// autoApply.ts), which submits for real when a profile resume exists.
export default function OpportunityCard({ opportunity, onApply, applying }: {
  opportunity: Opportunity;
  onApply: (id: string) => void;
  applying?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface overflow-hidden flex flex-col shadow-sm shadow-black/[0.03] hover:shadow-md hover:shadow-black/[0.06] hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-40 bg-surface-alt flex items-center justify-center text-[11px] text-secondary overflow-hidden">
        {opportunity.image ? (
          <img src={opportunity.image} alt="" className="w-full h-full object-cover object-top" />
        ) : (
          '[ Image placeholder ]'
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="inline-block w-fit text-[11px] font-medium uppercase tracking-wider text-secondary bg-surface-alt rounded-full px-2 py-0.5">{opportunity.category}</span>
        <h3 className="text-base font-semibold text-primary mt-2 leading-snug">{opportunity.title}</h3>
        <p className="text-sm text-secondary mt-1.5 flex-1">{opportunity.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {opportunity.skills.map(skill => (
            <span key={skill} className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-line text-secondary">
              {skill}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-line text-center">
          <div>
            <p className="text-xs font-medium text-primary">{opportunity.duration}</p>
            <p className="text-[11px] text-secondary">Duration</p>
          </div>
          <div>
            <p className="text-xs font-medium text-primary">{opportunity.seats}</p>
            <p className="text-[11px] text-secondary">Seats</p>
          </div>
          <div>
            <p className="text-xs font-medium text-primary">{opportunity.deadline}</p>
            <p className="text-[11px] text-secondary">Deadline</p>
          </div>
        </div>

        <button
          onClick={() => onApply(opportunity.id)}
          disabled={applying}
          className="mt-4 w-full py-2.5 rounded-lg bg-accent text-accent-text text-sm font-medium hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
        >
          {applying && <span className="w-3.5 h-3.5 border-2 border-accent-text/40 border-t-accent-text rounded-full animate-spin" />}
          {applying ? 'Applying…' : 'Apply'}
        </button>
      </div>
    </div>
  );
}
