import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitFeedback } from '../api/submitFeedbackApi';

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
