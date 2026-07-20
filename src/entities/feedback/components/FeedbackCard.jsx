import CategoryBadge from './CategoryBadge';
import PriorityDots from './PriorityDots';

function FeedbackCard({ feedback, renderActions, animationIndex = 0, onClick }) {
  const staggerMs = Math.min(animationIndex * 80, 400);

  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-xl p-5 flex items-start gap-4
        hover:border-accent/40 hover:shadow-card-hover
        transition-[border-color,box-shadow,transform,colors] duration-200 ease-out
        cursor-pointer group"
    >
      {/* Vote Rail */}
      {renderActions && (
        <div className="vote-rail shrink-0">
          {renderActions(feedback)}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <CategoryBadge category={feedback.category} />
          <PriorityDots priority={feedback.priority} />
        </div>

        <h3 className="text-base font-heading font-bold text-ink mb-1 group-hover:text-accent transition-colors truncate">
          {feedback.title}
        </h3>

        <p className="text-sm text-ink-muted line-clamp-2 mb-3">
          {feedback.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center text-[10px] font-mono font-semibold text-accent">
              {feedback.createdByActorId?.toString().slice(-2).toUpperCase() || '?'}
            </div>
          </div>
          <span className="font-mono">
            {new Date(feedback.updatedAt || feedback.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Comment Count */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <svg className="w-4 h-4 text-ink-muted/50 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-sm font-semibold font-mono text-ink-muted group-hover:text-accent transition-colors">
          {feedback.commentCount}
        </span>
      </div>
    </div>
  );
}

export default FeedbackCard;
