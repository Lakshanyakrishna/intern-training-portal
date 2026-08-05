import { useEffect, useRef, useState } from 'react';
import { Clock } from '../../components/Icons';
import type { Stage } from '../types';

interface TimelineCopy {
  timeline: string;
  note: string;
}

// Stage-aware time expectations. Keyed off the same Stage single source of
// truth as everything else on the page, so this tracks applicantStage
// changes automatically with no hardcoding. no_application shows the general
// expectation (not a specific application's timeline) so that dashboard
// stats referencing "average review time" always have real content to point
// to, even before someone has applied.
const STAGE_TIMELINE: Record<Stage, TimelineCopy> = {
  no_application: {
    timeline: '1–3 business days',
    note: "That's how long it typically takes us to review a new application once you apply.",
  },
  application_submitted: {
    timeline: '1–2 business days',
    note: 'Your application has been received and is waiting for an initial review.',
  },
  resume_screening: {
    timeline: '2–3 business days',
    note: "Your profile is currently under review. If shortlisted, you'll receive an interview invitation.",
  },
  interview_scheduling: {
    timeline: 'Within 24 hours',
    note: 'Please select your preferred interview slot to keep your application moving.',
  },
  interview_scheduled: {
    timeline: '3–5 business days',
    note: "That's usually how long it takes us to decide after your interview.",
  },
  interview_completed: {
    timeline: '3–5 business days',
    note: 'Thanks for the conversation — our team is reviewing your interview and will be in touch.',
  },
  selected: {
    timeline: '5 business days',
    note: 'Please review your offer and respond before the deadline.',
  },
  rejected: {
    timeline: 'Process completed',
    note: "Thank you for your interest — you're welcome to apply for future opportunities.",
  },
};

// A compact, icon-first summary -- this used to be its own full-width card
// repeated near-verbatim at every stage, which felt like dead weight once
// the same "What's Next" banner already anchors the page. Folded in here as
// a small badge instead: the headline number is always visible, the fuller
// note is a click away rather than permanently taking up a whole section.
export default function EstimatedTimeline({ stage }: { stage: Stage }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const copy = STAGE_TIMELINE[stage];

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} id="estimated-timeline" className="relative shrink-0 scroll-mt-20">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        aria-label={`Estimated review time: ${copy.timeline}. ${copy.note}`}
        className="flex items-center gap-2.5 min-h-[44px] rounded-xl pl-2.5 pr-3 hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-secondary shrink-0">
          <Clock className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0 text-left hidden sm:block">
          <p className="text-sm font-semibold text-primary leading-tight">{copy.timeline}</p>
          <p className="text-[10px] text-secondary">Est. response</p>
        </div>
      </button>

      {open && (
        <div
          role="tooltip"
          className="absolute right-0 top-full mt-2 w-64 bg-surface border border-line rounded-xl shadow-lg shadow-black/5 p-3.5 z-20 animate-[slideUp_0.15s_ease-out]"
        >
          <p className="text-xs font-semibold text-primary mb-1">{copy.timeline}</p>
          <p className="text-xs text-secondary leading-relaxed">{copy.note}</p>
        </div>
      )}
    </div>
  );
}
