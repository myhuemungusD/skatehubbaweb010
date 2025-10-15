import { useState } from "react";
import { useLocation } from "wouter";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyPage() {
  const [, setLocation] = useLocation();
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const currentUser = auth.currentUser;
  const userEmail = currentUser?.email || "your email";

  async function handleResendVerification() {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "No user found. Please sign up first.",
        variant: "destructive"
      });
      return;
    }

    setIsResending(true);
    try {
      await sendEmailVerification(currentUser);
      toast({
        title: "Verification email sent! 📧",
        description: "Check your inbox and spam folder."
      });
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        toast({
          title: "Too many requests",
          description: "Please wait a few minutes before trying again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Failed to send email",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 text-orange-500 mr-2 text-4xl">🛹</div>
            <h1 className="text-3xl font-bold text-white">SkateHubba</h1>
          </div>
        </div>

        <Card className="bg-[#232323] border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-2xl text-white">Verify Your Email</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              We sent a verification link to <span className="text-white font-semibold">{userEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-[#181818] rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Step 1: Check your inbox</p>
                  <p className="text-gray-400 text-sm">Look for an email from Firebase</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Step 2: Click the verification link</p>
                  <p className="text-gray-400 text-sm">This will verify your account</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Step 3: Return and sign in</p>
                  <p className="text-gray-400 text-sm">Come back to this page to continue</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-orange-400 font-medium">Can't find the email?</p>
                  <p className="text-gray-400 text-sm">Check your spam folder or request a new one below</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={isResending || !currentUser}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                data-testid="button-resend-verification"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Button
                onClick={() => setLocation("/signin")}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
                data-testid="button-go-to-signin"
              >
                Already Verified? Sign In
              </Button>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setLocation("/")}
                className="text-gray-400 hover:text-white text-sm"
                data-testid="link-back-home"
              >
                ← Back to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
