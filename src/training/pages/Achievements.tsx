import { useAuth } from '../../contexts/AuthContext';
import { useInternTrack } from '../hooks/useInternTrack';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { MOCK_ACHIEVEMENTS, MOCK_LEADERBOARD_POSITION } from '../mock/achievements';
import { LEVEL_THRESHOLDS } from '../mock/progress';
import SkeletonBlock from '../components/SkeletonBlock';
import { Award, Hash, Medal, Trophy } from '../../components/Icons';

export default function Achievements() {
  const { user } = useAuth();
  const { track, loading } = useInternTrack(user?.id);
  const progress = useTrainingProgress(user?.id, track ?? { forte: 'General', trackName: '', description: '', stages: [] });

  if (loading || !track) return <SkeletonBlock className="h-96" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Achievements</h1>
        <p className="text-sm text-secondary mt-1">Badges, levels, and milestones from your training.</p>
      </div>

      {/* Level */}
      <div className="bg-surface border border-line rounded-xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary">Level {progress.progress.level}</p>
          <p className="text-xs text-secondary">{progress.progress.xp} XP · next level at {LEVEL_THRESHOLDS[progress.progress.level] ?? 'max'} XP</p>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-secondary" />
          Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOCK_ACHIEVEMENTS.map(a => (
            <div
              key={a.id}
              className={`rounded-xl border p-4 text-center ${a.earned ? 'border-accent/40 bg-accent/5' : 'border-line opacity-50'}`}
            >
              <Medal className={`w-5 h-5 mx-auto mb-2 ${a.earned ? 'text-accent' : 'text-secondary'}`} />
              <p className="text-xs font-medium text-primary">{a.title}</p>
              <p className="text-[11px] text-secondary mt-1">{a.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <h2 className="text-sm font-semibold text-primary mb-2">Certificates</h2>
        <p className="text-sm text-secondary">Issued once your track's Graduation stage is complete.</p>
      </div>

      {/* Leaderboard position */}
      <div className="bg-surface border border-line rounded-xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-surface-alt flex items-center justify-center shrink-0">
          <Hash className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">
            {MOCK_LEADERBOARD_POSITION.position ? `#${MOCK_LEADERBOARD_POSITION.position} of ${MOCK_LEADERBOARD_POSITION.cohortSize}` : 'Not ranked yet'}
          </p>
          <p className="text-xs text-secondary">Leaderboard position</p>
        </div>
      </div>
    </div>
  );
}
