import api from '../../../shared/lib/apiClient';

export async function submitFeedback(data) {
  return api.post('/feedback', data);
}
