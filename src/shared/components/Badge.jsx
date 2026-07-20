import { COLORS } from '../constants/tokens';

function Badge({ children, color = COLORS.accent, style = {} }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: `${color}15`,
        color: color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default Badge;
