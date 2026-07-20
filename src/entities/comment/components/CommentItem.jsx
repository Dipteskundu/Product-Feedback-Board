function CommentItem({ comment, onReply }) {
  return (
    <div className="py-4 border-b border-border last:border-0">
      <div className="flex gap-3 items-start">
        <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center text-[10px] font-mono font-semibold text-accent shrink-0">
          {comment.actorId?.toString().slice(-2).toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-ink">
              User {comment.actorId?.toString().slice(-2).toUpperCase() || '?'}
            </span>
            <span className="text-xs text-ink-muted font-mono">
              {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
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
            <CommentItem key={reply._id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
