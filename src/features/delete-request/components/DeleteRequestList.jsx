import { useDeleteRequests } from '../hooks/useDeleteRequests';
import { useApproveDeleteRequest } from '../hooks/useApproveDeleteRequest';
import { useRejectDeleteRequest } from '../hooks/useRejectDeleteRequest';
import { useToast } from '../../../shared/components/Toast';
import Button from '../../../shared/components/Button';

function DeleteRequestList() {
  const { data: requests = [], isLoading } = useDeleteRequests('pending');
  const approveRequest = useApproveDeleteRequest();
  const rejectRequest = useRejectDeleteRequest();
  const toast = useToast();

  const handleApprove = (id) => {
    approveRequest.mutate(id, {
      onSuccess: () => toast('Delete request approved. Feedback has been deleted.', 'success'),
      onError: (error) => toast(error.message || 'Failed to approve', 'error'),
    });
  };

  const handleReject = (id) => {
    rejectRequest.mutate({ id, note: 'Rejected by manager' }, {
      onSuccess: () => toast('Delete request rejected', 'info'),
      onError: (error) => toast(error.message || 'Failed to reject', 'error'),
    });
  };

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading requests...</p>;
  }

  if (requests.length === 0) {
    return <p className="text-sm text-ink-muted">No pending delete requests.</p>;
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req._id}
          className="flex items-center justify-between p-3 bg-bg border border-border rounded-lg"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">
              {req.feedbackId?.title || 'Unknown feedback'}
            </p>
            <p className="text-xs text-ink-muted">
              Requested by {req.requestedByActorId?.name || 'Unknown'} &middot;{' '}
              {new Date(req.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 shrink-0 ml-4">
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleApprove(req._id)}
              disabled={approveRequest.isPending}
            >
              Approve
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleReject(req._id)}
              disabled={rejectRequest.isPending}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DeleteRequestList;
