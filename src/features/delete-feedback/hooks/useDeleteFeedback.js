import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFeedback } from '../api/deleteFeedbackApi';

export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
