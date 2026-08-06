import { ChevronRight } from 'lucide-react';

export default function ComingSoonLink({ label }: { label: string }) {
  const handleClick = () => alert(`${label} — coming soon.`);
  return (
    <button
      onClick={handleClick}
      className="text-sm text-[#F1F2EE] hover:text-[#C6CAC9] flex items-center gap-1 transition-colors"
    >
      {label} <ChevronRight className="w-4 h-4" />
    </button>
  );
}
