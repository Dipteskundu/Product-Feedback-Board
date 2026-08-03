import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import AuthLayout from '../../features/auth/components/AuthLayout.jsx';
import RegisterForm from '../../features/auth/components/RegisterForm.jsx';

function RegisterPage() {
  const { register, isAuthenticated, isAuthLoading, registerError } = useAuth();
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

  const handleSubmit = async (userData) => {
    try {
      await register(userData);
      navigate('/', { replace: true });
    } catch {
      // Error is handled by useAuth hook
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink">Create account</h1>
          <p className="text-base text-ink-muted mt-1">Start collecting feedback today</p>
        </div>

        <RegisterForm onSubmit={handleSubmit} isLoading={isAuthLoading} error={registerError} />

        <p className="text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-ink font-medium hover:text-accent transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
