import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../api/authApi.js';

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
  });
};
