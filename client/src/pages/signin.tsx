import { useState } from "react";
import { loginUser, loginWithGoogle, setupRecaptcha, sendPhoneVerification, verifyPhoneCode } from "../lib/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Link } from "wouter";
import { Mail, Lock } from "lucide-react";
import { SiGoogle } from "react-icons/si";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginUser(email, password);
      toast({ 
        title: "Welcome back! 🛹",
        description: "You've successfully signed in."
      });
      window.location.href = "/";
    } catch (err: any) {
      const errorMessage = err.message;
      
      // Special handling for email verification error
      if (errorMessage.includes("verify your email")) {
        toast({ 
          title: "Email Not Verified", 
          description: "Please check your inbox and click the verification link. ",
          variant: "destructive",
          duration: 15000, // 15 seconds for action toasts
          action: (
            <button
              onClick={() => window.location.href = "/verify"}
              className="text-orange-400 underline font-semibold hover:text-orange-300"
              data-testid="button-toast-resend-email"
            >
              Resend Email
            </button>
          )
        });
      } else {
        toast({ 
          title: "Login failed", 
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      toast({ 
        title: "Welcome back! 🛹",
        description: "You've successfully signed in with Google."
      });
      window.location.href = "/";
    } catch (err: any) {
      toast({ 
        title: "Google sign-in failed", 
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendCode() {
    setIsLoading(true);
    
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");
      const confirmation = await sendPhoneVerification(phone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowOtp(true);
      toast({ 
        title: "Code sent! 📱",
        description: "Check your phone for the verification code."
      });
    } catch (err: any) {
      toast({ 
        title: "Failed to send code", 
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyCode() {
    setIsLoading(true);
    
    try {
      await verifyPhoneCode(confirmationResult, otp);
      toast({ 
        title: "Welcome back! 🛹",
        description: "You've successfully signed in."
      });
      window.location.href = "/";
    } catch (err: any) {
      toast({ 
        title: "Verification failed", 
        description: "Invalid code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
          <p className="text-gray-400">Welcome back, skater!</p>
        </div>

        <Card className="bg-[#232323] border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Sign In</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                    data-testid="input-signin-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                    data-testid="input-signin-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
                data-testid="button-signin-submit"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold flex items-center justify-center gap-2"
              data-testid="button-signin-google"
            >
              <SiGoogle className="w-5 h-5" />
              Sign in with Google
            </Button>

            <div className="my-6 border-t border-gray-600"></div>

            <h2 className="text-center text-orange-500 font-semibold mb-4">
              Or sign in with phone
            </h2>

            <div className="space-y-3">
              {!showOtp ? (
                <>
                  <Input
                    type="tel"
                    placeholder="+1 760 555 1234"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                    data-testid="input-phone"
                  />
                  <Button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isLoading || !phone}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    data-testid="button-send-code"
                  >
                    {isLoading ? "Sending..." : "Send Code"}
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                    data-testid="input-otp"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading || !otp}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    data-testid="button-verify-code"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowOtp(false);
                      setOtp("");
                    }}
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white"
                    data-testid="button-change-phone"
                  >
                    Change phone number
                  </Button>
                </>
              )}
              <div id="recaptcha-container"></div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-semibold" data-testid="link-to-signup">
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/">
                <span className="text-gray-400 hover:text-white cursor-pointer inline-block" data-testid="link-back-home">
                  ← Back to Home
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
