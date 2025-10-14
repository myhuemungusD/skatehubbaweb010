import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { Mail } from "lucide-react";

export default function VerifyPage() {
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
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Mail className="w-16 h-16 text-orange-500" />
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription className="text-gray-400">
              We sent you a verification link
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">
              Click the link in your email to activate your account, then come back to sign in.
            </p>
            
            <div className="pt-4 space-y-2">
              <Link href="/signin">
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  data-testid="button-go-to-signin"
                >
                  Go to Sign In
                </Button>
              </Link>
              
              <Link href="/">
                <Button 
                  variant="link" 
                  className="w-full text-gray-400 hover:text-white"
                  data-testid="link-back-home"
                >
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
