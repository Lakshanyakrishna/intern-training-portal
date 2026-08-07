import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { findSubmission } from '../config/types';
import SkeletonBlock from '../components/SkeletonBlock';
import { ArrowLeft, CheckCircle, FileText, Globe, Upload } from '../../components/Icons';

const STATUS_STEPS = ['pending', 'submitted', 'reviewed', 'approved'] as const;
const STATUS_LABELS: Record<(typeof STATUS_STEPS)[number], string> = {
  pending: 'Pending',
  submitted: 'Submitted',
  reviewed: 'Reviewed',
  approved: 'Approved',
};

export default function Assignments() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });
  const [link, setLink] = useState('');

  if (loading || !track) return <SkeletonBlock className="h-96" />;

  const found = submissionId ? findSubmission(track, submissionId) : undefined;
  if (!found) return <Navigate to="/training/path" replace />;
  const { module, submission } = found;
  const mp = progress.getModuleProgress(module.id);
  const status = mp.submissionStatus ?? 'pending';
  const currentStepIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/training/module/${module.id}`} className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {module.title}
      </Link>

      <div className="animate-[slideUp_0.35s_ease-out]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1.5">Assignment</p>
        <h1 className="text-2xl font-bold text-primary">{submission.title}</h1>
        {submission.instructions && <p className="text-sm text-secondary mt-2">{submission.instructions}</p>}
      </div>

      {/* Status pipeline */}
      <div className="flex items-center gap-2 animate-[slideUp_0.35s_ease-out_0.05s_both]">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${i <= currentStepIndex ? 'bg-accent' : 'bg-surface-alt'}`} />
            {i < STATUS_STEPS.length - 1 && <span className="sr-only">then</span>}
          </div>
        ))}
      </div>
      <p className="text-xs font-medium text-secondary -mt-4">{STATUS_LABELS[status]}</p>

      {/* Resources */}
      <div className="bg-surface border border-line rounded-xl p-5 animate-[slideUp_0.35s_ease-out_0.1s_both]">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-2 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" />
          Resources
        </h2>
        <p className="text-sm text-secondary">Reference materials for this assignment will be listed here.</p>
      </div>

      {/* Submission form */}
      <div className="bg-surface border border-line rounded-xl p-5 space-y-3 animate-[slideUp_0.35s_ease-out_0.15s_both]">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Your Submission</h2>
        {submission.requiresLink && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-secondary shrink-0" />
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://github.com/you/your-pr"
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>
        )}
        {submission.requiresFile && (
          <button className="w-full flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-line text-sm text-secondary hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
            <Upload className="w-4 h-4" />
            [Placeholder] File upload
          </button>
        )}
        <button
          onClick={() => progress.setSubmissionStatus(module.id, 'submitted')}
          disabled={status !== 'pending'}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-text text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <CheckCircle className="w-4 h-4" />
          {status === 'pending' ? 'Submit' : 'Submitted'}
        </button>
      </div>

      {/* Mentor feedback */}
      <div className="bg-surface border border-line rounded-xl p-5 animate-[slideUp_0.35s_ease-out_0.2s_both]">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-2">Mentor Feedback</h2>
        <p className="text-sm text-secondary">No feedback yet — your mentor will leave comments here after reviewing.</p>
      </div>
    </div>
  );
}
