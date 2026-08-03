import { useState, useMemo } from 'react';

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLevels = [
  { label: '', color: 'bg-border', width: '0%' },
  { label: 'Very weak', color: 'bg-red-500', width: '20%' },
  { label: 'Weak', color: 'bg-orange-500', width: '40%' },
  { label: 'Fair', color: 'bg-yellow-500', width: '60%' },
  { label: 'Strong', color: 'bg-green-500', width: '80%' },
  { label: 'Very strong', color: 'bg-green-600', width: '100%' },
];

function RegisterForm({ onSubmit, isLoading, error }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthInfo = strengthLevels[strength];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password });
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
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-transparent border border-border rounded-lg text-sm text-ink
            placeholder:text-ink-muted/50
            focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent
            hover:border-ink-muted/40 transition-colors"
          placeholder="Name"
        />
      </div>

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
            minLength={6}
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
        {password.length > 0 && (
          <div className="mt-2">
            <div className="h-0.5 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthInfo.color} transition-all duration-300 rounded-full`}
                style={{ width: strengthInfo.width }}
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-ink hover:bg-ink/90 text-bg font-medium rounded-lg text-sm
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

export default RegisterForm;
