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
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink">Welcome back</h1>
          <p className="text-base text-ink-muted mt-1">Sign in to your account</p>
        </div>

        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isAuthLoading}
          error={loginError}
          fillCredentials={fillCredentials}
        />

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-bg px-2 text-ink-muted">or</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {DEMO_USERS.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => setFillCredentials({ email: user.email, password: user.password })}
                className="px-3 py-1.5 text-xs text-ink-muted border border-border rounded-md
                  hover:border-ink-muted/40 hover:text-ink transition-colors"
              >
                {user.role}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-ink-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-ink font-medium hover:text-accent transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
