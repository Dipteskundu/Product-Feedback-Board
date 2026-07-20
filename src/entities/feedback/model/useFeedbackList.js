import { useQuery } from '@tanstack/react-query';
import { fetchFeedback } from './feedbackApi';

export function useFeedbackList(filters = {}) {
  return useQuery({
    queryKey: ['feedback', filters],
    queryFn: () => fetchFeedback(filters),
  });
}
