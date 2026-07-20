import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../../../entities/comment/model/commentApi';

export function useDeleteComment(feedbackId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteComment(feedbackId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', feedbackId] });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
