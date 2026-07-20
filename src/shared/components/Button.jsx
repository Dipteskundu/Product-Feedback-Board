import { COLORS } from '../constants/tokens';

const variants = {
  primary: {
    backgroundColor: COLORS.accent,
    color: '#FFFFFF',
    hoverBackground: '#4338CA',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: COLORS.ink,
    hoverBackground: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
  },
  danger: {
    backgroundColor: COLORS.bug,
    color: '#FFFFFF',
    hoverBackground: '#B91C1C',
  },
};

function Button({ children, variant = 'primary', onClick, disabled, type = 'button', style = {} }) {
  const v = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        borderRadius: 6,
        border: v.border || 'none',
        backgroundColor: v.backgroundColor,
        color: v.color,
        fontSize: 14,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 100ms ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.backgroundColor = v.hoverBackground;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.target.style.backgroundColor = v.backgroundColor;
      }}
    >
      {children}
    </button>
  );
}

export default Button;
