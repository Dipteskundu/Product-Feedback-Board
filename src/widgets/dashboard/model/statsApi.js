import api from '../../../shared/lib/apiClient';

export async function fetchStats() {
  return api.get('/stats');
}
