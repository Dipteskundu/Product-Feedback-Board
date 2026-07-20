import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFeedbackStatus } from '../api/statusApi';

export function useChangeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateFeedbackStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
