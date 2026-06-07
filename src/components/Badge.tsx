import { Medal } from './Icons';

interface BadgeProps {
  name: string;
  description: string;
  earned: boolean;
}

export default function Badge({ name, description, earned }: BadgeProps) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
      earned
        ? 'bg-gradient-to-b from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-300 dark:border-yellow-600 shadow-sm'
        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50 grayscale'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
        earned ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
      }`}>
        <Medal className="w-4 h-4" />
      </div>
      <span className={`text-xs font-semibold text-center ${earned ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-500 dark:text-gray-400'}`}>{name}</span>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-0.5">{description}</span>
    </div>
  );
}
