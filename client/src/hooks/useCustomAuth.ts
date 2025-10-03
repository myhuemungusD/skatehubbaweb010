import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import type { CustomUser } from "@shared/schema";

// Custom authentication hook for the new auth system
export function useCustomAuth() {
  const queryClient = useQueryClient();

  // Get auth token from localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
  };

  // Set auth token in localStorage and update headers
  const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  };

  // Check if user has auth token
  const hasAuthToken = (): boolean => {
    return !!getAuthToken();
  };

  // Get current user data
  const { data: user, isLoading, error } = useQuery<CustomUser>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token');
      }

      return apiRequest('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).then((response: any) => response.user);
    },
    enabled: hasAuthToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = getAuthToken();
      if (token) {
        await apiRequest('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    },
    onSuccess: () => {
      setAuthToken(null);
      queryClient.clear();
      window.location.href = '/';
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      setAuthToken(null);
      queryClient.clear();
      window.location.href = '/';
    },
  });

  // Check if user is authenticated
  const isAuthenticated = !!user && !error;

  // Check if user is loading (but only if they have a token)
  const actuallyLoading = isLoading && hasAuthToken() && !error;

  return {
    user,
    isLoading: actuallyLoading,
    isAuthenticated,
    hasAuthToken: hasAuthToken(),
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    getAuthToken,
    setAuthToken,
  };
}

// Utility to add auth header to API requests
export function addAuthHeader(headers: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return {
      ...headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return headers;
}