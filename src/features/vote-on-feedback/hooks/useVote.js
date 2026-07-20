import { useMutation, useQueryClient } from '@tanstack/react-query';
import { castVote } from '../api/voteApi';

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feedbackId, voteType }) => castVote(feedbackId, voteType),
    onMutate: async ({ feedbackId, voteType, userVote }) => {
      await queryClient.cancelQueries({ queryKey: ['feedback'] });

      const previousData = queryClient.getQueriesData({ queryKey: ['feedback'] });

      queryClient.setQueriesData({ queryKey: ['feedback'] }, (old) => {
        if (!old?.data) return old;

        const items = old.data.data || old.data;
        if (!Array.isArray(items)) return old;

        const updatedItems = items.map((item) => {
          if (item._id !== feedbackId) return item;

          let upDelta = 0;
          let downDelta = 0;

          if (!userVote) {
            if (voteType === 'up') upDelta = 1;
            else downDelta = 1;
          } else if (userVote !== voteType) {
            if (voteType === 'up') {
              upDelta = 1;
              downDelta = -1;
            } else {
              upDelta = -1;
              downDelta = 1;
            }
          }

          return {
            ...item,
            upvoteCount: item.upvoteCount + upDelta,
            downvoteCount: item.downvoteCount + downDelta,
            userVote: voteType,
          };
        });

        return {
          ...old,
          data: { ...old.data, data: updatedItems },
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
