import { useState, useCallback } from 'react';

export function useDeleteConfirmation() {
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const requestDelete = useCallback((id) => {
    setPendingDeleteId(id);
  }, []);

  const cancelDelete = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

  const confirmDelete = useCallback(() => {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    return id;
  }, [pendingDeleteId]);

  return {
    pendingDeleteId,
    isModalOpen: pendingDeleteId !== null,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
