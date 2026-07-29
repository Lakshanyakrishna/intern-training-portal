import { useState, useEffect } from 'react';
import { assignMentor, getMentorAssignments, getAllUsers } from '../lib/db';
import { notifyEvent } from '../lib/notifications';
import type { AuthUser } from '../types';

export default function AdminMentors() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [assignments, setAssignments] = useState<Awaited<ReturnType<typeof getMentorAssignments>>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [allUsers, allAssignments] = await Promise.all([getAllUsers(), getMentorAssignments()]);
      setUsers(allUsers);
      setAssignments(allAssignments);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedIntern || !selectedMentor) return;
    try {
      await assignMentor(selectedIntern, selectedMentor);
      const internName = users.find(u => u.id === selectedIntern)?.name || 'Intern';
      const mentorName = users.find(u => u.id === selectedMentor)?.name || 'Mentor';
      notifyEvent('mentor_alert', selectedMentor, {
        name: mentorName,
        mentee_name: internName,
      }).catch(() => {});
      setMessage({ type: 'success', text: `Assigned ${internName} to mentor ${mentorName}` });
      setSelectedIntern('');
      setSelectedMentor('');
      await refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Assignment failed.' });
    }
  }

  const interns = users.filter(u => u.role === 'intern');
  const mentors = users.filter(u => u.role === 'mentor' || u.role === 'admin');
  const assignedInternIds = new Set(assignments.filter(a => a.status === 'active').map(a => a.internId));
  const unassignedInterns = interns.filter(i => !assignedInternIds.has(i.id));

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mentor Assignments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Assign mentors to interns.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm border ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assign form */}
        <form onSubmit={handleAssign} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">New Assignment</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Intern *</label>
            <select required value={selectedIntern} onChange={e => setSelectedIntern(e.target.value)} className={inputClass}>
              <option value="">Select intern...</option>
              {unassignedInterns.map(i => (
                <option key={i.id} value={i.id}>{i.name} ({i.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mentor *</label>
            <select required value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)} className={inputClass}>
              <option value="">Select mentor...</option>
              {mentors.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Assign Mentor
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            {unassignedInterns.length} unassigned intern{unassignedInterns.length !== 1 ? 's' : ''} available.
          </p>
        </form>

        {/* Current assignments */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Current Assignments</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No assignments yet.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {assignments.map(a => (
                <div key={a.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{a.internName || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mentor: {a.mentorName || 'Unknown'}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    a.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
