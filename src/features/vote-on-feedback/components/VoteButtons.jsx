import { COLORS } from '../../../shared/constants/tokens';
import { useVote } from '../hooks/useVote';

function VoteButtons({ feedbackId, upvoteCount, downvoteCount }) {
  const vote = useVote();

  const handleVote = (voteType) => {
    vote.mutate({ feedbackId, voteType });
  };

  const countStyle = {
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    color: COLORS.ink,
    minWidth: 24,
    textAlign: 'center',
  };

  const chevronStyle = {
    cursor: 'pointer',
    color: COLORS.inkMuted,
    transition: 'color 100ms ease',
    userSelect: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <button
        onClick={() => handleVote('up')}
        style={{
          ...chevronStyle,
          background: 'none',
          border: 'none',
          padding: 4,
          fontSize: 16,
        }}
        onMouseEnter={(e) => (e.target.style.color = COLORS.accent)}
        onMouseLeave={(e) => (e.target.style.color = COLORS.inkMuted)}
      >
        ▲
      </button>
      <span style={countStyle}>{upvoteCount}</span>
      <button
        onClick={() => handleVote('down')}
        style={{
          ...chevronStyle,
          background: 'none',
          border: 'none',
          padding: 4,
          fontSize: 16,
        }}
        onMouseEnter={(e) => (e.target.style.color = COLORS.bug)}
        onMouseLeave={(e) => (e.target.style.color = COLORS.inkMuted)}
      >
        ▼
      </button>
    </div>
  );
}

export default VoteButtons;
