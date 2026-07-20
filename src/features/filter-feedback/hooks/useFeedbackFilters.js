import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export function useFeedbackFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      category: searchParams.get('category') || undefined,
      priority: searchParams.get('priority') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
    }),
    [searchParams]
  );

  const setFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, setFilter, clearFilters };
}
