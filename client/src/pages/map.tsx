import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Users, CheckCircle, Star, Navigation as NavigationIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { apiRequest, queryClient } from '../lib/queryClient';
import { ARCheckInButton } from '../components/ARCheckInButton';
import { ARTrickViewer } from '../components/ARTrickViewer';

interface SkateSpot {
  id: string;
  name: string;
  address: string;
  type: string;
  difficulty: string;
  checkins: number;
  recentUsers: string[];
  lat: number;
  lng: number;
  description: string;
}

export default function MapPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedSpot, setSelectedSpot] = useState<SkateSpot | null>(null);

  const spots: SkateSpot[] = [
    {
      id: 'spot-1',
      name: 'Downtown Rails',
      address: '123 Main St, Downtown',
      type: 'Rails',
      difficulty: 'Intermediate',
      checkins: 247,
      recentUsers: ['Mike', 'Sarah', 'Tony'],
      lat: 40.7128,
      lng: -74.0060,
      description: 'Perfect flat rails with smooth run-up. Popular spot for technical tricks.',
    },
    {
      id: 'spot-2',
      name: 'City Plaza Stairs',
      address: '456 Plaza Blvd',
      type: 'Stairs',
      difficulty: 'Advanced',
      checkins: 189,
      recentUsers: ['Jake', 'Emma'],
      lat: 40.7589,
      lng: -73.9851,
      description: '12-stair set with handrails on both sides. Requires commitment.',
    },
    {
      id: 'spot-3',
      name: 'Riverside Park',
      address: '789 River Rd',
      type: 'Park',
      difficulty: 'Beginner',
      checkins: 512,
      recentUsers: ['Alex', 'Chris', 'Jordan', 'Pat'],
      lat: 40.7829,
      lng: -73.9654,
      description: 'Smooth concrete park with multiple features. Great for beginners and practice.',
    },
    {
      id: 'spot-4',
      name: 'Industrial Ledges',
      address: '321 Warehouse Ave',
      type: 'Ledges',
      difficulty: 'Intermediate',
      checkins: 156,
      recentUsers: ['Riley', 'Sam'],
      lat: 40.7489,
      lng: -73.9680,
      description: 'Variety of ledge heights with perfect wax. Watch for security.',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div
      className="min-h-screen bg-[#181818]"
      style={{
        backgroundImage: `url('/attached_assets/graffwallskateboardrack_1754296307132.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navigation />
      <div className="min-h-screen bg-black/70">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#fafafa] mb-2 flex items-center gap-2">
              <MapPin className="w-10 h-10 text-[#ff6a00]" />
              Skate Spots Map
            </h1>
            <p className="text-gray-300">Find and check in at local skate spots</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#fafafa]">Nearby Spots</h2>
              {spots.map((spot) => (
                <Card
                  key={spot.id}
                  className={`bg-black/60 border-gray-600 backdrop-blur-sm cursor-pointer transition-all hover:border-[#ff6a00] ${
                    selectedSpot?.id === spot.id ? 'border-[#ff6a00] ring-2 ring-[#ff6a00]/50' : ''
                  }`}
                  onClick={() => setSelectedSpot(spot)}
                  data-testid={`card-spot-${spot.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-[#fafafa] flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#ff6a00]" />
                          {spot.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-1">
                          {spot.address}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getDifficultyColor(spot.difficulty)}>
                        {spot.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {spot.checkins} check-ins
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {spot.recentUsers.length} active
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-neutral-800/50 text-gray-300 border-gray-600">
                        {spot.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              {selectedSpot ? (
                <Card className="bg-black/60 border-gray-600 backdrop-blur-sm sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-[#fafafa] text-2xl flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-[#ff6a00]" />
                      {selectedSpot.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {selectedSpot.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-gray-700">
                      <div className="text-center text-gray-400">
                        <NavigationIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Map view coming soon</p>
                        <p className="text-sm mt-1">
                          {selectedSpot.lat.toFixed(4)}, {selectedSpot.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[#fafafa] font-semibold mb-2">Description</h3>
                      <p className="text-gray-300">{selectedSpot.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Type</p>
                        <p className="text-[#fafafa] font-semibold">{selectedSpot.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Difficulty</p>
                        <Badge variant="outline" className={getDifficultyColor(selectedSpot.difficulty)}>
                          {selectedSpot.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[#fafafa] font-semibold mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Recently Active
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpot.recentUsers.map((user, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-neutral-800/50 text-gray-300 border-gray-600"
                          >
                            {user}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <ARCheckInButton
                      spotId={selectedSpot.id}
                      spotName={selectedSpot.name}
                      spotLat={selectedSpot.lat}
                      spotLng={selectedSpot.lng}
                      className="w-full"
                    />

                    <ARTrickViewer
                      spotId={selectedSpot.id}
                      spotName={selectedSpot.name}
                    />

                    <div className="text-center">
                      <p className="text-sm text-gray-400">
                        <Star className="w-4 h-4 inline mr-1 text-[#24d52b]" />
                        {selectedSpot.checkins} total check-ins
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
                  <CardContent className="py-12 text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl text-[#fafafa] mb-2">Select a Spot</h3>
                    <p className="text-gray-400">Click on a spot to view details and check in</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
