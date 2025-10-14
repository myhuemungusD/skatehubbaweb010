import { useEffect } from "react";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export default function VerifiedPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLocation("/signin"), 3000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-center p-4">
      <Card className="bg-[#232323] border-gray-700 w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Email Verified! ✅</h1>
          <p className="text-gray-400">
            Your email has been successfully verified. You can now sign in.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to sign in page...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
