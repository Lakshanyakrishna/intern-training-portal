import * as lucide from 'lucide-react';
const names = [
  'Bell', 'ChevronDown', 'Bookmark', 'GitCompare', 'Share', 'MapPin', 'DollarSign',
  'Clock', 'Zap', 'CheckCircle2', 'ChevronUp', 'ChevronRight', 'Terminal',
  'Layout', 'Database', 'Smartphone', 'PenTool', 'Brain', 'Search', 'Briefcase',
  'Code', 'Heart', 'MessageSquare', 'Lightbulb', 'Puzzle', 'ShieldCheck', 'Users',
  'Mail', 'Star'
];
names.forEach(name => {
  if (!lucide[name]) console.log('MISSING:', name);
});
