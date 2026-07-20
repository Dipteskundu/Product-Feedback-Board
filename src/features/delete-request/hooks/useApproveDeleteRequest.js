import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveDeleteRequest } from '../api/deleteRequestApi';

export function useApproveDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveDeleteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delete-requests'] });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
