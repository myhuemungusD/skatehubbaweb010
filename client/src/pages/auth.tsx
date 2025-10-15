import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../lib/firebase";
import { trackEvent } from "../lib/analytics";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { registerSchema, loginSchema } from "../../../shared/schema";
import type { RegisterInput, LoginInput } from "../../../shared/schema";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  // Registration form
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  // Login form
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Registration mutation - Firebase-only with email verification
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      // 1. Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // 2. Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: `${data.firstName} ${data.lastName}`.trim()
      });

      // 3. Send email verification (without custom URL to avoid domain allowlist issues)
      const { sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(firebaseUser);

      trackEvent('sign_up', { method: 'firebase' });
      return firebaseUser;
    },
    onSuccess: () => {
      toast({
        title: "Verification Email Sent! 📧",
        description: "Check your email to verify your account before logging in.",
        variant: "default",
      });
      registerForm.reset();
      // Redirect to verify page
      setLocation('/verify');
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Login mutation - Firebase-only with email verification check
  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // 2. Check email verification
      if (!firebaseUser.emailVerified) {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
        throw new Error("Please verify your email before logging in.");
      }

      trackEvent('login', { method: 'firebase' });
      return firebaseUser;
    },
    onSuccess: () => {
      toast({
        title: "Welcome back! 🛹",
        description: "You've successfully signed in.",
        variant: "default",
      });
      // Force reload to refresh auth state
      window.location.href = '/';
    },
    onError: (error: any) => {
      toast({
        title: "Sign In Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onRegister = (data: RegisterInput) => {
    registerMutation.mutate(data);
  };

  const onLogin = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Get ID token and authenticate with backend
      const idToken = await firebaseUser.getIdToken();
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      toast({ 
        title: "Welcome! 🛹",
        description: "You've successfully signed in with Google."
      });
      trackEvent('login', { method: 'google' });
      window.location.href = "/";
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

  // Phone Authentication
  const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    });
  };

  const handleSendCode = async () => {
    setIsPhoneLoading(true);
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
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
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsPhoneLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const firebaseUser = userCredential.user;
      
      // Get ID token and authenticate with backend
      const idToken = await firebaseUser.getIdToken();
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      toast({ 
        title: "Welcome! 🛹",
        description: "You've successfully signed in."
      });
      trackEvent('login', { method: 'phone' });
      window.location.href = "/";
    } catch (err: any) {
      toast({ 
        title: "Verification failed", 
        description: "Invalid code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPhoneLoading(false);
    }
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
          <p className="text-gray-400">Join the skateboarding community</p>
        </div>

        <Card className="bg-[#232323] border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Get Started</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Sign in or create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#181818]">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-orange-500">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-orange-500">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                        {...loginForm.register("email")}
                        data-testid="input-login-email"
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-400">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                        {...loginForm.register("password")}
                        data-testid="input-login-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-400">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={loginMutation.isPending}
                    data-testid="button-login"
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="mx-3 text-gray-400 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || loginMutation.isPending}
                  className="w-full bg-white hover:bg-gray-100 text-black font-semibold flex items-center justify-center gap-2"
                  data-testid="button-google-signin"
                >
                  <SiGoogle className="w-5 h-5" />
                  {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
                </Button>

                <div className="my-6 border-t border-gray-600"></div>

                <h3 className="text-center text-orange-500 font-semibold mb-4">
                  Or sign in with phone
                </h3>

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
                        disabled={isPhoneLoading || !phone}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        data-testid="button-send-code"
                      >
                        {isPhoneLoading ? "Sending..." : "Send Code"}
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
                        disabled={isPhoneLoading || !otp}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        data-testid="button-verify-code"
                      >
                        {isPhoneLoading ? "Verifying..." : "Verify & Sign In"}
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

                <div className="text-center mt-4">
                  <Button variant="link" className="text-orange-400 hover:text-orange-300" data-testid="link-forgot-password">
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName" className="text-white">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-firstName"
                          type="text"
                          placeholder="John"
                          className="pl-10 bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                          {...registerForm.register("firstName")}
                          data-testid="input-register-firstName"
                        />
                      </div>
                      {registerForm.formState.errors.firstName && (
                        <p className="text-sm text-red-400">{registerForm.formState.errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-lastName" className="text-white">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-lastName"
                          type="text"
                          placeholder="Doe"
                          className="pl-10 bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                          {...registerForm.register("lastName")}
                          data-testid="input-register-lastName"
                        />
                      </div>
                      {registerForm.formState.errors.lastName && (
                        <p className="text-sm text-red-400">{registerForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                        {...registerForm.register("email")}
                        data-testid="input-register-email"
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-400">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        className="pl-10 pr-10 bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                        {...registerForm.register("password")}
                        data-testid="input-register-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        data-testid="button-toggle-register-password"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-400">{registerForm.formState.errors.password.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Must contain at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="text-center text-xs text-gray-500">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </div>
              </TabsContent>
            </Tabs>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link to="/">
                <Button variant="link" className="text-gray-400 hover:text-white" data-testid="link-back-home">
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}