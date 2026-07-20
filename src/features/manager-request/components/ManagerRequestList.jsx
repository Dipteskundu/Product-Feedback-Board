import { useManagerRequests } from '../hooks/useManagerRequests';
import { useApproveManagerRequest } from '../hooks/useApproveManagerRequest';
import { useRejectManagerRequest } from '../hooks/useRejectManagerRequest';
import { useToast } from '../../../shared/components/Toast';
import Button from '../../../shared/components/Button';

function ManagerRequestList() {
  const { data: requests = [], isLoading } = useManagerRequests('pending');
  const approveRequest = useApproveManagerRequest();
  const rejectRequest = useRejectManagerRequest();
  const toast = useToast();

  const handleApprove = (id) => {
    approveRequest.mutate(id, {
      onSuccess: () => toast('Manager request approved!', 'success'),
      onError: (error) => toast(error.message || 'Failed to approve', 'error'),
    });
  };

  const handleReject = (id) => {
    rejectRequest.mutate({ id, note: 'Rejected by admin' }, {
      onSuccess: () => toast('Manager request rejected', 'info'),
      onError: (error) => toast(error.message || 'Failed to reject', 'error'),
    });
  };

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading requests...</p>;
  }

  if (requests.length === 0) {
    return <p className="text-sm text-ink-muted">No pending manager requests.</p>;
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
              {req.requestedByActorId?.name || 'Unknown'}
            </p>
            <p className="text-xs text-ink-muted">
              {req.requestedByActorId?.email} &middot;{' '}
              {new Date(req.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 shrink-0 ml-4">
            <Button
              variant="primary"
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

export default ManagerRequestList;
