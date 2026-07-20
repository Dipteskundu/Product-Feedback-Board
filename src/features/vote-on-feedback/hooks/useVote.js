import { useMutation, useQueryClient } from '@tanstack/react-query';
import { castVote } from '../api/voteApi';

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feedbackId, voteType }) => castVote(feedbackId, voteType),
    onMutate: async ({ feedbackId, voteType }) => {
      await queryClient.cancelQueries({ queryKey: ['feedback'] });

      const previousData = queryClient.getQueriesData({ queryKey: ['feedback'] });

      queryClient.setQueriesData({ queryKey: ['feedback'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((item) => {
            if (item._id !== feedbackId) return item;

            const isUpvote = voteType === 'up';
            const upDelta = isUpvote ? 1 : -1;
            const downDelta = isUpvote ? -1 : 1;

            return {
              ...item,
              upvoteCount: item.upvoteCount + upDelta,
              downvoteCount: item.downvoteCount + downDelta,
            };
          }),
        };
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
