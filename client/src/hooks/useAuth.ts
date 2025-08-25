import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import type { User } from "../../../shared/schema";

export function useAuth() {
  const [firebaseUser, firebaseLoading, firebaseError] = useAuthState(auth);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Query backend user data when Firebase user is authenticated
  const { data: backendUser, isLoading: backendLoading } = useQuery<User>({
    queryKey: ["/api/auth/user", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) return null;
        throw new Error('Failed to fetch user data');
      }
      
      return response.json();
    },
    enabled: !!firebaseUser && !firebaseLoading,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Mark as initialized once Firebase auth state is determined
    if (!firebaseLoading) {
      setIsInitialized(true);
    }
  }, [firebaseLoading]);

  const isLoading = firebaseLoading || (!isInitialized) || (firebaseUser && backendLoading);
  const isAuthenticated = !!firebaseUser && !!backendUser;
  
  // Combine Firebase user with backend user data
  const user = firebaseUser && backendUser ? {
    ...backendUser,
    uid: firebaseUser.uid,
    email: firebaseUser.email || backendUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified
  } : null;

  return {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
    error: firebaseError,
  };
}