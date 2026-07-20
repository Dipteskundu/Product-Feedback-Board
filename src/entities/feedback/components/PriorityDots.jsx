import { COLORS } from '../../../shared/constants/tokens';

const priorityDots = {
  High: 3,
  Medium: 2,
  Low: 1,
};

function PriorityDots({ priority }) {
  const filled = priorityDots[priority] || 0;

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: i <= filled ? COLORS.ink : COLORS.border,
          }}
        />
      ))}
    </div>
  );
}

export default PriorityDots;
