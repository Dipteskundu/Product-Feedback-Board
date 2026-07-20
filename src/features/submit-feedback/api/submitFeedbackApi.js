import api from '../../../shared/lib/apiClient';

export async function createFeedback(payload) {
  return api.post('/feedback', payload);
}
