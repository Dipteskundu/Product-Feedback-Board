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
    <AuthLayout title="Create Account" subtitle="Join us and start sharing your feedback.">
      <RegisterForm onSubmit={handleSubmit} isLoading={isAuthLoading} error={registerError} />

      <div className="mt-6 text-center">
        <p className="text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
