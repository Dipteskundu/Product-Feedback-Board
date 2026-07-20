import { useVote } from '../hooks/useVote';

function VoteButtons({ feedbackId, upvoteCount, userVote }) {
  const vote = useVote();
  const hasVoted = userVote === 'up';

  const handleVote = (e) => {
    e.stopPropagation();
    if (hasVoted) return;
    vote.mutate({ feedbackId, voteType: 'up', userVote });
  };

  return (
    <div className="vote-rail">
      <button
        onClick={handleVote}
        disabled={hasVoted}
        className={`
          w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-0.5
          transition-all duration-150
          ${hasVoted
            ? 'bg-accent text-white cursor-not-allowed'
            : 'bg-accent-light text-accent hover:bg-accent hover:text-white cursor-pointer'
          }
        `}
        aria-label={hasVoted ? 'Already upvoted' : 'Upvote'}
      >
        <svg
          className={`w-3 h-3 ${hasVoted ? 'text-white' : 'text-accent group-hover/vote:text-white'}`}
          fill="none"
          viewBox="0 0 10 7"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 6L5 2L9 6" />
        </svg>
        <span className={`text-xs font-bold font-mono ${hasVoted ? 'text-white' : 'text-accent'}`}>
          {upvoteCount}
        </span>
      </button>
    </div>
  );
}

export default VoteButtons;
