import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children, maxWidth = 'max-w-lg' }) {
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;

      const previousActiveElement = previousActiveElementRef.current;
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-ink/40 dark:bg-black/60"
        aria-hidden="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div
        className="relative flex min-h-full items-center justify-center p-4"
      >
        <div
          role="dialog"
          aria-modal="true"
          className={`
            relative z-10 w-full ${maxWidth}
            max-h-[calc(100vh-2rem)] overflow-y-auto
            rounded-xl bg-surface shadow-xl
          `}
        >
          <button
            onClick={onClose}
            type="button"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-accent-light hover:text-ink dark:hover:bg-accent/10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
