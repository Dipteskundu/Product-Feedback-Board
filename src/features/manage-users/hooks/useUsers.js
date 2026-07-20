import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/userApi';

export function useUsers(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => fetchUsers(page, limit),
  });
}
