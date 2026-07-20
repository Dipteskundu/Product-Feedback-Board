import api from '../../../shared/lib/apiClient';

export function fetchUsers(page, limit) {
  const params = new URLSearchParams();
  if (page) params.set('page', page.toString());
  if (limit) params.set('limit', limit.toString());
  const query = params.toString();
  return api.get(`/users${query ? `?${query}` : ''}`);
}

export function updateUserRole(userId, role) {
  return api.put(`/users/${userId}/role`, { role });
}
