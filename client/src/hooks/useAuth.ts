import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { listenToAuth } from "../lib/auth";

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
