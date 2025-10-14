import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { applyActionCode, getAuth } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

export default function AuthVerifyPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the action code from URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const oobCode = urlParams.get('oobCode');

        if (mode === 'verifyEmail' && oobCode) {
          // Apply the verification code
          await applyActionCode(auth, oobCode);
          setStatus("success");
          setMessage("Your email has been verified successfully!");
          
          // Auto-redirect to signin after 3 seconds
          setTimeout(() => {
            setLocation("/signin");
          }, 3000);
        } else {
          setStatus("error");
          setMessage("Invalid or expired verification link.");
        }
      } catch (error: any) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage(error.message || "Verification failed. The link may be invalid or expired.");
      }
    };

    verifyEmail();
  }, [setLocation]);

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
          <CardContent className="pt-6">
            {status === "loading" && (
              <div className="text-center py-8">
                <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
                <p className="text-gray-400">Please wait while we verify your email address.</p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Email Verified! ✅</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <p className="text-gray-400 text-sm mb-4">Redirecting to sign in...</p>
                <Link href="/signin">
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    data-testid="button-goto-signin"
                  >
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-8">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="space-y-2">
                  <Link href="/signup">
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      data-testid="button-try-again"
                    >
                      Try Signing Up Again
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                      data-testid="button-back-home"
                    >
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
