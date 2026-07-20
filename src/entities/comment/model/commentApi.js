import api from '../../../shared/lib/apiClient';

export async function fetchComments(feedbackId) {
  return api.get(`/feedback/${feedbackId}/comments`);
}

export async function createComment(feedbackId, body, parentId = null) {
  return api.post(`/feedback/${feedbackId}/comments`, { body, parentId });
}

export async function deleteComment(id) {
  return api.del(`/feedback/comments/${id}`);
}
