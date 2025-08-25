
// This file is deprecated - use useCustomAuth instead
// Keeping for backwards compatibility during migration

import { useCustomAuth } from './useCustomAuth';

export function useAuth() {
  const auth = useCustomAuth();
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    logout: auth.logout,
    isLoggingOut: auth.isLoggingOut,
  };
}
