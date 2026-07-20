import { COLORS } from '../../../shared/constants/tokens';
import CommentItem from './CommentItem';

function CommentList({ comments = [], onReply, onDelete, currentUserId }) {
  if (comments.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: COLORS.inkMuted, fontSize: 14 }}>
        No comments yet. Start the discussion!
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onReply={onReply}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

export default CommentList;
