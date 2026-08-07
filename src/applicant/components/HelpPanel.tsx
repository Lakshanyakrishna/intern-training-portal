import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, HelpCircle, MessageSquare, Send } from '../../components/Icons';
import FaqPanel from './FaqPanel';

const ACTIONS = [
  { id: 'faq' as const, icon: HelpCircle, label: 'FAQ', description: 'Common questions about the process' },
  { id: 'mentor' as const, icon: MessageSquare, label: 'Contact Mentor', description: 'Placeholder — available once assigned' },
  { id: 'ticket' as const, icon: Send, label: 'Support Ticket', description: 'Placeholder — raise an issue' },
];

export default function HelpPanel() {
  const [showFaq, setShowFaq] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function handleAction(id: (typeof ACTIONS)[number]['id']) {
    if (id === 'faq') {
      setShowFaq(true);
      return;
    }
    // Contact Mentor / Support Ticket have no real backend yet -- give
    // honest click feedback instead of the button silently doing nothing.
    setToast('Coming soon');
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  }

  if (showFaq) {
    return (
      <div>
        <button
          onClick={() => setShowFaq(false)}
          className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors mb-4 -ml-1 px-1 py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <FaqPanel />
      </div>
    );
  }

  return (
    <div className="relative">
      <h3 className="text-sm font-semibold text-primary mb-1">Need help?</h3>
      <p className="text-xs text-secondary mb-4">We're here if something's unclear.</p>
      <div className="space-y-1">
        {ACTIONS.map(({ id, icon: Icon, label, description }) => (
          <button
            key={label}
            onClick={() => handleAction(id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-alt transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Icon className="w-4 h-4 text-secondary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-primary">{label}</p>
              <p className="text-[11px] text-secondary">{description}</p>
            </div>
          </button>
        ))}
      </div>

      {toast && (
        <div role="status" aria-live="polite" className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-surface border border-line rounded-full px-3.5 py-1.5 shadow-lg shadow-black/10 animate-[slideUp_0.15s_ease-out]">
          <p className="text-xs font-medium text-primary whitespace-nowrap">{toast}</p>
        </div>
      )}
    </div>
  );
}
