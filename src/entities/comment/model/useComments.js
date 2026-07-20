import { useQuery } from '@tanstack/react-query';
import { fetchComments } from './commentApi';

export function useComments(feedbackId) {
  return useQuery({
    queryKey: ['comments', feedbackId],
    queryFn: () => fetchComments(feedbackId),
    enabled: !!feedbackId,
  });
}
