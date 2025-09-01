import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";

export function useAuth() {
  const [firebaseUser, firebaseLoading, firebaseError] = useAuthState(auth);
  const [isInitialized, setIsInitialized] = useState(false);

  // Query backend user data using Firebase ID token
  const { data: backendUser, isLoading: backendLoading } = useQuery({
    queryKey: ["/api/auth/me", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;

      try {
        const idToken = await firebaseUser.getIdToken();
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          return response.json();
        }

        return null;
      } catch (error) {
        // Silently handle auth errors in production
        if (import.meta.env.DEV)
          console.warn("Failed to get user data:", error);
        return null;
      }
    },
    enabled: !firebaseLoading && !!firebaseUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Mark as initialized once Firebase auth state is determined
    if (!firebaseLoading) {
      setIsInitialized(true);
    }
  }, [firebaseLoading]);

  const isLoading =
    firebaseLoading || !isInitialized || (firebaseUser && backendLoading);

  // User is authenticated if we have both Firebase user and backend user data
  const isAuthenticated = !!firebaseUser && !!backendUser?.user;

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
