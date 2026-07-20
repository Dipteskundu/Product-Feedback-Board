const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary: 'bg-surface border border-border text-ink hover:bg-accent-light hover:border-accent/30 active:scale-[0.98]',
  danger: 'bg-bug hover:bg-red-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]',
  ghost: 'bg-transparent text-ink-muted hover:bg-accent-light hover:text-ink active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-150 ease-out
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
