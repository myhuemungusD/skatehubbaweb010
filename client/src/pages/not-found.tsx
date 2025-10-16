import { Card, CardContent } from "../components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#181818]">
      <Card className="w-full max-w-md mx-4 bg-[#232323] border-gray-700">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-white">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            This page doesn't exist or may have been moved.
          </p>

          <Link href="/">
            <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white" data-testid="button-home">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
