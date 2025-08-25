import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";

export function useAuth() {
  const [firebaseUser, firebaseLoading, firebaseError] = useAuthState(auth);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Query backend user data using session token or Firebase ID token
  const { data: backendUser, isLoading: backendLoading } = useQuery({
    queryKey: ["/api/auth/me", firebaseUser?.uid],
    queryFn: async () => {
      // First try session token from localStorage
      const sessionToken = localStorage.getItem('auth_token');
      if (sessionToken) {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        });
        
        if (response.ok) {
          return response.json();
        }
        
        // If session token is invalid, remove it
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
        }
      }
      
      // If no session token or it's invalid, try Firebase ID token
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            // Store session token if provided
            if (userData.tokens?.sessionJwt) {
              localStorage.setItem('auth_token', userData.tokens.sessionJwt);
            }
            return userData;
          }
        } catch (error) {
          console.warn('Firebase ID token failed:', error);
        }
      }
      
      return null;
    },
    enabled: !firebaseLoading,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Mark as initialized once Firebase auth state is determined
    if (!firebaseLoading) {
      setIsInitialized(true);
    }
  }, [firebaseLoading]);

  const isLoading = firebaseLoading || (!isInitialized) || backendLoading;
  
  // User is authenticated if we have backend user data (regardless of Firebase state)
  const isAuthenticated = !!backendUser?.user;
  
  // Return standardized user object
  const user = backendUser?.user || null;

  return {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
    error: firebaseError,
  };
}