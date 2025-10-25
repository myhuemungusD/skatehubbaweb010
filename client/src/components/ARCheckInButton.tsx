import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { useSpotAccess } from '../store/useSpotAccess';
import { apiRequest } from '../lib/queryClient';

interface ARCheckInButtonProps {
  spotId: string;
  spotName: string;
  spotLat: number;
  spotLng: number;
  className?: string;
  onCheckInSuccess?: (access: any) => void;
}

interface CheckInResponse {
  success: boolean;
  message: string;
  access?: {
    spotId: string;
    accessGrantedAt: number;
    expiresAt: number;
    trickId?: string;
    hologramUrl?: string;
  };
  distance?: number;
}

export function ARCheckInButton({
  spotId,
  spotName,
  spotLat,
  spotLng,
  className,
  onCheckInSuccess,
}: ARCheckInButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { grantAccess, hasValidAccess, cleanupExpiredAccess } = useSpotAccess();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const hasAccess = hasValidAccess(spotId);

  const checkInMutation = useMutation({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }) => {
      const response = await apiRequest('POST', '/api/spots/check-in', {
        spotId,
        userId: user?.uid,
        latitude: lat,
        longitude: lng,
      });
      return await response.json() as CheckInResponse;
    },
    onSuccess: (data) => {
      if (data.success && data.access) {
        grantAccess(data.access);
        toast({
          title: '✅ Check-In Successful!',
          description: `You're now checked in at ${spotName}. Access expires in 24 hours.`,
        });
        onCheckInSuccess?.(data.access);
      } else {
        toast({
          title: '❌ Check-In Failed',
          description: data.message || 'Unable to check in at this spot.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: '❌ Check-In Error',
        description: error.message || 'Failed to verify your location. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleCheckIn = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to check in at spots.',
        variant: 'destructive',
      });
      return;
    }

    cleanupExpiredAccess();

    if (hasAccess) {
      toast({
        title: 'Already Checked In',
        description: `You already have valid access to ${spotName}.`,
      });
      return;
    }

    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation Not Supported',
        description: 'Your device does not support geolocation.',
        variant: 'destructive',
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGettingLocation(false);
        const { latitude, longitude } = position.coords;
        checkInMutation.mutate({ lat: latitude, lng: longitude });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Unable to get your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        toast({
          title: 'Location Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const isLoading = isGettingLocation || checkInMutation.isPending;

  if (hasAccess) {
    return (
      <Button
        variant="outline"
        className={`gap-2 border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 ${className}`}
        disabled
        data-testid="button-checked-in"
      >
        <CheckCircle className="w-4 h-4" />
        Checked In
      </Button>
    );
  }

  return (
    <Button
      onClick={handleCheckIn}
      disabled={isLoading || !isAuthenticated}
      className={`gap-2 bg-[#ff6a00] hover:bg-[#ff8533] text-white ${className}`}
      data-testid="button-check-in"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {isGettingLocation ? 'Getting Location...' : 'Verifying...'}
        </>
      ) : (
        <>
          <MapPin className="w-4 h-4" />
          Check In at Spot
        </>
      )}
    </Button>
  );
}
