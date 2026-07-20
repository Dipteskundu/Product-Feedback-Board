import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm, useRegister, useCurrentUser } from '../../features/auth/index.js';

function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: registerUser, isLoading, error } = useRegister();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (formData) => {
    registerUser(formData, {
      onSuccess: () => {
        navigate('/', { replace: true });
      },
    });
  };

  if (user) return null;

  return (
    <AuthForm
      type="register"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error?.message}
    />
  );
}

export default RegisterPage;
