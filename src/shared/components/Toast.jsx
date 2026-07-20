import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    bg: 'bg-white border-emerald-100 dark:bg-[#13151F] dark:border-emerald-900/40',
    accent: 'bg-emerald-500',
    icon: (
      <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-white border-red-100 dark:bg-[#13151F] dark:border-red-900/40',
    accent: 'bg-red-500',
    icon: (
      <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-white border-blue-100 dark:bg-[#13151F] dark:border-blue-900/40',
    accent: 'bg-blue-500',
    icon: (
      <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              relative overflow-hidden
              flex items-center gap-3
              pl-0 pr-3 py-0
              border rounded-2xl shadow-xl shadow-black/8
              animate-slide-in-right
              min-w-[300px] max-w-[420px]
              ${style.bg}
            `}
          >
            {/* Left accent stripe */}
            <div className={`w-1 self-stretch rounded-l-2xl shrink-0 ${style.accent}`} />

            {/* Icon */}
            <div className="py-3 pl-3 pr-1 shrink-0">
              {style.icon}
            </div>

            {/* Message */}
            <span className="text-[13px] font-medium text-ink flex-1 py-3 leading-snug">
              {toast.message}
            </span>

            {/* Dismiss */}
            <button
              onClick={() => onRemove(toast.id)}
              className="p-1.5 rounded-lg text-ink-muted/40 hover:text-ink-muted hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150 shrink-0"
              aria-label="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100 dark:bg-white/5">
              <div
                className={`h-full ${style.accent} rounded-full`}
                style={{
                  animation: `shrink-width ${toast.duration || 3000}ms linear forwards`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export { ToastProvider, useToast };
export default ToastProvider;
