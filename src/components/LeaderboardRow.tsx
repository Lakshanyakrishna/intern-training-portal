interface LeaderboardRowProps {
  rank: number;
  name: string;
  xp: number;
  level: number;
  challenges: number;
  isCurrentUser?: boolean;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const rankColors = ['bg-yellow-400', 'bg-gray-300', 'bg-orange-400'];
const circleColors = ['bg-neutral-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500'];

export default function LeaderboardRow({ rank, name, xp, level, challenges, isCurrentUser }: LeaderboardRowProps) {
  const initials = getInitials(name);
  const circleColor = circleColors[rank % circleColors.length];

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
      isCurrentUser
        ? 'bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800'
        : 'bg-surface border border-transparent'
    }`}>
      <div className="flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold">
        {rank <= 3 ? (
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${rankColors[rank - 1]}`}>
            {rank}
          </span>
        ) : (
          <span className="text-secondary text-sm font-medium">{rank}</span>
        )}
      </div>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${circleColor}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-neutral-800 dark:text-neutral-200' : 'text-primary'}`}>
          {name}
          {isCurrentUser && <span className="ml-1.5 text-[10px] text-accent">(you)</span>}
        </p>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-secondary font-medium tabular-nums">{xp.toLocaleString()} XP</span>
        <span className="text-secondary tabular-nums">Lv.{level}</span>
        <span className="text-secondary tabular-nums">{challenges}</span>
      </div>
    </div>
  );
}
