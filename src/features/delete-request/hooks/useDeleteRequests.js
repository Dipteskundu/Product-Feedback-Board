import { useQuery } from '@tanstack/react-query';
import { fetchDeleteRequests } from '../api/deleteRequestApi';

export function useDeleteRequests(status) {
  return useQuery({
    queryKey: ['delete-requests', status],
    queryFn: () => fetchDeleteRequests(status),
  });
}
