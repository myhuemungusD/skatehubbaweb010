import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, Trophy, Star, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function ClosetPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('tricks');

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['/api/inventory', user?.uid],
    enabled: !!user?.uid,
  });

  const trickCollectibles = [
    {
      id: 'kickflip-gold',
      name: 'Golden Kickflip',
      description: 'Mastered the perfect kickflip',
      rarity: 'legendary',
      owned: true,
      image: '🏆',
    },
    {
      id: 'heelflip-silver',
      name: 'Silver Heelflip',
      description: 'Consistent heelflip execution',
      rarity: 'rare',
      owned: true,
      image: '⭐',
    },
    {
      id: 'tre-flip-bronze',
      name: 'Bronze Tre Flip',
      description: 'Landing tre flips regularly',
      rarity: 'uncommon',
      owned: false,
      image: '🥉',
    },
    {
      id: 'manual-master',
      name: 'Manual Master',
      description: 'Hold manuals for 50+ feet',
      rarity: 'rare',
      owned: true,
      image: '🎯',
    },
  ];

  const achievements = [
    {
      id: 'first-win',
      name: 'First Victory',
      description: 'Won your first S.K.A.T.E. game',
      earned: true,
      date: '2024-01-15',
    },
    {
      id: 'spot-hunter',
      name: 'Spot Hunter',
      description: 'Checked in at 10 different spots',
      earned: true,
      date: '2024-02-20',
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Win 5 games in a row',
      earned: false,
      date: null,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-orange-500/20 border-orange-500 text-orange-400';
      case 'rare':
        return 'bg-purple-500/20 border-purple-500 text-purple-400';
      case 'uncommon':
        return 'bg-blue-500/20 border-blue-500 text-blue-400';
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#181818]">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-[#fafafa] mb-4">Login Required</h2>
          <p className="text-gray-300">Please log in to view your closet and collectibles.</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-[#fafafa] mb-2">Your Closet</h1>
            <p className="text-gray-300">Manage your trick collectibles and achievements</p>
          </div>

          <Tabs defaultValue="tricks" className="w-full">
            <TabsList className="bg-neutral-900 border-neutral-700">
              <TabsTrigger
                value="tricks"
                className="data-[state=active]:bg-[#ff6a00] data-[state=active]:text-black"
                data-testid="tab-tricks"
              >
                <Package className="w-4 h-4 mr-2" />
                Trick Collectibles
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-[#ff6a00] data-[state=active]:text-black"
                data-testid="tab-achievements"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tricks" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trickCollectibles.map((trick) => (
                  <Card
                    key={trick.id}
                    className={`${
                      trick.owned
                        ? 'bg-black/60 border-gray-600 backdrop-blur-sm'
                        : 'bg-black/30 border-gray-700 opacity-60'
                    }`}
                    data-testid={`card-trick-${trick.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="text-5xl">{trick.image}</div>
                        {!trick.owned && <Lock className="w-5 h-5 text-gray-500" />}
                      </div>
                      <CardTitle className="text-[#fafafa] flex items-center gap-2">
                        {trick.name}
                        <Badge className={getRarityColor(trick.rarity)} variant="outline">
                          {trick.rarity}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {trick.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {trick.owned ? (
                        <Badge className="bg-[#24d52b]/20 text-[#24d52b] border-[#24d52b]/30">
                          <Star className="w-3 h-3 mr-1" />
                          Owned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 border-gray-600">
                          Locked
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`${
                      achievement.earned
                        ? 'bg-black/60 border-gray-600 backdrop-blur-sm'
                        : 'bg-black/30 border-gray-700 opacity-60'
                    }`}
                    data-testid={`card-achievement-${achievement.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Trophy
                          className={`w-8 h-8 ${
                            achievement.earned ? 'text-[#ff6a00]' : 'text-gray-600'
                          }`}
                        />
                        {achievement.earned ? (
                          <Badge className="bg-[#24d52b]/20 text-[#24d52b] border-[#24d52b]/30">
                            Earned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-600">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-[#fafafa]">{achievement.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {achievement.description}
                      </CardDescription>
                    </CardHeader>
                    {achievement.earned && achievement.date && (
                      <CardContent>
                        <p className="text-sm text-gray-400">Earned on {achievement.date}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
