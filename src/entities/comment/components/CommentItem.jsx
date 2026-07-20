function CommentItem({ comment, onReply, onDelete, currentUserId }) {
  const actorName = comment.actorId?.name || 'Unknown';
  const actorInitial = actorName.charAt(0).toUpperCase();
  const commentUserId = comment.actorId?._id?.toString() || comment.actorId?.toString();
  const isOwner = currentUserId && commentUserId === currentUserId;

  return (
    <div className="py-4 border-b border-border last:border-0">
      <div className="flex gap-3 items-start">
        <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center text-[10px] font-mono font-semibold text-accent shrink-0">
          {actorInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-ink">
              {actorName}
            </span>
            <span className="text-xs text-ink-muted font-mono">
              {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {isOwner && onDelete && (
              <button
                onClick={() => onDelete(comment._id)}
                className="ml-auto p-1 rounded text-ink-muted hover:text-bug hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Delete comment"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm text-ink leading-relaxed m-0">
            {comment.body}
          </p>
          {onReply && (
            <button
              onClick={() => onReply(comment._id)}
              className="text-xs font-medium text-accent hover:text-accent-hover mt-2 transition-colors"
            >
              Reply
            </button>
          )}
        </div>
      </div>
      {comment.replies?.length > 0 && (
        <div className="ml-10 mt-2 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
