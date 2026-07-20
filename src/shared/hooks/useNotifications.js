import { useQuery } from '@tanstack/react-query';
import api from '../lib/apiClient';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications'),
    staleTime: 30_000,
  });
}
