import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectDeleteRequest } from '../api/deleteRequestApi';

export function useRejectDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }) => rejectDeleteRequest(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delete-requests'] });
    },
  });
}
