"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInGoogle, signInEmail, signUpEmail, bootstrap } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await signInGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      if (isSignUp) {
        await signUpEmail(email, password, displayName || "User");
      } else {
        await signInEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main
      className="relative min-h-screen bg-black flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/attached_assets/graffwallskateboardrack_1754296307132.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <Card className="relative z-10 w-full max-w-md bg-black/60 border-gray-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#ff6a00]">SkateHubba</CardTitle>
          <CardDescription className="text-gray-300">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-black hover:bg-gray-100"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black/60 px-2 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-neutral-900 border-gray-700 text-white"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="skater@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-900 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-neutral-900 border-gray-700 text-white"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" className="w-full bg-[#ff6a00] hover:bg-[#e55f00]" size="lg">
              <Mail className="w-4 h-4 mr-2" />
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-gray-400 hover:text-[#24d52b]"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
