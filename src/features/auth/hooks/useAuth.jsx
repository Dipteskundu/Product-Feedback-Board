import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authApi from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    enabled: !user,
  });

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });

  const login = useCallback(
    (credentials) => loginMutation.mutateAsync(credentials),
    [loginMutation]
  );

  const register = useCallback(
    (userData) => registerMutation.mutateAsync(userData),
    [registerMutation]
  );

  const logout = useCallback(
    () => logoutMutation.mutateAsync(),
    [logoutMutation]
  );

  const value = {
    user,
    isAuthLoading: isCheckingAuth || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isUser: user?.role === 'user',
    isManagerOrAdmin: user?.role === 'manager' || user?.role === 'admin',
    login,
    register,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
