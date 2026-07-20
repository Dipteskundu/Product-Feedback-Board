import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedback } from '../api/submitFeedbackApi';

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeedback,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
