import { useState } from "react";
import { useLocation } from "wouter";
import { SiGoogle } from "react-icons/si";
import { UserCircle } from "lucide-react";
import { loginWithGoogle, loginAnonymously } from "../lib/auth";
import { trackEvent } from "../lib/analytics";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Welcome! 🛹",
        description: "You've successfully signed in with Google."
      });
      trackEvent('login', { method: 'google' });
      setLocation("/");
    } catch (err: any) {
      toast({ 
        title: "Google sign-in failed", 
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsAnonymousLoading(true);
    try {
      await loginAnonymously();
      toast({
        title: "Welcome! 🛹",
        description: "You've signed in as a guest."
      });
      trackEvent('login', { method: 'anonymous' });
      setLocation("/");
    } catch (err: any) {
      toast({ 
        title: "Guest sign-in failed", 
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsAnonymousLoading(false);
    }
  };

  const isLoading = isGoogleLoading || isAnonymousLoading;

  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 text-orange-500 mr-2 text-4xl">🛹</div>
            <h1 className="text-3xl font-bold text-white">SkateHubba</h1>
          </div>
          <p className="text-gray-400">Sign in to continue</p>
        </div>

        <Card className="bg-[#232323] border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Welcome Back</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Choose how you'd like to sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign-In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold flex items-center justify-center gap-2 h-12"
              data-testid="button-google-signin"
            >
              <SiGoogle className="w-5 h-5" />
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            {/* Anonymous Sign-In Button */}
            <Button
              onClick={handleAnonymousSignIn}
              disabled={isLoading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold flex items-center justify-center gap-2 h-12"
              data-testid="button-anonymous-signin"
            >
              <UserCircle className="w-5 h-5" />
              {isAnonymousLoading ? "Signing in..." : "Continue as Guest"}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>

            {/* Link to Full Auth Page */}
            <div className="text-center mt-6 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">
                Need to create an account?
              </p>
              <Button
                onClick={() => setLocation("/auth")}
                variant="link"
                className="text-orange-400 hover:text-orange-300"
                data-testid="link-full-auth"
              >
                Sign up with email →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
