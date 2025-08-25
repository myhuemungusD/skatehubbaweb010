import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { trackEvent } from "../lib/analytics";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { registerSchema, loginSchema } from "../../../shared/schema";
import type { RegisterInput, LoginInput } from "../../../shared/schema";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Registration mutation with Firebase Auth
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;
      
      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: `${data.firstName} ${data.lastName}`.trim()
      });
      
      // Also create in custom backend for additional data
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          firebaseUid: firebaseUser.uid
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      // Track signup analytics
      trackEvent('sign_up', { method: 'email' });
      
      return { user: firebaseUser, backend: await response.json() };
    },
    onSuccess: (response: any) => {
      toast({
        title: "Account Created! 🎉",
        description: "Your account has been created successfully! Welcome to SkateHubba.",
        variant: "default",
      });
      registerForm.reset();
      // Redirect to home since they're now authenticated
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Login mutation with Firebase Auth fallback to custom
  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      try {
        // Try Firebase authentication first
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const firebaseUser = userCredential.user;
        
        // Get ID token for backend authentication
        const idToken = await firebaseUser.getIdToken();
        
        // Authenticate with backend using Firebase token
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            email: data.email,
            firebaseUid: firebaseUser.uid
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }
        
        // Track login analytics
        trackEvent('login', { method: 'firebase' });
        
        return { user: firebaseUser, backend: await response.json() };
      } catch (firebaseError: any) {
        // If Firebase fails, try custom authentication
        if (firebaseError.code === 'auth/user-not-found' || 
            firebaseError.code === 'auth/wrong-password' ||
            firebaseError.code === 'auth/invalid-credential') {
          
          // Fallback to custom auth
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
          }
          
          // Track login analytics
          trackEvent('login', { method: 'custom' });
          
          const result = await response.json();
          if (result.token) {
            localStorage.setItem('auth_token', result.token);
          }
          return { backend: result };
        } else {
          // Re-throw other Firebase errors
          throw firebaseError;
        }
      }
    },
    onSuccess: (response: any) => {
      toast({
        title: "Welcome back! 🛹",
        description: "You've successfully signed in to SkateHubba.",
        variant: "default",
      });
      setLocation('/');
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

                <div className="text-center">
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