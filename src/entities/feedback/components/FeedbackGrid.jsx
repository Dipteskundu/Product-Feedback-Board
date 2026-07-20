import { COLORS } from '../../../shared/constants/tokens';
import FeedbackCard from './FeedbackCard';

function FeedbackGrid({ feedbackList = [], renderActions, onCardClick }) {
  if (feedbackList.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 48,
          color: COLORS.inkMuted,
        }}
      >
        No feedback yet. Be the first to submit one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {feedbackList.map((item, index) => (
        <FeedbackCard
          key={item._id}
          feedback={item}
          renderActions={renderActions}
          animationIndex={index}
          onClick={() => onCardClick?.(item)}
        />
      ))}
    </div>
  );
}

export default FeedbackGrid;
