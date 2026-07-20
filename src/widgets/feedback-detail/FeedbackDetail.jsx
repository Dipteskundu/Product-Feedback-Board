import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../shared/lib/apiClient';
import StatusBadge from '../../entities/feedback/components/StatusBadge';
import CategoryBadge from '../../entities/feedback/components/CategoryBadge';
import PriorityDots from '../../entities/feedback/components/PriorityDots';
import { VoteButtons } from '../../features/vote-on-feedback';
import StatusSelect from '../../features/change-status/components/StatusSelect';
import { DeleteRequestButton } from '../../features/delete-request';
import { CommentInput, useDeleteComment } from '../../features/add-comment';
import { useComments } from '../../entities/comment';
import CommentList from '../../entities/comment/components/CommentList';
import { useActivities } from '../../entities/activity';
import ActivityTimeline from '../../entities/activity/components/ActivityTimeline';
import { useDeleteFeedback } from '../../features/delete-feedback';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useToast } from '../../shared/components/Toast';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import Button from '../../shared/components/Button';
import { CardSkeleton } from '../../shared/components/Skeleton';

function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [replyTo, setReplyTo] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteFeedback = useDeleteFeedback();
  const deleteComment = useDeleteComment(id);
  const { user } = useAuth();
  const toast = useToast();

  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';

  const { data: feedback, isLoading, error } = useQuery({
    queryKey: ['feedback', id],
    queryFn: () => api.get(`/feedback/${id}`),
    enabled: !!id,
  });

  const { data: comments = [] } = useComments(id);
  const { data: activities = [] } = useActivities(id);

  const isOwner = feedback?.createdByActorId?.toString() === user?._id;

  const handleDelete = () => {
    deleteFeedback.mutate(id, {
      onSuccess: () => navigate('/'),
      onError: (error) => {
        setIsDeleteOpen(false);
      },
    });
  };

  const handleDeleteComment = (commentId) => {
    deleteComment.mutate(commentId, {
      onSuccess: () => toast('Comment deleted', 'success'),
      onError: (error) => toast(error.message || 'Failed to delete comment', 'error'),
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center dark:bg-red-950/40 dark:border-red-900/40">
          <p className="text-bug font-medium">Feedback not found</p>
          <Button variant="secondary" onClick={() => navigate('/')} className="mt-4">
        Back to Feedback
          </Button>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Board
      </button>

      {/* Main card */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CategoryBadge category={feedback.category} />
          <PriorityDots priority={feedback.priority} />
          <StatusBadge status={feedback.status} />
        </div>

        <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink mb-3">
          {feedback.title}
        </h1>

        <p className="text-sm text-ink leading-relaxed mb-4">
          {feedback.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-ink-muted mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center text-[10px] font-mono font-semibold text-accent">
              {feedback.createdByActorId?.toString().slice(-2).toUpperCase() || '?'}
            </div>
            <span>Created {new Date(feedback.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {feedback.updatedAt !== feedback.createdAt && (
            <span>Updated {new Date(feedback.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap pt-4 border-t border-border">
          <VoteButtons
            feedbackId={feedback._id}
            upvoteCount={feedback.upvoteCount}
            downvoteCount={feedback.downvoteCount}
          />
          {isManagerOrAdmin ? (
            <StatusSelect feedbackId={feedback._id} currentStatus={feedback.status} />
          ) : (
            <StatusBadge status={feedback.status} />
          )}
          {isManagerOrAdmin ? (
            <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)}>
              Delete
            </Button>
          ) : isOwner ? (
            <DeleteRequestButton feedbackId={feedback._id} isOwner={true} />
          ) : null}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-heading font-bold text-ink mb-4">
          Comments ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h2>
        <CommentList
          comments={comments}
          onReply={setReplyTo}
          onDelete={handleDeleteComment}
          currentUserId={user?._id}
        />
        <div className="mt-4 pt-4 border-t border-border">
          <CommentInput
            feedbackId={id}
            parentId={replyTo}
            onCancel={() => setReplyTo(null)}
          />
        </div>
      </div>

      {/* Activity */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <ActivityTimeline activities={activities} />
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
      />
    </div>
  );
}

export default FeedbackDetail;
