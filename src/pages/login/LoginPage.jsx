import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import AuthLayout from '../../features/auth/components/AuthLayout.jsx';
import LoginForm from '../../features/auth/components/LoginForm.jsx';

const DEMO_USERS = [
  { role: 'Admin', email: 'admin@test.com', password: 'admin123' },
  { role: 'User', email: 'diptes@gmail.com', password: 'diptes@gmail.com' },
  { role: 'Manager', email: 'diptes@manager.com', password: 'diptes@manager.com' },
];

function LoginPage() {
  const { login, isAuthenticated, isAuthLoading, loginError } = useAuth();
  const navigate = useNavigate();
  const [checkingRedirect, setCheckingRedirect] = useState(true);
  const [fillCredentials, setFillCredentials] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    } else {
      setCheckingRedirect(false);
    }
  }, [isAuthenticated, navigate]);

  if (checkingRedirect) return null;

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      navigate('/', { replace: true });
    } catch {
      // Error is handled by useAuth hook
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back! Sign in to your account.">
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={isAuthLoading}
        error={loginError}
        fillCredentials={fillCredentials}
      />

      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-3">
          Demo Credentials
        </p>
        <div className="space-y-2">
          {DEMO_USERS.map((user) => (
            <button
              key={user.email}
              type="button"
              onClick={() => setFillCredentials({ email: user.email, password: user.password })}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-dashed border-border
                hover:border-accent/50 hover:bg-accent/5 transition-colors text-left group"
            >
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-ink">{user.role}</span>
                <span className="block text-xs text-ink-muted truncate">{user.email}</span>
              </div>
              <span className="text-[10px] font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-2 whitespace-nowrap">
                Use
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-ink-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
