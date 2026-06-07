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
const circleColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500'];

export default function LeaderboardRow({ rank, name, xp, level, challenges, isCurrentUser }: LeaderboardRowProps) {
  const initials = getInitials(name);
  const circleColor = circleColors[rank % circleColors.length];

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
      isCurrentUser
        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        : 'bg-white dark:bg-gray-800 border border-transparent'
    }`}>
      <div className="flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold">
        {rank <= 3 ? (
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${rankColors[rank - 1]}`}>
            {rank}
          </span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{rank}</span>
        )}
      </div>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${circleColor}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-blue-800 dark:text-blue-200' : 'text-gray-800 dark:text-white'}`}>
          {name}
          {isCurrentUser && <span className="ml-1.5 text-[10px] text-blue-600 dark:text-blue-400">(you)</span>}
        </p>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-300 font-medium tabular-nums">{xp.toLocaleString()} XP</span>
        <span className="text-gray-500 dark:text-gray-400 tabular-nums">Lv.{level}</span>
        <span className="text-gray-500 dark:text-gray-400 tabular-nums">{challenges}</span>
      </div>
    </div>
  );
}
