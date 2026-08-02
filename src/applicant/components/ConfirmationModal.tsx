import { useEffect } from 'react';

// Reusable confirmation modal -- used by the interview scheduler today;
// generic enough for any "are you sure" moment added later.
export default function ConfirmationModal({
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="absolute inset-0 bg-black/40 animate-[fadeIn_0.15s_ease-out]" onClick={onClose} />
      <div className="relative bg-surface border border-line rounded-2xl p-6 max-w-sm w-full shadow-xl animate-[slideUp_0.2s_ease-out]">
        <h3 id="confirm-modal-title" className="text-base font-semibold text-primary mb-1.5">{title}</h3>
        <p className="text-sm text-secondary mb-5">{description}</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-line text-sm font-medium text-secondary hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-accent text-accent-text text-sm font-medium hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
