import { useCreateDeleteRequest } from '../hooks/useCreateDeleteRequest';
import { useToast } from '../../../shared/components/Toast';
import Button from '../../../shared/components/Button';

function DeleteRequestButton({ feedbackId, isOwner }) {
  const createRequest = useCreateDeleteRequest();
  const toast = useToast();

  if (!isOwner) return null;

  const handleClick = () => {
    createRequest.mutate(feedbackId, {
      onSuccess: () => toast('Delete request submitted. A manager will review it.', 'info'),
      onError: (error) => toast(error.message || 'Failed to submit delete request', 'error'),
    });
  };

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleClick}
      disabled={createRequest.isPending}
    >
      {createRequest.isPending ? 'Requesting...' : 'Request Delete'}
    </Button>
  );
}

export default DeleteRequestButton;
