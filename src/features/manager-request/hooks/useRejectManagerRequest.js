import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectManagerRequest } from '../api/managerRequestApi';

export function useRejectManagerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }) => rejectManagerRequest(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-requests'] });
    },
  });
}
