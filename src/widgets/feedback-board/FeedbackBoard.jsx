import { useState } from 'react';
import { COLORS } from '../../shared/constants/tokens';
import { useFeedbackList } from '../../entities/feedback';
import { FeedbackGrid } from '../../entities/feedback';
import { VoteButtons } from '../../features/vote-on-feedback';
import { useDeleteFeedback } from '../../features/delete-feedback';
import { FilterBar, useFeedbackFilters } from '../../features/filter-feedback';
import { FeedbackForm } from '../../features/submit-feedback';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import { useDeleteConfirmation } from './useDeleteConfirmation';

function FeedbackBoard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { filters, setFilter } = useFeedbackFilters();
  const { data, isLoading, error } = useFeedbackList(filters);
  const deleteFeedback = useDeleteFeedback();
  const { pendingDeleteId, isModalOpen, requestDelete, cancelDelete, confirmDelete } =
    useDeleteConfirmation();

  const handleConfirmDelete = () => {
    const id = confirmDelete();
    if (id) {
      deleteFeedback.mutate(id);
    }
  };

  const renderActions = (item) => (
    <VoteButtons
      feedbackId={item._id}
      upvoteCount={item.upvoteCount}
      downvoteCount={item.downvoteCount}
    />
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            color: COLORS.ink,
          }}
        >
          Product Feedback
        </h1>
        <Button onClick={() => setIsFormOpen(true)}>+ New Feedback</Button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <FilterBar filters={filters} setFilter={setFilter} />
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: 48, color: COLORS.inkMuted }}>Loading...</div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: 48, color: COLORS.bug }}>
          Error loading feedback. Please try again.
        </div>
      )}

      {!isLoading && !error && <FeedbackGrid feedbackList={data?.data || []} renderActions={renderActions} />}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <h2
          style={{
            margin: '0 0 24px',
            fontSize: 20,
            fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
            color: COLORS.ink,
          }}
        >
          New Feedback
        </h2>
        <FeedbackForm onSuccess={() => setIsFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
      />
    </div>
  );
}

export default FeedbackBoard;
