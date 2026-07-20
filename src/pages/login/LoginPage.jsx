import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm, useLogin, useCurrentUser } from '../../features/auth/index.js';

function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isLoading, error } = useLogin();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (formData) => {
    login(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => {
          navigate('/', { replace: true });
        },
      }
    );
  };

  if (user) return null;

  return (
    <AuthForm
      type="login"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error?.message}
    />
  );
}

export default LoginPage;
