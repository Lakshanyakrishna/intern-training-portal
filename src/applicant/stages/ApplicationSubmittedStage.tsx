import { useState } from 'react';
import { CheckCircle } from '../../components/Icons';
import type { ApplicationSummary } from '../types';

export default function ApplicationSubmittedStage({
  application,
  onEditApplication,
  onWithdrawApplication,
  isLive,
}: {
  application: ApplicationSummary;
  onEditApplication: (newWhyJoin: string) => void;
  onWithdrawApplication: () => void;
  isLive?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
  const [lowDays, highDays] = application.estimatedReviewDays;

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-1">Sit tight</h2>
      <p className="text-sm text-secondary mb-6">Your application is in — here's what we've got on file.</p>

      <div className="rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.03] p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center shrink-0 text-accent">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">Application received</p>
            <p className="text-sm text-secondary mt-0.5">{application.opportunityTitle}</p>
            <p className="text-xs text-secondary mt-1">
              Submitted {new Date(application.submittedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              {' · '}Estimated review: {lowDays}–{highDays} days
            </p>
          </div>
        </div>

        {editing ? (
          <div className="mt-4 pt-4 border-t border-line">
            <label className="block text-xs font-medium text-secondary mb-1.5">Why do you want to join this program?</label>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              placeholder="Update your motivation..."
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-secondary hover:bg-surface-alt transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { onEditApplication(draft); setEditing(false); }}
                className="px-3 py-1.5 rounded-lg bg-accent text-accent-text text-xs font-medium hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Save changes
              </button>
            </div>
          </div>
        ) : confirmingWithdraw ? (
          <div className="mt-4 pt-4 border-t border-line">
            <p className="text-sm text-primary mb-3">Withdraw this application? This can't be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingWithdraw(false)}
                className="px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-secondary hover:bg-surface-alt transition-colors"
              >
                Keep application
              </button>
              <button
                onClick={onWithdrawApplication}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Withdraw
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mt-4 pt-4 border-t border-line">
            {!isLive && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Edit Application
                </button>
                <span className="text-line">·</span>
              </>
            )}
            <button
              onClick={() => setConfirmingWithdraw(true)}
              className="text-xs font-medium text-secondary hover:text-red-500 transition-colors"
            >
              Withdraw Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
