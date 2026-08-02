import { HelpCircle, MessageSquare, Send } from '../../components/Icons';

const ACTIONS = [
  { icon: HelpCircle, label: 'FAQ', description: 'Common questions about the process' },
  { icon: MessageSquare, label: 'Contact Mentor', description: 'Placeholder — available once assigned' },
  { icon: Send, label: 'Support Ticket', description: 'Placeholder — raise an issue' },
];

export default function HelpPanel() {
  return (
    <div className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-5">
      <h3 className="text-sm font-semibold text-primary mb-1">Need help?</h3>
      <p className="text-xs text-secondary mb-4">We're here if something's unclear.</p>
      <div className="space-y-1">
        {ACTIONS.map(({ icon: Icon, label, description }) => (
          <button
            key={label}
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
    </div>
  );
}
