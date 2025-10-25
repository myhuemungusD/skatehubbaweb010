import { useState, useEffect } from 'react';
import { Camera, Lock, XCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';
import { useSpotAccess } from '../store/useSpotAccess';
import { Badge } from './ui/badge';

interface ARTrickViewerProps {
  spotId: string;
  spotName: string;
  trickId?: string;
  hologramUrl?: string;
  className?: string;
}

export function ARTrickViewer({
  spotId,
  spotName,
  trickId,
  hologramUrl,
  className,
}: ARTrickViewerProps) {
  const { toast } = useToast();
  const { hasValidAccess } = useSpotAccess();
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [arMode, setArMode] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  const hasAccess = hasValidAccess(spotId);

  useEffect(() => {
    checkARSupport();
  }, []);

  const checkARSupport = async () => {
    if ('xr' in navigator) {
      try {
        const isSupported = await (navigator as any).xr?.isSessionSupported('immersive-ar');
        setArSupported(isSupported || false);
      } catch {
        setArSupported(false);
      }
    } else {
      setArSupported(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      return true;
    } catch (error) {
      setCameraPermission('denied');
      toast({
        title: 'Camera Permission Required',
        description: 'Please allow camera access to use AR features.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleEnterAR = async () => {
    if (!hasAccess) {
      toast({
        title: '🔒 Locked',
        description: 'Check in at this spot to unlock AR trick viewer.',
        variant: 'destructive',
      });
      return;
    }

    if (arSupported === false) {
      toast({
        title: 'AR Not Supported',
        description: 'Your device does not support AR features.',
        variant: 'destructive',
      });
      return;
    }

    if (cameraPermission !== 'granted') {
      const granted = await requestCameraPermission();
      if (!granted) return;
    }

    setIsLoadingModel(true);
    setArMode(true);

    setTimeout(() => {
      setIsLoadingModel(false);
      toast({
        title: '🎮 AR Mode Active',
        description: 'Point your camera at a flat surface to view the trick hologram.',
      });
    }, 1500);
  };

  const handleExitAR = () => {
    setArMode(false);
    toast({
      title: 'AR Mode Exited',
      description: 'You can re-enter AR mode anytime.',
    });
  };

  if (!hasAccess) {
    return (
      <Card className={`bg-neutral-900/50 border-gray-700 ${className}`} data-testid="card-ar-locked">
        <CardHeader>
          <CardTitle className="text-gray-300 flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            AR Trick Viewer Locked
          </CardTitle>
          <CardDescription className="text-gray-400">
            Check in at {spotName} to unlock AR hologram tricks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-neutral-950 rounded-lg flex items-center justify-center border border-gray-800">
            <div className="text-center text-gray-500">
              <Lock className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Location-Based Access Required</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (arMode) {
    return (
      <Card className={`bg-black border-orange-500 ${className}`} data-testid="card-ar-active">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500" />
              AR Mode Active
            </span>
            <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              LIVE
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-300">
            {trickId ? `Viewing: ${trickId}` : 'Point camera at flat surface'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-gradient-to-br from-orange-950/30 to-black rounded-lg flex items-center justify-center border border-orange-500/50 relative overflow-hidden">
            {isLoadingModel ? (
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-2" />
                <p className="text-gray-300">Loading hologram...</p>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
                  <div className="relative w-full h-full bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white text-3xl">
                    🛹
                  </div>
                </div>
                <p className="text-gray-300 mb-2">AR Trick Hologram</p>
                <p className="text-sm text-gray-400">
                  Move your device to explore the 3D trick from all angles
                </p>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleExitAR}
            variant="outline"
            className="w-full gap-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
            data-testid="button-exit-ar"
          >
            <XCircle className="w-4 h-4" />
            Exit AR Mode
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-neutral-900/50 border-green-500/50 ${className}`} data-testid="card-ar-unlocked">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-green-500" />
          AR Trick Viewer
        </CardTitle>
        <CardDescription className="text-gray-300">
          View legendary tricks in augmented reality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gradient-to-br from-green-950/30 to-neutral-950 rounded-lg flex items-center justify-center border border-green-500/30">
          <div className="text-center text-gray-400">
            <Camera className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p className="text-sm">Ready to launch AR experience</p>
            {hologramUrl && (
              <p className="text-xs text-gray-500 mt-1">Hologram loaded: {trickId}</p>
            )}
          </div>
        </div>

        {arSupported === false && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-300">
            <p className="font-semibold mb-1">AR Not Available</p>
            <p className="text-xs text-yellow-400">
              Your device doesn't support WebXR. You'll see a 2D preview instead.
            </p>
          </div>
        )}

        <Button
          onClick={handleEnterAR}
          className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
          data-testid="button-enter-ar"
        >
          <Camera className="w-4 h-4" />
          {arSupported ? 'Launch AR Viewer' : 'View 2D Preview'}
        </Button>
      </CardContent>
    </Card>
  );
}
