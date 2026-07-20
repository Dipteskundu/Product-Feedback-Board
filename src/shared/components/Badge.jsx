import { COLORS } from '../constants/tokens';

const colorMap = {
  bug: { bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-bug', dot: 'bg-bug' },
  feature: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-feature', dot: 'bg-feature' },
  improvement: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-improvement', dot: 'bg-improvement' },
  accent: { bg: 'bg-accent-light', text: 'text-accent', dot: 'bg-accent' },
  open: { bg: 'bg-gray-100 dark:bg-white/5', text: 'text-status-open', dot: 'bg-status-open' },
  review: { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-status-review', dot: 'bg-status-review' },
  planned: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-status-planned', dot: 'bg-status-planned' },
  progress: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-status-progress', dot: 'bg-status-progress' },
  completed: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-status-completed', dot: 'bg-status-completed' },
  rejected: { bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-status-rejected', dot: 'bg-status-rejected' },
};

function Badge({ children, color = 'accent', dot = false, className = '' }) {
  const colors = colorMap[color] || colorMap.accent;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1
        rounded-full
        text-xs font-medium
        ${colors.bg} ${colors.text}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      )}
      {children}
    </span>
  );
}

export default Badge;
