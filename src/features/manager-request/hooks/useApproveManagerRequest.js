import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveManagerRequest } from '../api/managerRequestApi';

export function useApproveManagerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveManagerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-requests'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
