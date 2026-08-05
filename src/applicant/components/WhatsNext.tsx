import type { ReactNode } from 'react';
import { Briefcase, Send, FileText, Calendar, Video, Activity, CheckCircle, XCircle } from '../../components/Icons';
import type { Stage } from '../types';

const ICONS = {
  no_application: Briefcase,
  application_submitted: Send,
  resume_screening: FileText,
  interview_scheduling: Calendar,
  interview_scheduled: Video,
  interview_completed: Activity,
  selected: CheckCircle,
  rejected: XCircle,
} as const;

// Stage-aware "what happens from here" guidance. Keyed off the same Stage
// single source of truth as the rest of the page, so it tracks applicantStage
// changes automatically. Unlike the Estimated Timeline card, this one renders
// for every stage including no_application -- there's always a next step.
const STAGE_GUIDANCE: Record<Stage, string> = {
  no_application: 'Browse available opportunities and submit your application to begin your hiring journey.',
  application_submitted: "Our recruitment team will review your application. You'll get notified once the review is complete.",
  resume_screening: "Your qualifications are being evaluated. If shortlisted, you'll be invited to schedule an interview.",
  interview_scheduling: "Choose an interview time that works best for you. It'll be confirmed immediately after scheduling.",
  interview_scheduled: "Prepare for your interview — review the details and make sure you're available at the scheduled time.",
  interview_completed: 'Our team is reviewing your interview. Expect an update on the final decision soon.',
  selected: 'Review your offer carefully and accept it within the response period. Onboarding instructions follow.',
  rejected: "This one didn't work out — you can explore new openings and apply again in the future.",
};

// `trailing` gives this banner a second, secondary slot -- used to fold the
// Estimated Timeline badge in here instead of it repeating as its own
// full-width card at every stage. Optional so WhatsNext still works as a
// standalone banner if nothing needs the slot later.
export default function WhatsNext({ stage, trailing }: { stage: Stage; trailing?: ReactNode }) {
  const Icon = ICONS[stage];

  return (
    <section
      id="whats-next"
      aria-label="What's next"
      className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface pl-5 pr-3 sm:pr-4 py-4 sm:py-5 shadow-sm shadow-black/[0.03] border-l-4 border-l-accent scroll-mt-20"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-accent text-accent-text flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">What&apos;s next</h2>
          <p className="text-sm text-primary leading-relaxed">{STAGE_GUIDANCE[stage]}</p>
        </div>
      </div>
      {trailing && (
        <>
          <div className="hidden sm:block w-px self-stretch bg-line shrink-0" />
          {trailing}
        </>
      )}
    </section>
  );
}
