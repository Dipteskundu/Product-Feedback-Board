import api from '../../../shared/lib/apiClient';

export async function fetchFeedback({ category, priority, page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (priority) params.set('priority', priority);
  if (page) params.set('page', page.toString());
  if (limit) params.set('limit', limit.toString());

  const query = params.toString();
  const path = query ? `/feedback?${query}` : '/feedback';
  return api.get(path);
}
