import { COLORS } from '../../../shared/constants/tokens';
import FeedbackCard from './FeedbackCard';

function FeedbackGrid({ feedbackList = [], renderActions }) {
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}
    >
      {feedbackList.map((item) => (
        <FeedbackCard key={item._id} feedback={item} renderActions={renderActions} />
      ))}
    </div>
  );
}

export default FeedbackGrid;
