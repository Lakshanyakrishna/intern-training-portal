import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getMentorAssignments, getInternshipOutcome,
  updateMentorAssignmentCompletion, upsertInternshipOutcome,
  getProjectAllocationByIntern,
} from '../lib/db';
import { generateTrainingCertificate, generateInternshipCertificate } from '../lib/certificates';
import type { DbMentorAssignment } from '../lib/db';

export default function MentorCompletionReview() {
  const { user } = useAuth();
  const [mentees, setMentees] = useState<DbMentorAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  async function fetchMentees() {
    if (!user) return;
    try {
      const all = await getMentorAssignments();
      setMentees(all.filter(m => m.mentorId === user.id && m.status === 'active'));
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMentees(); }, [user]);

  async function handleCompletion(mInternId: string, decision: 'approved' | 'additional_work' | 'rejected') {
    if (!user) return;
    setActionMsg('Updating...');
    try {
      await updateMentorAssignmentCompletion(mInternId, { completionStatus: decision });
      if (decision === 'approved') {
        const outcome = await getInternshipOutcome(mInternId);
        const project = await getProjectAllocationByIntern(mInternId);
        await upsertInternshipOutcome(mInternId, {
          mentorApproved: true,
          projectCompleted: project ? project.status === 'completed' : false,
          readinessScore: outcome?.readinessScore,
        });
        setActionMsg('Internship completion approved! Certificate will be issued.');
      } else if (decision === 'additional_work') {
        setActionMsg('Additional work requested.');
      } else {
        setActionMsg('Completion rejected.');
      }
      await fetchMentees();
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : 'Action failed');
    }
  }

  async function handleIssueTrainingCert(mInternId: string) {
    setActionMsg('Issuing training certificate...');
    try {
      const cert = await generateTrainingCertificate(mInternId);
      setActionMsg(`Training certificate issued: ${cert}`);
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : 'Failed to issue certificate');
    }
  }

  async function handleIssueInternshipCert(mInternId: string) {
    if (!user) return;
    setActionMsg('Issuing internship certificate...');
    try {
      const project = await getProjectAllocationByIntern(mInternId);
      const cert = await generateInternshipCertificate(
        mInternId, undefined, project?.id, user.id
      );
      setActionMsg(`Internship certificate issued: ${cert}`);
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : 'Failed to issue certificate');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Completion Review</h1>
        <p className="text-sm text-secondary mt-1">Review and approve intern completion status.</p>
      </div>

      {actionMsg && (
        <div className="bg-surface-alt border border-line rounded-lg px-4 py-3 text-sm text-primary">
          {actionMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : mentees.length === 0 ? (
        <div className="bg-surface border border-line rounded-xl p-8 text-center">
          <p className="text-sm text-secondary">No active mentees assigned.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mentees.map(mentee => (
            <div
              key={mentee.id}
              className="bg-surface border border-line rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-primary">{mentee.internName || 'Intern'}</h3>
                  <p className="text-xs text-secondary">Assigned {new Date(mentee.assignedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleCompletion(mentee.internId, 'approved')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                >
                  Approve Completion
                </button>
                <button
                  onClick={() => handleCompletion(mentee.internId, 'additional_work')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-colors"
                >
                  Request More Work
                </button>
                <button
                  onClick={() => handleCompletion(mentee.internId, 'rejected')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleIssueTrainingCert(mentee.internId)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-surface-alt transition-colors"
                >
                  Issue Training Cert
                </button>
                <button
                  onClick={() => handleIssueInternshipCert(mentee.internId)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-surface-alt transition-colors"
                >
                  Issue Internship Cert
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
