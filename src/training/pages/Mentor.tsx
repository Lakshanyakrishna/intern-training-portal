import { useState } from 'react';
import { MOCK_MENTOR, MOCK_ANNOUNCEMENTS, MOCK_MENTOR_FEEDBACK } from '../mock/mentor';
import EmptyState from '../../applicant/components/EmptyState';
import { Calendar, Clock, MessageSquare, Send } from '../../components/Icons';

export default function Mentor() {
  const [toast, setToast] = useState<string | null>(null);

  function handlePlaceholder(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Mentor</h1>
        <p className="text-sm text-secondary mt-1">Your assigned mentor, office hours, and feedback.</p>
      </div>

      <div className="bg-surface border border-line rounded-xl p-5">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-surface-alt flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {MOCK_MENTOR.avatarInitial}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary truncate">{MOCK_MENTOR.name}</p>
            <p className="text-xs text-secondary truncate">{MOCK_MENTOR.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-secondary mt-3">
          <Clock className="w-3.5 h-3.5" />
          Office hours: {MOCK_MENTOR.officeHours}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handlePlaceholder('Help request sent (placeholder)')}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-text text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="w-4 h-4" />
            Request Help
          </button>
          <button
            onClick={() => handlePlaceholder('Booking flow coming soon')}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-line text-sm font-medium text-primary hover:bg-surface-alt transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Book Meeting
          </button>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line bg-surface-alt">
          <h2 className="text-sm font-semibold text-primary">Announcements</h2>
        </div>
        {MOCK_ANNOUNCEMENTS.length === 0 ? (
          <EmptyState icon={<Send className="w-4 h-4" />} title="No announcements yet" />
        ) : (
          <div className="divide-y divide-line">
            {MOCK_ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="px-5 py-4">
                <p className="text-sm font-medium text-primary">{a.title}</p>
                <p className="text-sm text-secondary mt-1">{a.body}</p>
                <p className="text-xs text-secondary mt-2">{new Date(a.postedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line bg-surface-alt">
          <h2 className="text-sm font-semibold text-primary">Recent Feedback</h2>
        </div>
        {MOCK_MENTOR_FEEDBACK.length === 0 ? (
          <EmptyState icon={<MessageSquare className="w-4 h-4" />} title="No feedback yet" description="Feedback from your mentor will show up here." />
        ) : (
          <div className="divide-y divide-line">
            {MOCK_MENTOR_FEEDBACK.map(f => (
              <div key={f.id} className="px-5 py-4">
                {f.moduleTitle && <p className="text-xs font-medium text-accent mb-1">{f.moduleTitle}</p>}
                <p className="text-sm text-primary">{f.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-surface border border-line rounded-full px-4 py-2.5 shadow-lg shadow-black/10 text-sm font-medium text-primary">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
