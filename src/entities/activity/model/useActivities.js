import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from './activityApi';

export function useActivities(feedbackId) {
  return useQuery({
    queryKey: ['activities', feedbackId],
    queryFn: () => fetchActivities(feedbackId),
    enabled: !!feedbackId,
  });
}
