import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedbackList } from '../../entities/feedback';
import { FeedbackGrid } from '../../entities/feedback';
import { VoteButtons } from '../../features/vote-on-feedback';
import { useDeleteFeedback } from '../../features/delete-feedback';
import { FilterBar, useFeedbackFilters } from '../../features/filter-feedback';
import { CreateFeedbackDialog } from '../../features/submit-feedback';
import { useToast } from '../../shared/components/Toast';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useNotifications } from '../../shared/hooks/useNotifications';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import EmptyState from '../../shared/components/EmptyState';
import { ListSkeleton } from '../../shared/components/Skeleton';
import { useDeleteConfirmation } from './useDeleteConfirmation';

function FeedbackBoard() {
  const { filters, setFilter, clearFilters } = useFeedbackFilters();
  const { data, isLoading, error } = useFeedbackList(filters);
  const deleteFeedback = useDeleteFeedback();
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: notifications = [] } = useNotifications();
  const shownNotifications = useRef(new Set());
  const { isModalOpen, requestDelete, cancelDelete, confirmDelete } =
    useDeleteConfirmation();

  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';

  useEffect(() => {
    if (Array.isArray(notifications) && notifications.length > 0) {
      notifications.forEach((n) => {
        if (!shownNotifications.current.has(n.id)) {
          shownNotifications.current.add(n.id);
          toast(n.message, 'info', 5000);
        }
      });
    }
  }, [notifications, toast]);

  const handleConfirmDelete = () => {
    const id = confirmDelete();
    if (id) {
      deleteFeedback.mutate(id, {
        onSuccess: () => toast('Feedback deleted successfully', 'success'),
        onError: (error) => toast(error.message || 'Failed to delete feedback', 'error'),
      });
    }
  };

  const renderActions = (item) => (
    <div className="flex flex-col items-center gap-2">
      <VoteButtons
        feedbackId={item._id}
        upvoteCount={item.upvoteCount}
        userVote={item.userVote}
      />
      {isManagerOrAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            requestDelete(item._id);
          }}
          className="p-1.5 rounded-lg text-ink-muted hover:text-bug hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Delete feedback"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );

  const hasActiveFilters = filters.category || filters.priority || filters.status || filters.search;
  const feedbackList = data?.data || [];
  const count = data?.count || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
            Product Feedback
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {isLoading ? 'Loading...' : `Browse and vote on ${count} suggestion${count !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="lg:ml-auto lg:self-start">
          <CreateFeedbackDialog />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <FilterBar filters={filters} setFilter={setFilter} />
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading && <ListSkeleton count={3} />}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center dark:bg-red-950/40 dark:border-red-900/40">
          <p className="text-bug font-medium">Failed to load feedback</p>
          <p className="text-sm text-ink-muted mt-1">Please try again later</p>
        </div>
      )}

      {!isLoading && !error && feedbackList.length === 0 && (
        <EmptyState
          icon={
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          title="No feedback yet"
          description="No feedback has been submitted yet. Check back later."
        />
      )}

      {!isLoading && !error && feedbackList.length > 0 && (
        <FeedbackGrid
          feedbackList={feedbackList}
          renderActions={renderActions}
          onCardClick={(item) => navigate(`/feedback/${item._id}`)}
        />
      )}

      {/* Delete Confirmation */}
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
