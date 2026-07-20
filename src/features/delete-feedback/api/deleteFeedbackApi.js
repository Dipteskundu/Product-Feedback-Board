import api from '../../../shared/lib/apiClient';

export async function deleteFeedback(id) {
  return api.del(`/feedback/${id}`);
}
