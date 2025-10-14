import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { listenToAuth } from "../lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToAuth((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!user.emailVerified,
  };
}