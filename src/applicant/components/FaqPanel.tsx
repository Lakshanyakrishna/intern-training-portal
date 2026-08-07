import { useState } from 'react';
import { ChevronDown } from '../../components/Icons';

// Answers reflect what's actually true in this app -- e.g. "we schedule
// for you" matches the real admin-driven interview flow (no self-serve
// booking exists), and "can't edit, only withdraw" matches the real gating
// in ApplicationSubmittedStage. Shared between the Help panel and the
// interview-prep screen rather than duplicated content in two places.
const FAQS = [
  {
    q: 'How long does it take to hear back after I apply?',
    a: "Most applications are reviewed within 1–3 business days. You'll get an email and a notification the moment there's an update.",
  },
  {
    q: 'Can I edit my application after submitting it?',
    a: "Not yet — once submitted, an application can't be edited. If something's wrong, withdraw it and reapply with corrected details.",
  },
  {
    q: 'Can I withdraw my application?',
    a: "Yes, anytime before a final decision. It can't be undone, but you're welcome to apply again afterward.",
  },
  {
    q: 'How will I know if I’m shortlisted?',
    a: "You'll get an email and an in-app notification, and this dashboard updates automatically.",
  },
  {
    q: 'Who schedules the interview?',
    a: "Our team schedules interviews directly and will reach out with available times — there's no need to book a slot yourself.",
  },
  {
    q: "What happens if I'm not selected?",
    a: "That's specific to the opportunity you applied for, not a verdict on you. You're welcome to apply again for future openings.",
  },
];

export default function FaqPanel() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-1">Frequently asked questions</h3>
      <p className="text-xs text-secondary mb-4">Common questions about the application process.</p>
      <div className="space-y-1">
        {FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q} className="border-b border-line last:border-b-0">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              >
                <span className="text-sm font-medium text-primary">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-secondary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <p className="text-sm text-secondary leading-relaxed pb-3.5">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
