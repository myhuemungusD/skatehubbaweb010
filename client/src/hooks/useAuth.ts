import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { listenToAuth } from "../lib/auth";

/**
 * Determines if a Firebase user is authenticated for the application.
 * @param user - The Firebase user object or null
 * @returns true if the user is authenticated, false otherwise
 * 
 * Authentication criteria:
 * - Anonymous users are authenticated (allows guest browsing)
 * - Users with verified emails are authenticated
 * - Users authenticated via OAuth providers (Google, phone, etc.) are authenticated
 *   (bypassing email verification as the provider has already verified their identity)
 */
function isFirebaseUserAuthenticated(user: User | null): boolean {
  if (!user) {
    return false;
  }

  if (user.isAnonymous) {
    return true;
  }

  if (user.emailVerified) {
    return true;
  }

  return user.providerData.some((provider) => provider.providerId !== "password");
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToAuth((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = useMemo(() => isFirebaseUserAuthenticated(user), [user]);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
