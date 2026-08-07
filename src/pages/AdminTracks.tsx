import { useState, useEffect, useCallback } from 'react';
import {
  getTrainingTracks, createTrainingTrack, deleteTrainingTrack, OPPORTUNITY_FORTES,
  getTrainingModules, createTrainingModule, deleteTrainingModule,
} from '../lib/db';
import type { DbTrainingTrack, OpportunityForte, DbTrainingModule } from '../lib/db';
import { Plus, Trash2 } from '../components/Icons';

export default function AdminTracks() {
  const [tracks, setTracks] = useState<DbTrainingTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fortes, setFortes] = useState<OpportunityForte[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [modules, setModules] = useState<DbTrainingModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleMinutes, setModuleMinutes] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      setTracks(await getTrainingTracks());
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const refreshModules = useCallback(async (trackId: string) => {
    setModulesLoading(true);
    try {
      setModules(await getTrainingModules(trackId));
    } catch { /* ignore */ } finally {
      setModulesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTrackId) refreshModules(selectedTrackId);
  }, [selectedTrackId, refreshModules]);

  function toggleForte(forte: OpportunityForte) {
    setFortes(prev => prev.includes(forte) ? prev.filter(f => f !== forte) : [...prev, forte]);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createTrainingTrack({ name: name.trim(), description: description.trim() || undefined, sortOrder: tracks.length, fortes });
      setMessage({ type: 'success', text: `Created track "${name.trim()}"` });
      setName('');
      setDescription('');
      setFortes([]);
      await refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create track.' });
    }
  }

  async function handleDelete(track: DbTrainingTrack) {
    try {
      await deleteTrainingTrack(track.id);
      setMessage({ type: 'success', text: `Removed "${track.name}"` });
      if (selectedTrackId === track.id) setSelectedTrackId(null);
      await refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to remove track.' });
    }
  }

  async function handleCreateModule(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTrackId || !moduleTitle.trim()) return;
    try {
      await createTrainingModule({
        trackId: selectedTrackId,
        title: moduleTitle.trim(),
        description: moduleDescription.trim() || undefined,
        sortOrder: modules.length,
        estimatedMinutes: moduleMinutes.trim() ? Number(moduleMinutes.trim()) : undefined,
      });
      setModuleTitle('');
      setModuleDescription('');
      setModuleMinutes('');
      await refreshModules(selectedTrackId);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to add module.' });
    }
  }

  async function handleDeleteModule(m: DbTrainingModule) {
    try {
      await deleteTrainingModule(m.id);
      if (selectedTrackId) await refreshModules(selectedTrackId);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to remove module.' });
    }
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-colors';
  const selectedTrack = tracks.find(t => t.id === selectedTrackId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Training Tracks</h1>
        <p className="text-sm text-secondary mt-1">
          The catalog interns get assigned to on conversion. Select a track below to add its modules.
        </p>
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
        <form onSubmit={handleCreate} className="bg-surface border border-line rounded-xl p-6 space-y-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">New Track</h2>

          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Frontend Fundamentals" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Optional" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Applies to which fortes</label>
            <div className="flex flex-wrap gap-2">
              {OPPORTUNITY_FORTES.map(forte => (
                <button
                  type="button"
                  key={forte}
                  onClick={() => toggleForte(forte)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    fortes.includes(forte) ? 'bg-accent text-accent-text border-accent' : 'border-line text-secondary hover:bg-surface-alt'
                  }`}
                >
                  {forte}
                </button>
              ))}
            </div>
            <p className="text-xs text-secondary mt-1.5">Optional — leave unselected for a track that applies to everyone.</p>
          </div>

          <button type="submit" className="w-full py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors text-sm">
            Create Track
          </button>
        </form>

        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-line bg-surface-alt">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Catalog</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-8 text-sm text-secondary">
              No tracks yet — the picker in Conversion will stay empty until you add one.
            </div>
          ) : (
            <div className="divide-y divide-line">
              {tracks.map(t => (
                <div
                  key={t.id}
                  className={`w-full flex items-start justify-between gap-3 px-4 py-3 transition-colors ${
                    t.id === selectedTrackId ? 'bg-surface-alt' : 'hover:bg-surface-alt'
                  }`}
                >
                  <button
                    onClick={() => setSelectedTrackId(t.id === selectedTrackId ? null : t.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="text-sm font-medium text-primary">{t.name}</p>
                    {t.description && <p className="text-xs text-secondary mt-0.5">{t.description}</p>}
                    {t.fortes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {t.fortes.map(f => (
                          <span key={f} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-alt text-secondary">{f}</span>
                        ))}
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="text-xs font-medium text-secondary hover:text-red-500 transition-colors shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTrack && (
        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-line bg-surface-alt">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Modules — {selectedTrack.name}</h2>
          </div>

          <form onSubmit={handleCreateModule} className="p-4 border-b border-line grid gap-3 sm:grid-cols-[1fr_1fr_100px_auto]">
            <input
              required
              value={moduleTitle}
              onChange={e => setModuleTitle(e.target.value)}
              placeholder="Module title"
              className={inputClass}
            />
            <input
              value={moduleDescription}
              onChange={e => setModuleDescription(e.target.value)}
              placeholder="Description (optional)"
              className={inputClass}
            />
            <input
              type="number"
              min={0}
              value={moduleMinutes}
              onChange={e => setModuleMinutes(e.target.value)}
              placeholder="Minutes"
              className={inputClass}
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>

          {modulesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-8 text-sm text-secondary">
              No modules yet — interns assigned to this track will see an empty state until you add one.
            </div>
          ) : (
            <div className="divide-y divide-line">
              {modules.map((m, i) => (
                <div key={m.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary">
                      <span className="text-secondary tabular-nums mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                      {m.title}
                    </p>
                    {m.description && <p className="text-xs text-secondary mt-0.5">{m.description}</p>}
                    {m.estimatedMinutes && <p className="text-[11px] text-secondary mt-1">{m.estimatedMinutes} min</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteModule(m)}
                    className="text-secondary hover:text-red-500 transition-colors shrink-0 p-1"
                    title="Remove module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
