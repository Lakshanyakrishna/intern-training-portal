import { Clock } from '../../components/Icons';
import type { Stage } from '../types';

interface TimelineCopy {
  timeline: string;
  note: string;
}

// Stage-aware time expectations. Keyed off the same Stage single source of
// truth as everything else on the page, so this card tracks applicantStage
// changes automatically with no hardcoding. no_application intentionally
// renders nothing -- there is no timeline to show before an application exists.
const STAGE_TIMELINE: Record<Stage, TimelineCopy> = {
  no_application: { timeline: '', note: '' },
  application_submitted: {
    timeline: '1–2 business days',
    note: 'Your application has been received and is waiting for an initial review.',
  },
  resume_screening: {
    timeline: '2–3 business days',
    note: "Your profile is currently under review. If shortlisted, you'll receive an interview invitation.",
  },
  interview_scheduling: {
    timeline: 'Complete within 24 hours',
    note: 'Please select your preferred interview slot to keep your application moving.',
  },
  interview_scheduled: {
    timeline: 'Decision usually within 3–5 business days after your interview',
    note: 'Our team will evaluate your interview and update you as soon as possible.',
  },
  interview_completed: {
    timeline: 'Decision usually within 3–5 business days',
    note: 'Thanks for the conversation — our team is reviewing your interview and will be in touch.',
  },
  selected: {
    timeline: 'Accept within 5 business days',
    note: 'Please review your offer and respond before the deadline.',
  },
  rejected: {
    timeline: 'Process completed',
    note: "Thank you for your interest — you're welcome to apply for future opportunities.",
  },
};

export default function EstimatedTimeline({ stage }: { stage: Stage }) {
  if (stage === 'no_application') return null;
  const copy = STAGE_TIMELINE[stage];

  return (
    <section aria-label="Estimated timeline" className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-full bg-surface-alt flex items-center justify-center text-secondary shrink-0">
          <Clock className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-sm font-semibold text-primary">Estimated Timeline</h3>
      </div>
      <p className="text-sm font-semibold text-primary leading-snug">{copy.timeline}</p>
      <p className="text-xs text-secondary mt-1.5 leading-relaxed">{copy.note}</p>
    </section>
  );
}
