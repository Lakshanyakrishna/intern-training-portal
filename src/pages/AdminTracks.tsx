import { useState, useEffect } from 'react';
import { getTrainingTracks, createTrainingTrack, deleteTrainingTrack, OPPORTUNITY_FORTES } from '../lib/db';
import type { DbTrainingTrack, OpportunityForte } from '../lib/db';

export default function AdminTracks() {
  const [tracks, setTracks] = useState<DbTrainingTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fortes, setFortes] = useState<OpportunityForte[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setTracks(await getTrainingTracks());
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

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
      await refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to remove track.' });
    }
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-colors';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Training Tracks</h1>
        <p className="text-sm text-secondary mt-1">
          The catalog interns get assigned to on conversion. Curriculum content isn't built yet — this is the structure it slots into.
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
          <h2 className="text-sm font-semibold text-primary">New Track</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Frontend Fundamentals" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Optional" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Applies to which fortes</label>
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
            <h2 className="text-sm font-semibold text-primary">Catalog</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
              No tracks yet — the picker in Conversion will stay empty until you add one.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {tracks.map(t => (
                <div key={t.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary">{t.name}</p>
                    {t.description && <p className="text-xs text-secondary mt-0.5">{t.description}</p>}
                    {t.fortes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {t.fortes.map(f => (
                          <span key={f} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-alt text-secondary">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
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
    </div>
  );
}
