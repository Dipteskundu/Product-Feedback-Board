import { useState } from 'react';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import Button from '../../../shared/components/Button';
import { useToast } from '../../../shared/components/Toast';
import FeedbackForm from './FeedbackForm';
import { useCreateFeedback } from '../hooks/useCreateFeedback';

const initialValues = {
  title: '',
  description: '',
  category: 'Feature',
  priority: 'Medium',
};

function CreateFeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const mutation = useCreateFeedback();
  const toast = useToast();

  const handleOpenChange = (nextOpen) => {
    setIsOpen(nextOpen);
    if (nextOpen) {
      mutation.reset();
    }
  };

  const handleFieldChange = (field, value) => {
    if (mutation.isError) {
      mutation.reset();
    }
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setIsOpen(false);
    mutation.reset();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    mutation.mutate(values, {
      onSuccess: () => {
        toast('Feedback created successfully', 'success');
        setValues(initialValues);
        setIsOpen(false);
      },
      onError: (error) => {
        toast(error.message || 'Failed to create feedback', 'error');
      },
    });
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="w-full sm:w-auto sm:px-5"
      >
        + New Feedback
      </Button>

      <ModalOverlay
        isOpen={isOpen}
        isDismissable
        onOpenChange={handleOpenChange}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
      >
        <Modal className="w-full max-w-2xl outline-none">
          <Dialog
            aria-labelledby="create-feedback-title"
            className="overflow-hidden rounded-[28px] border border-white/70 bg-surface shadow-[0_30px_80px_rgba(15,23,42,0.24)] outline-none dark:border-white/10 dark:bg-[#11131C]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/70 bg-gradient-to-r from-accent/10 via-transparent to-transparent px-6 py-5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                  New feedback
                </p>
                <h2 id="create-feedback-title" className="mt-1 font-heading text-2xl font-bold text-ink">
                  Share an idea
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Capture a problem, feature request, or improvement suggestion.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-surface text-ink-muted shadow-sm transition-colors hover:bg-accent-light hover:text-ink dark:hover:bg-white/5"
                aria-label="Close feedback modal"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <FeedbackForm
              values={values}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={mutation.isPending}
              error={mutation.error?.message}
            />
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}

export default CreateFeedbackDialog;
