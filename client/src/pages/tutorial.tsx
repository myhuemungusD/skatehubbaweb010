import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import Navigation from '../components/Navigation';
import { CheckCircle, PlayCircle, Target, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import type { TutorialStep, User, UserProgress } from '@shared/schema';

interface TutorialProps {
  userId: string;
}

export default function Tutorial({ userId }: TutorialProps) {
  const [, setLocation] = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [interactionData, setInteractionData] = useState({
    taps: 0,
    swipes: 0,
    mistakes: 0,
    helpUsed: false,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
  });

  // Fetch tutorial steps
  const { data: tutorialSteps, isLoading: stepsLoading } = useQuery<TutorialStep[]>({
    queryKey: ['/api/tutorial/steps'],
  });

  // Fetch user progress
  const { data: userProgress } = useQuery<UserProgress[]>({
    queryKey: [`/api/users/${userId}/progress`],
  });

  // Update user progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ stepId, updates }: { stepId: number; updates: any }) => {
      const response = await fetch(`/api/users/${userId}/progress/${stepId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update progress');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
    },
  });

  // Create user progress mutation
  const createProgressMutation = useMutation({
    mutationFn: async ({ stepId }: { stepId: number }) => {
      const response = await fetch(`/api/users/${userId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId,
          completed: false,
          timeSpent: 0,
          interactionData,
        }),
      });
      if (!response.ok) throw new Error('Failed to create progress');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
    },
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${userId}/onboarding`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: true,
          currentStep: tutorialSteps?.length || 0,
        }),
      });
      if (!response.ok) throw new Error('Failed to complete onboarding');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tutorial Completed! 🎉",
        description: "Welcome to SkateHubba! You're ready to start your skating journey.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      setTimeout(() => setLocation('/'), 2000);
    },
  });

  const currentStep = tutorialSteps?.[currentStepIndex];
  const currentProgress = userProgress?.find(p => p.stepId === currentStep?.id);
  const totalSteps = tutorialSteps?.length || 0;
  const completedSteps = userProgress?.filter(p => p.completed).length || 0;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  useEffect(() => {
    // Create progress entry for current step if it doesn't exist
    if (currentStep && !currentProgress) {
      createProgressMutation.mutate({ stepId: currentStep.id });
    }
  }, [currentStep?.id, currentProgress]);

  const handleInteraction = (type: 'tap' | 'swipe' | 'drag') => {
    setInteractionData(prev => {
      const key = type === 'drag' ? 'taps' : type + 's';
      const currentValue = prev[key as keyof typeof prev] as number;
      return {
        ...prev,
        [key]: currentValue + 1,
      };
    });
  };

  const handleStepComplete = () => {
    if (!currentStep) return;

    updateProgressMutation.mutate({
      stepId: currentStep.id,
      updates: {
        completed: true,
        timeSpent: 60, // Mock time spent
        interactionData,
      },
    });

    toast({
      title: "Step Completed!",
      description: currentStep.title,
    });

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeOnboardingMutation.mutate();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'intro':
        return <PlayCircle className="w-6 h-6" />;
      case 'interactive':
        return <Target className="w-6 h-6" />;
      case 'challenge':
        return <Users className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  if (stepsLoading) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <div className="text-[#fafafa]">Loading tutorial...</div>
      </div>
    );
  }

  if (!tutorialSteps || tutorialSteps.length === 0) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <div className="text-center text-[#fafafa]">
          <h2 className="text-2xl font-bold mb-4">No Tutorial Available</h2>
          <Button onClick={() => setLocation('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818]" style={{
      backgroundImage: `url('/attached_assets/graffwallskateboardrack_1754296307132.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Navigation />
      <div className="min-h-screen bg-black/70">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#fafafa]">SkateHubba Tutorial</h1>
              <p className="text-gray-300">Learn the basics and get started</p>
            </div>
            <Badge variant="secondary" className="bg-orange-400/20 text-orange-400 border-orange-400/30">
              {completedSteps} / {totalSteps} Complete
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Overall Progress</span>
              <span className="text-sm text-orange-400 font-semibold">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-gray-700"
              data-testid="progress-overall"
            />
          </div>

          {/* Tutorial Step */}
          {currentStep && (
            <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-400/20 text-orange-400">
                    {getStepIcon(currentStep.type)}
                  </div>
                  <div>
                    <CardTitle className="text-[#fafafa] text-xl">
                      {currentStep.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Step {currentStepIndex + 1} of {totalSteps} • {currentStep.type}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-[#fafafa] text-lg">{currentStep.description}</p>

                {/* Interactive Elements */}
                {currentStep.type === 'interactive' && currentStep.content?.interactiveElements && (
                  <div className="space-y-4">
                    <h4 className="text-orange-400 font-semibold">Interactive Guide:</h4>
                    <div className="grid gap-4">
                      {currentStep.content.interactiveElements.map((element, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/30"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="border-orange-400/50 text-orange-400">
                              {element.type}
                            </Badge>
                            <span className="text-sm text-gray-300">Target: {element.target}</span>
                          </div>
                          <p className="text-[#fafafa]">{element.instruction}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-3 border-orange-400/50 text-orange-400 hover:bg-orange-400/20"
                            onClick={() => handleInteraction(element.type)}
                            data-testid={`button-${element.type}-${element.target}`}
                          >
                            Practice {element.type}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenge Elements */}
                {currentStep.type === 'challenge' && currentStep.content?.challengeData && (
                  <div className="space-y-4">
                    <h4 className="text-orange-400 font-semibold">Challenge:</h4>
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <p className="text-[#fafafa] mb-2">
                        <strong>Action:</strong> {currentStep.content.challengeData.action}
                      </p>
                      <p className="text-gray-300">
                        <strong>Goal:</strong> {currentStep.content.challengeData.expectedResult}
                      </p>
                    </div>
                  </div>
                )}

                {/* Video Content */}
                {currentStep.type === 'intro' && currentStep.content?.videoUrl && (
                  <div className="space-y-4">
                    <h4 className="text-orange-400 font-semibold">Watch Introduction:</h4>
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <PlayCircle className="w-16 h-16 mx-auto mb-2" />
                        <p>Video: {currentStep.content.videoUrl}</p>
                        <p className="text-sm">(Video player would be implemented here)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-600">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    data-testid="button-previous-step"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setInteractionData(prev => ({ ...prev, helpUsed: true }))}
                      className="border-orange-400/50 text-orange-400 hover:bg-orange-400/20"
                      data-testid="button-help"
                    >
                      Need Help?
                    </Button>
                    
                    {currentStepIndex === totalSteps - 1 ? (
                      <Button
                        onClick={handleStepComplete}
                        className="bg-orange-400 text-black hover:bg-orange-500"
                        data-testid="button-complete-tutorial"
                      >
                        Complete Tutorial
                      </Button>
                    ) : (
                      <Button
                        onClick={handleStepComplete}
                        className="bg-orange-400 text-black hover:bg-orange-500"
                        data-testid="button-complete-step"
                      >
                        Complete Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Steps Overview */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-[#fafafa] mb-4">Tutorial Steps</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorialSteps.map((step, index) => {
                const stepProgress = userProgress?.find(p => p.stepId === step.id);
                const isCompleted = stepProgress?.completed || false;
                const isCurrent = index === currentStepIndex;

                return (
                  <Card 
                    key={step.id} 
                    className={`cursor-pointer transition-all ${
                      isCurrent 
                        ? 'bg-orange-400/20 border-orange-400' 
                        : isCompleted
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-black/40 border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setCurrentStepIndex(index)}
                    data-testid={`card-step-${step.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isCompleted 
                            ? 'bg-green-500/20 text-green-400' 
                            : isCurrent
                            ? 'bg-orange-400/20 text-orange-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : getStepIcon(step.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#fafafa] text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-400">Step {index + 1} • {step.type}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}