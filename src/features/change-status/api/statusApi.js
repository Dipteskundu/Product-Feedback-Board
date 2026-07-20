import api from '../../../shared/lib/apiClient';

export async function updateFeedbackStatus(id, status) {
  return api.put(`/feedback/${id}/status`, { status });
}
