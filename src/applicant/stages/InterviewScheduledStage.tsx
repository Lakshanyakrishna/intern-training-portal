import { useState } from 'react';
import { Calendar, Video, Users, CheckCircle, Circle, BookOpen, MessageSquare, Zap } from '../../components/Icons';
import type { ScheduledInterview } from '../types';

const CHECKLIST_ITEMS = ['Camera', 'Microphone', 'Internet connection', 'Resume', 'Portfolio', 'GitHub'] as const;

const RESOURCES = [
  { icon: BookOpen, label: 'Interview Guide' },
  { icon: MessageSquare, label: 'FAQs' },
  { icon: Zap, label: 'Tips' },
];

export default function InterviewScheduledStage({
  interview,
  onRescheduleInterview,
  onCancelInterview,
}: {
  interview: ScheduledInterview;
  onRescheduleInterview: () => void;
  onCancelInterview: () => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  function toggle(item: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-secondary mb-1">Current mission</p>
      <h2 className="text-xl font-semibold text-primary mb-1">Prepare for your interview</h2>
      <p className="text-sm text-secondary mb-6">You're all set — here's everything you need.</p>

      <div className="rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.03] p-5">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary shrink-0" />
            <div>
              <p className="text-primary font-medium">{interview.date}</p>
              <p className="text-secondary text-xs">{interview.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-secondary shrink-0" />
            <div>
              <p className="text-primary font-medium">{interview.mentor}</p>
              <p className="text-secondary text-xs">{interview.mentorRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-secondary shrink-0" />
            <p className="text-primary font-medium">{interview.platform}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line">
          <button
            disabled
            title="Available once the interview window opens"
            className="px-4 py-2 rounded-lg bg-accent text-accent-text text-sm font-medium opacity-40 cursor-not-allowed"
          >
            Join Interview
          </button>
          <button className="px-4 py-2 rounded-lg border border-line text-sm font-medium text-primary hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
            Add to Calendar
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.03] p-5 mt-4">
        <h3 className="text-sm font-semibold text-primary mb-3">Preparation checklist</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {CHECKLIST_ITEMS.map(item => {
            const done = checked.has(item);
            return (
              <button
                key={item}
                onClick={() => toggle(item)}
                className="flex items-center gap-2 text-left text-sm py-2.5 -mx-1 px-1 rounded-lg hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
              >
                {done ? <CheckCircle className="w-4 h-4 text-accent shrink-0" /> : <Circle className="w-4 h-4 text-secondary shrink-0" />}
                <span className={done ? 'text-primary' : 'text-secondary'}>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.03] p-5 mt-4">
        <h3 className="text-sm font-semibold text-primary mb-3">Preparation resources</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {RESOURCES.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-line text-sm text-primary hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <Icon className="w-4 h-4 text-secondary shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button onClick={onRescheduleInterview} className="text-xs font-medium text-accent hover:underline">
          Reschedule
        </button>
        <span className="text-line">·</span>
        {confirmingCancel ? (
          <span className="flex items-center gap-2 text-xs">
            <span className="text-secondary">Cancel this interview?</span>
            <button onClick={() => setConfirmingCancel(false)} className="font-medium text-secondary hover:text-primary">No</button>
            <button onClick={onCancelInterview} className="font-medium text-red-500 hover:text-red-600">Yes, cancel</button>
          </span>
        ) : (
          <button onClick={() => setConfirmingCancel(true)} className="text-xs font-medium text-secondary hover:text-red-500 transition-colors">
            Cancel Interview
          </button>
        )}
      </div>
    </div>
  );
}
