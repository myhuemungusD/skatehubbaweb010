import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  // Get token from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      return apiRequest('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },
    onSuccess: (response: any) => {
      setVerificationStatus('success');
      setMessage(response.message || 'Email verified successfully!');
      toast({
        title: "Email Verified! ✅",
        description: "You can now sign in to your account.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      setVerificationStatus('error');
      setMessage(error.message || 'Email verification failed.');
      toast({
        title: "Verification Failed",
        description: error.message || "The verification link may be expired or invalid.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    } else {
      setVerificationStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  const handleSignIn = () => {
    setLocation('/auth');
  };

  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 text-orange-500 mr-2 text-4xl">🛹</div>
            <h1 className="text-3xl font-bold text-white">SkateHubba</h1>
          </div>
        </div>

        <Card className="bg-[#232323] border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {verificationStatus === 'pending' && (
                <Mail className="h-16 w-16 text-orange-500 animate-pulse" />
              )}
              {verificationStatus === 'success' && (
                <CheckCircle className="h-16 w-16 text-green-500" />
              )}
              {verificationStatus === 'error' && (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl text-white">
              {verificationStatus === 'pending' && "Verifying Email..."}
              {verificationStatus === 'success' && "Email Verified!"}
              {verificationStatus === 'error' && "Verification Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-300">
              {verificationStatus === 'pending' && "Please wait while we verify your email address..."}
              {message || "We're processing your email verification."}
            </p>

            {verificationStatus === 'success' && (
              <div className="space-y-4">
                <p className="text-green-400 text-sm">
                  🎉 Welcome to the SkateHubba community! Your account is now active.
                </p>
                <Button
                  onClick={handleSignIn}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  data-testid="button-sign-in"
                >
                  Sign In to Your Account
                </Button>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="space-y-4">
                <p className="text-red-400 text-sm">
                  The verification link may be expired or invalid. Please try signing up again or contact support.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={handleSignIn}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    data-testid="button-try-again"
                  >
                    Try Sign In
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    data-testid="button-go-home"
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            )}

            {verificationStatus === 'pending' && (
              <Button
                onClick={handleGoHome}
                variant="link"
                className="text-gray-400 hover:text-white"
                data-testid="button-back-home"
              >
                ← Back to Home
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}