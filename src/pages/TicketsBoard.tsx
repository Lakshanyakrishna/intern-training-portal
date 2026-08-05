import { useState } from 'react';
import { modules } from '../data/modules';
import { useProgress } from '../hooks/useProgress';

interface Ticket {
  id: string;
  key: string;
  title: string;
  moduleTitle: string;
  moduleId: string;
  difficulty: string;
  done: boolean;
}

export default function TicketsBoard() {
  const { progress, completeChallenge } = useProgress();
  const [filter, setFilter] = useState<string>('all');

  const tickets: Ticket[] = modules.flatMap(m =>
    m.challenges.map((ch, i) => ({
      id: ch.id,
      key: `TASK-${m.id.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(2, '0')}`,
      title: ch.title,
      moduleTitle: m.title,
      moduleId: m.id,
      difficulty: ch.difficulty,
      done: (progress.moduleProgress[m.id]?.challenges || []).includes(ch.id),
    }))
  );

  const filtered = filter === 'all' ? tickets : tickets.filter(t => filter === 'done' ? t.done : !t.done);

  const difficultyColor: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Task Board</h1>
          <p className="text-sm text-secondary mt-1">Real-world engineering tasks. Complete them to build your skills.</p>
        </div>
        <span className="text-sm text-secondary">{tickets.filter(t => t.done).length}/{tickets.length} done</span>
      </div>

      <div className="flex gap-2">
        {['all', 'open', 'done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-accent text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f === 'all' ? 'All Tasks' : f === 'open' ? 'Open' : 'Completed'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(ticket => (
          <div
            key={ticket.id}
            className={`bg-surface border border-line rounded-xl p-4 transition-colors ${
              ticket.done ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                ticket.done
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-line'
              }`}
                onClick={() => !ticket.done && completeChallenge(ticket.moduleId, ticket.id)}
              >
                {ticket.done && <span className="text-xs">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{ticket.key}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyColor[ticket.difficulty] || ''}`}>
                    {ticket.difficulty}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{ticket.moduleTitle}</span>
                </div>
                <h3 className={`text-sm font-medium mt-1 ${ticket.done ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-primary'}`}>
                  {ticket.title}
                </h3>
              </div>
              {!ticket.done && (
                <button
                  onClick={() => completeChallenge(ticket.moduleId, ticket.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors shrink-0"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No tasks found.</div>
        )}
      </div>
    </div>
  );
}
