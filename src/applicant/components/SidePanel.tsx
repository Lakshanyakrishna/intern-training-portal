import { useEffect, type ReactNode } from 'react';
import { XCircle } from '../../components/Icons';

// Generic slide-over shell used by the quick-access dock (Notifications,
// Activity, Help). Renders whatever's already built for the grid cards --
// no content duplication, just a different container around it.
export default function SidePanel({ open, onClose, children }: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30 animate-[fadeIn_0.15s_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-line shadow-xl shadow-black/10 overflow-y-auto p-5 pt-16 animate-[slideInRight_0.2s_ease-out]"
      >
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="absolute top-3 right-3 z-10 w-11 h-11 rounded-full bg-surface border border-line flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <XCircle className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
