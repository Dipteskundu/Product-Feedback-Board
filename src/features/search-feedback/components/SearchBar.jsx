import { useState, useEffect } from 'react';

function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue || undefined);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search feedback..."
        className="w-full sm:w-56 pl-9 pr-8 py-2 bg-surface border border-border rounded-lg text-sm text-ink
          placeholder:text-ink-muted/60
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          hover:border-accent/40 transition-colors"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange(undefined);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-ink-muted hover:text-ink hover:bg-accent-light transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
