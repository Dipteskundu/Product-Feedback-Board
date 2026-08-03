import { useState, useEffect } from 'react';

function LoginForm({ onSubmit, isLoading, error, fillCredentials }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (fillCredentials) {
      setEmail(fillCredentials.email);
      setPassword(fillCredentials.password);
    }
  }, [fillCredentials]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 dark:bg-red-950/40 dark:border-red-900/40 dark:text-red-400">
          {error.message}
        </div>
      )}

      <div>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-transparent border border-border rounded-lg text-sm text-ink
            placeholder:text-ink-muted/50
            focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent
            hover:border-ink-muted/40 transition-colors"
          placeholder="Email"
        />
      </div>

      <div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-transparent border border-border rounded-lg text-sm text-ink
              placeholder:text-ink-muted/50
              focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent
              hover:border-ink-muted/40 transition-colors pr-16"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink transition-colors"
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-ink hover:bg-ink/90 text-bg font-medium rounded-lg text-sm
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

export default LoginForm;
