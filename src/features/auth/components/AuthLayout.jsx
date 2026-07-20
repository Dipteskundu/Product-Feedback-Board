function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-ink mb-2">
            Feedback Board
          </h1>
          <p className="text-ink-muted text-sm">
            Share, vote, and prioritize product feedback
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl shadow-card p-6">
          {title && (
            <div className="mb-6">
              <h2 className="font-heading font-bold text-xl text-ink">{title}</h2>
              {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
