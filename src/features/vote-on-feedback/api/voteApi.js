import api from '../../../shared/lib/apiClient';

export async function castVote(feedbackId, voteType) {
  return api.put(`/feedback/${feedbackId}/vote`, { voteType });
}
