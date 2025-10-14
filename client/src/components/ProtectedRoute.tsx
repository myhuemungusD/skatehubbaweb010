import { useEffect, useState } from "react";
import { listenToAuth } from "../lib/auth";
import { Redirect } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    const unsub = listenToAuth((u) => setUser(u));
    return () => unsub();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Redirect to="/signin" />;
  if (!user.emailVerified) return <Redirect to="/verify" />;

  return <>{children}</>;
}
