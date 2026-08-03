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

export default function WhatsNext({ stage }: { stage: Stage }) {
  const Icon = ICONS[stage];

  return (
    <section aria-label="What's next" className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-full bg-surface-alt flex items-center justify-center text-secondary shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-sm font-semibold text-primary">What&apos;s Next?</h3>
      </div>
      <p className="text-sm text-secondary leading-relaxed">{STAGE_GUIDANCE[stage]}</p>
    </section>
  );
}
