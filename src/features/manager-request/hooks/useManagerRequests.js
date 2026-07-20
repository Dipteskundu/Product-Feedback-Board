import { useQuery } from '@tanstack/react-query';
import { fetchManagerRequests } from '../api/managerRequestApi';

export function useManagerRequests(status) {
  return useQuery({
    queryKey: ['manager-requests', status],
    queryFn: () => fetchManagerRequests(status),
  });
}
