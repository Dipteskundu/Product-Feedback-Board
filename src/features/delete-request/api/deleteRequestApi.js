import api from '../../../shared/lib/apiClient';

export function createDeleteRequest(feedbackId) {
  return api.post('/delete-requests', { feedbackId });
}

export function fetchDeleteRequests(status) {
  const params = status ? `?status=${status}` : '';
  return api.get(`/delete-requests${params}`);
}

export function approveDeleteRequest(id) {
  return api.put(`/delete-requests/${id}/approve`);
}

export function rejectDeleteRequest(id, note) {
  return api.put(`/delete-requests/${id}/reject`, { note });
}
