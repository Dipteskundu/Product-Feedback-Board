import api from '../../../shared/lib/apiClient';

export async function fetchActivities(feedbackId) {
  return api.get(`/feedback/${feedbackId}/activities`);
}
