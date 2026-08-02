import { useState } from 'react';
import { Calendar } from '../../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';
import type { InterviewSlot } from '../types';

export default function InterviewSchedulingStage({
  slotGroups,
  onConfirmSlot,
}: {
  slotGroups: { day: string; date: string; slots: InterviewSlot[] }[];
  onConfirmSlot: (slotId: string) => void;
}) {
  const [selected, setSelected] = useState<InterviewSlot | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-secondary mb-1">Current mission</p>
      <h2 className="text-xl font-semibold text-primary mb-1">Choose your interview slot</h2>
      <p className="text-sm text-secondary mb-6">You've been shortlisted — pick a time that works for you.</p>

      <div className="rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.03] p-5 space-y-5">
        {slotGroups.map(group => (
          <div key={group.day}>
            <div className="flex items-center gap-2 mb-2.5">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-primary">{group.day}</span>
              <span className="text-xs text-secondary">{group.date}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.slots.map(slot => {
                const isSelected = selected?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelected(slot)}
                    className={`px-3.5 py-2 min-h-[44px] rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                      isSelected ? 'bg-accent text-accent-text border-accent shadow-sm' : 'border-line text-primary hover:bg-surface-alt'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
          <p className="text-xs text-secondary">
            {selected ? `Selected: ${selected.day} · ${selected.time}` : 'Select a slot above to continue'}
          </p>
          <button
            disabled={!selected}
            onClick={() => setConfirmOpen(true)}
            className="px-4 py-2 rounded-lg bg-accent text-accent-text text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Confirm slot
          </button>
        </div>
      </div>

      {confirmOpen && selected && (
        <ConfirmationModal
          title="Confirm interview slot"
          description={`You're booking ${selected.day}, ${selected.date} at ${selected.time}. You can reschedule later if needed.`}
          confirmLabel="Confirm"
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => { onConfirmSlot(selected.id); setConfirmOpen(false); }}
        />
      )}
    </div>
  );
}
