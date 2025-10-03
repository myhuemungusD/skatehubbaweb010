import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { User, Play, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import type { User as UserType } from '@shared/schema';

export default function Demo() {
  const [, setLocation] = useLocation();
  const [demoUserId, setDemoUserId] = useState<number | null>(null);
  const { toast } = useToast();

  // Create demo user mutation
  const createDemoUserMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/demo-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to create demo user');
      return response.json();
    },
    onSuccess: (user: UserType) => {
      setDemoUserId(user.id);
      toast({
        title: "Demo User Created!",
        description: `Welcome ${user.username}! Ready to start the tutorial.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create demo user. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch demo user data
  const { data: demoUser } = useQuery<UserType>({
    queryKey: [`/api/users/${demoUserId}`],
    enabled: !!demoUserId,
  });

  const handleStartTutorial = () => {
    if (demoUserId) {
      setLocation(`/tutorial?userId=${demoUserId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818]" style={{
      backgroundImage: `url('/attached_assets/graffwallskateboardrack_1754296307132.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="min-h-screen bg-black/70">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="text-[#fafafa] hover:text-orange-400"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#fafafa]">SkateHubba Demo</h1>
              <p className="text-gray-300">Try the interactive tutorial experience</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Welcome Card */}
            <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#fafafa] text-2xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-400/20 text-orange-400">
                    <Play className="w-6 h-6" />
                  </div>
                  Interactive Tutorial Demo
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Experience the complete SkateHubba onboarding flow with our interactive tutorial system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-orange-400 font-semibold text-lg">What you'll learn:</h3>
                  <ul className="space-y-2 text-[#fafafa]">
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400">🗺️</span>
                      <span>Navigate the interactive map and check in at skate spots</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400">🎥</span>
                      <span>Upload your first clip to the Trenches feed</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400">🎨</span>
                      <span>Customize your avatar and digital closet</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400">⚔️</span>
                      <span>Challenge other skaters to S.K.A.T.E. battles</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400">🏆</span>
                      <span>Build your rep and connect with the community</span>
                    </li>
                  </ul>
                </div>

                {!demoUserId ? (
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Create a temporary demo account to experience the full tutorial:
                    </p>
                    <Button
                      onClick={() => createDemoUserMutation.mutate()}
                      disabled={createDemoUserMutation.isPending}
                      className="w-full bg-orange-400 text-black hover:bg-orange-500 font-semibold py-3"
                      data-testid="button-create-demo-user"
                    >
                      {createDemoUserMutation.isPending ? 'Creating Demo User...' : 'Create Demo Account & Start Tutorial'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Demo Account Ready!</span>
                      </div>
                      <p className="text-[#fafafa]">
                        Username: <Badge variant="outline" className="ml-2 border-green-500/50 text-green-400">
                          {demoUser?.username}
                        </Badge>
                      </p>
                      <p className="text-sm text-gray-300 mt-2">
                        Tutorial progress: {demoUser?.onboardingCompleted ? 'Completed' : 'Ready to start'}
                      </p>
                    </div>

                    <Button
                      onClick={handleStartTutorial}
                      className="w-full bg-orange-400 text-black hover:bg-orange-500 font-semibold py-3"
                      data-testid="button-start-tutorial"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Interactive Tutorial
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Preview */}
            <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#fafafa]">Tutorial Features</CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced onboarding system with interactive elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-orange-400/50 text-orange-400">
                      Interactive Guide
                    </Badge>
                    <p className="text-sm text-gray-300">
                      Hands-on learning with tap, swipe, and drag interactions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      Challenge System
                    </Badge>
                    <p className="text-sm text-gray-300">
                      Complete real tasks to unlock features and progress
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      Progress Tracking
                    </Badge>
                    <p className="text-sm text-gray-300">
                      Detailed analytics on user interactions and completion
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      Adaptive Flow
                    </Badge>
                    <p className="text-sm text-gray-300">
                      Skip completed steps and resume where you left off
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Information */}
            <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#fafafa]">Developer Info</CardTitle>
                <CardDescription className="text-gray-300">
                  Backend API endpoints powering the tutorial system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30">GET</Badge>
                    <span className="text-gray-300">/api/tutorial/steps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">POST</Badge>
                    <span className="text-gray-300">/api/users/:id/progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30">PATCH</Badge>
                    <span className="text-gray-300">/api/users/:id/progress/:stepId</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30">PATCH</Badge>
                    <span className="text-gray-300">/api/users/:id/onboarding</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}