import api from '../../../shared/lib/apiClient';

export function createManagerRequest() {
  return api.post('/manager-requests');
}

export function fetchManagerRequests(status) {
  const params = status ? `?status=${status}` : '';
  return api.get(`/manager-requests${params}`);
}

export function approveManagerRequest(id) {
  return api.put(`/manager-requests/${id}/approve`);
}

export function rejectManagerRequest(id, note) {
  return api.put(`/manager-requests/${id}/reject`, { note });
}
