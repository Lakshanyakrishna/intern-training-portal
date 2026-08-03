import type { ApplicationSummary } from '../types';

export default function ResumeScreeningStage({ application }: { application: ApplicationSummary }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-secondary mb-1">Current mission</p>
      <h2 className="text-xl font-semibold text-primary mb-1">Hang tight — we're reviewing</h2>
      <p className="text-sm text-secondary mb-6">{application.opportunityTitle}</p>

      <div className="rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.03] p-5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
          </span>
          <p className="text-sm font-semibold text-primary">Screening in progress</p>
        </div>
        <p className="text-sm text-secondary mt-3">
          Your application is being organized for mentor review. Estimated completion: {application.estimatedReviewDays[0]}–{application.estimatedReviewDays[1]} days from submission.
        </p>
        <p className="text-xs text-secondary mt-3 pt-3 border-t border-line">
          AI helps organize applications for review — no score is generated or shown at this stage; a mentor makes the actual call.
        </p>
      </div>
    </div>
  );
}
