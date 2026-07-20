import { useCreateManagerRequest } from '../hooks/useCreateManagerRequest';
import { useToast } from '../../../shared/components/Toast';
import Button from '../../../shared/components/Button';

function RequestManagerButton() {
  const createRequest = useCreateManagerRequest();
  const toast = useToast();

  const handleClick = () => {
    createRequest.mutate(undefined, {
      onSuccess: () => toast('Manager request submitted. Waiting for admin approval.', 'info'),
      onError: (error) => toast(error.message || 'Failed to submit request', 'error'),
    });
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={createRequest.isPending}
    >
      {createRequest.isPending ? 'Requesting...' : 'Request Manager Role'}
    </Button>
  );
}

export default RequestManagerButton;
