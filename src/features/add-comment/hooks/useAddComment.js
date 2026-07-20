import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../../entities/comment/model/commentApi';

export function useAddComment(feedbackId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, parentId }) => createComment(feedbackId, body, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', feedbackId] });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
