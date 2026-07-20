import api from '../../../shared/lib/apiClient';

export async function fetchFeedback({
  category,
  priority,
  status,
  search,
  sort,
  page = 1,
  limit = 50,
} = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (priority) params.set('priority', priority);
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);
  if (page) params.set('page', page.toString());
  if (limit) params.set('limit', limit.toString());

  const query = params.toString();
  const path = query ? `/feedback?${query}` : '/feedback';
  return api.get(path);
}
