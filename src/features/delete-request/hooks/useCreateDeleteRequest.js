import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDeleteRequest } from '../api/deleteRequestApi';

export function useCreateDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeleteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delete-requests'] });
    },
  });
}
