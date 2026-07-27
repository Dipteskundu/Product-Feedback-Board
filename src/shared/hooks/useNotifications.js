import { useQuery } from '@tanstack/react-query';
import api from '../lib/apiClient';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function useNotifications() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications'),
    staleTime: 30_000,
    enabled: isAuthenticated,
  });
}
