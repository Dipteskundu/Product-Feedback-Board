import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import AuthLayout from '../../features/auth/components/AuthLayout.jsx';
import LoginForm from '../../features/auth/components/LoginForm.jsx';

function LoginPage() {
  const { login, isAuthenticated, isAuthLoading, loginError } = useAuth();
  const navigate = useNavigate();
  const [checkingRedirect, setCheckingRedirect] = useState(true);

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
      <LoginForm onSubmit={handleSubmit} isLoading={isAuthLoading} error={loginError} />

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
