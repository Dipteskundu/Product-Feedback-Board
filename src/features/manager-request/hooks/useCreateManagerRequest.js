import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createManagerRequest } from '../api/managerRequestApi';

export function useCreateManagerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManagerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-requests'] });
    },
  });
}
