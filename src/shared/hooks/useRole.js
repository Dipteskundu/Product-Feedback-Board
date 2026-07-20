import { useAuth } from '../../features/auth/hooks/useAuth';

export function useRole() {
  const { user } = useAuth();
  return {
    role: user?.role,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isUser: user?.role === 'user',
    isManagerOrAdmin: user?.role === 'manager' || user?.role === 'admin',
  };
}
