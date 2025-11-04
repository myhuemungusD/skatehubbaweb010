import { useAuth } from "../hooks/useAuth";
import { Redirect } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireEmailVerification = false 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;
  
  // Only require email verification if explicitly requested and user is not anonymous
  if (requireEmailVerification && !user.isAnonymous && !user.emailVerified) {
    return <Redirect to="/verify" />;
  }

  return <>{children}</>;
}

