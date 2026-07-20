import { COLORS } from '../../../shared/constants/tokens';
import { formatDate } from '../../../shared/utils/formatDate';
import CategoryBadge from './CategoryBadge';
import PriorityDots from './PriorityDots';

function FeedbackCard({ feedback, renderActions }) {
  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        gap: 16,
      }}
    >
      {renderActions && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
          {renderActions(feedback)}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <CategoryBadge category={feedback.category} />
          <PriorityDots priority={feedback.priority} />
        </div>
        <h3
          style={{
            margin: '0 0 4px',
            fontSize: 16,
            fontWeight: 600,
            color: COLORS.ink,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {feedback.title}
        </h3>
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 14,
            color: COLORS.inkMuted,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {feedback.description}
        </p>
        <span style={{ fontSize: 12, color: COLORS.inkMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
          {formatDate(feedback.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default FeedbackCard;
