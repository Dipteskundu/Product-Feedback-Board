import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRole } from '../api/userApi';

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
