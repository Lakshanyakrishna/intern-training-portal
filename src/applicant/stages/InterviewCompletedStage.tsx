import { CheckCircle } from '../../components/Icons';

export default function InterviewCompletedStage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-1">Thanks for the conversation</h2>
      <p className="text-sm text-secondary mb-6">Your mentor is reviewing next steps.</p>

      <div className="rounded-2xl border border-line bg-surface shadow-sm shadow-black/[0.03] p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center shrink-0 text-accent">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Interview completed</p>
            <p className="text-sm text-secondary mt-1">
              [Placeholder] Decisions are typically shared within a few business days of your interview.
            </p>
          </div>
        </div>
        <p className="text-xs text-secondary mt-4 pt-4 border-t border-line">
          Check the activity feed below for the latest update — you'll also be notified the moment there's news.
        </p>
      </div>
    </div>
  );
}
