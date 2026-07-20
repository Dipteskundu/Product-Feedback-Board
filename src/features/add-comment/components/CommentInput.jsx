import { useState } from 'react';
import Button from '../../../shared/components/Button';
import { useToast } from '../../../shared/components/Toast';
import { useAddComment } from '../hooks/useAddComment';

function CommentInput({ feedbackId, parentId = null, onCancel }) {
  const [body, setBody] = useState('');
  const addComment = useAddComment(feedbackId);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    addComment.mutate(
      { body: body.trim(), parentId },
      {
        onSuccess: () => {
          setBody('');
          onCancel?.();
        },
        onError: (error) => {
          toast(error.message || 'Failed to post comment', 'error');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className={parentId ? 'mt-3' : ''}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={parentId ? 'Write a reply...' : 'Add a comment...'}
        rows={parentId ? 2 : 3}
        className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-ink
          placeholder:text-ink-muted/60 resize-y
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          transition-colors"
      />
      <div className="flex gap-2 mt-3 justify-end">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} type="button" size="sm">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!body.trim() || addComment.isPending} size="sm">
          {addComment.isPending ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
}

export default CommentInput;
