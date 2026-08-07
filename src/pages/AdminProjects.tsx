import { useState, useEffect } from 'react';
import { createProjectAllocation, getProjectAllocations, getAllUsers, updateProjectAllocation, updateProjectAllocationExtended } from '../lib/db';
import { notifyEvent } from '../lib/notifications';
import type { DbProjectAllocation } from '../lib/db';

const STATUS_OPTIONS: DbProjectAllocation['status'][] = ['allocated', 'in-progress', 'completed'];

export default function AdminProjects() {
  const [allocations, setAllocations] = useState<DbProjectAllocation[]>([]);
  const [mentees, setMentees] = useState<{ internId: string; internName?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    internId: '',
    projectName: '',
    clientName: '',
    role: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  async function refresh() {
    setLoading(true);
    try {
      const [allocs, allUsers] = await Promise.all([getProjectAllocations(), getAllUsers()]);
      setAllocations(allocs);
      const interns = allUsers.filter(u => u.role === 'intern');
      const allocatedIds = new Set(allocs.map(a => a.internId));
      setMentees(interns.filter(i => !allocatedIds.has(i.id)).map(i => ({ internId: i.id, internName: i.name })));
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      await createProjectAllocation({
        internId: form.internId,
        projectName: form.projectName,
        clientName: form.clientName,
        role: form.role,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        notes: form.notes || undefined,
      });
      notifyEvent('project_assigned', form.internId, {
        name: mentees.find(m => m.internId === form.internId)?.internName || 'Intern',
        project_name: form.projectName,
        client_name: form.clientName,
        start_date: form.startDate,
      }).catch(() => {});
      setMessage({ type: 'success', text: 'Project allocated successfully.' });
      setShowForm(false);
      setForm({ internId: '', projectName: '', clientName: '', role: '', startDate: '', endDate: '', notes: '' });
      await refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Allocation failed.' });
    }
  }

  async function handleStatusChange(id: string, status: DbProjectAllocation['status']) {
    try {
      const alloc = allocations.find(a => a.id === id);
      await updateProjectAllocation(id, { status });
      if (status === 'completed' && alloc) {
        notifyEvent('project_completed', alloc.internId, {
          name: alloc.internName || 'Intern',
          project_name: alloc.projectName,
          client_name: alloc.clientName,
          start_date: alloc.startDate,
        }).catch(() => {});
      }
      await refresh();
    } catch { /* ignore */ }
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent transition-colors';
  const labelClass = 'block text-sm font-medium text-primary mb-1.5';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Project Allocation</h1>
          <p className="text-sm text-secondary mt-1">Assign interns to client projects.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
        >
          {showForm ? 'Cancel' : 'Allocate Project'}
        </button>
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

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-xl p-6 max-w-xl space-y-5">
          <h2 className="text-sm font-semibold text-primary">New Project Allocation</h2>

          <div>
            <label className={labelClass}>Intern *</label>
            <select required value={form.internId} onChange={e => setForm(p => ({ ...p, internId: e.target.value }))} className={inputClass}>
              <option value="">Select intern...</option>
              {mentees.map(m => (
                <option key={m.internId} value={m.internId}>{m.internName || 'Unknown'}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Project Name *</label>
              <input required value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} className={inputClass} placeholder="E.g. Payroll System" />
            </div>
            <div>
              <label className={labelClass}>Client Name *</label>
              <input required value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} className={inputClass} placeholder="E.g. Acme Corp" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Role *</label>
              <input required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={inputClass} placeholder="Frontend Dev" />
            </div>
            <div>
              <label className={labelClass}>Start Date *</label>
              <input required type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} className={inputClass} placeholder="Additional allocation details..." />
          </div>

          <button type="submit" className="w-full py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors text-sm">
            Allocate
          </button>
        </form>
      )}

      {/* Allocations table */}
      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-line bg-surface-alt flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Allocations</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : allocations.length === 0 ? (
          <div className="text-center py-12 text-sm text-secondary">No project allocations yet.</div>
        ) : (
          <div className="divide-y divide-line">
            {allocations.map(a => (
              <details key={a.id} className="group">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-alt/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-primary">{a.internName || 'Unknown'}</p>
                      <span className="text-xs text-secondary">{a.role}</span>
                    </div>
                    <p className="text-xs text-secondary mt-0.5">
                      {a.projectName} — {a.clientName}
                      {' \u2022 '}Started {new Date(a.startDate).toLocaleDateString()}
                      {a.endDate && ` \u2022 Ends ${new Date(a.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <select
                    value={a.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => handleStatusChange(a.id, e.target.value as DbProjectAllocation['status'])}
                    className="text-xs px-2 py-1.5 rounded-lg border border-line bg-surface text-primary"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </summary>
                <ProjectOutcomeForm allocationId={a.id} internId={a.internId} />
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectOutcomeForm({ allocationId, internId }: { allocationId: string; internId: string }) {
  const [outcome, setOutcome] = useState<string>('');
  const [skillsStr, setSkillsStr] = useState('');
  const [mentorNotes, setMentorNotes] = useState('');
  const [lessons, setLessons] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProjectAllocationExtended(allocationId, {
        outcome: outcome as 'successful' | 'partially_successful' | 'unsuccessful' | undefined,
        skillsDemonstrated: skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : [],
        mentorNotes: mentorNotes || undefined,
        lessonsLearned: lessons || undefined,
        completedDate: completedDate || undefined,
      });
      if (outcome === 'successful') {
        notifyEvent('project_completed', internId, {
          name: 'Intern',
          project_name: '',
        }).catch(() => {});
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-line bg-surface text-sm text-primary';
  const labelClass = 'block text-xs font-medium text-secondary mb-1';

  return (
    <div className="px-6 py-4 bg-surface-alt border-t border-line space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Outcome</label>
          <select value={outcome} onChange={e => setOutcome(e.target.value)} className={inputClass}>
            <option value="">Select outcome...</option>
            <option value="successful">Successful</option>
            <option value="partially_successful">Partially Successful</option>
            <option value="unsuccessful">Unsuccessful</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Completed Date</label>
          <input type="date" value={completedDate} onChange={e => setCompletedDate(e.target.value)} className={inputClass} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Skills Demonstrated (comma-separated)</label>
          <input type="text" value={skillsStr} onChange={e => setSkillsStr(e.target.value)} className={inputClass} placeholder="React, Node.js, TypeScript" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Mentor Notes</label>
          <textarea value={mentorNotes} onChange={e => setMentorNotes(e.target.value)} rows={2} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Lessons Learned</label>
          <textarea value={lessons} onChange={e => setLessons(e.target.value)} rows={2} className={inputClass} />
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Outcome'}
      </button>
    </div>
  );
}
