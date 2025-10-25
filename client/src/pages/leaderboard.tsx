import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Trophy, Medal, TrendingUp, MapPin, Award, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  totalCheckIns: number;
  spotsVisited: number;
  tricksUnlocked: number;
  points: number;
  streak: number;
  profileImage?: string;
  isPro?: boolean;
}

export default function LeaderboardPage() {
  const { user } = useAuth();

  // Mock data - in production this would come from API
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: '1',
      username: '@tony_sk8',
      displayName: 'Tony Martinez',
      totalCheckIns: 342,
      spotsVisited: 89,
      tricksUnlocked: 127,
      points: 15420,
      streak: 45,
      isPro: true,
    },
    {
      rank: 2,
      userId: '2',
      username: '@sarah_shreds',
      displayName: 'Sarah Chen',
      totalCheckIns: 298,
      spotsVisited: 76,
      tricksUnlocked: 104,
      points: 13890,
      streak: 32,
      isPro: true,
    },
    {
      rank: 3,
      userId: '3',
      username: '@mike_rails',
      displayName: 'Mike Johnson',
      totalCheckIns: 256,
      spotsVisited: 65,
      tricksUnlocked: 98,
      points: 12140,
      streak: 28,
    },
    {
      rank: 4,
      userId: '4',
      username: '@emma_flip',
      displayName: 'Emma Rodriguez',
      totalCheckIns: 234,
      spotsVisited: 58,
      tricksUnlocked: 87,
      points: 10980,
      streak: 21,
    },
    {
      rank: 5,
      userId: '5',
      username: '@alex_grind',
      displayName: 'Alex Kim',
      totalCheckIns: 221,
      spotsVisited: 54,
      tricksUnlocked: 79,
      points: 10230,
      streak: 19,
    },
    {
      rank: 6,
      userId: '6',
      username: '@chris_pop',
      displayName: 'Chris Taylor',
      totalCheckIns: 198,
      spotsVisited: 49,
      tricksUnlocked: 73,
      points: 9140,
      streak: 15,
    },
    {
      rank: 7,
      userId: '7',
      username: '@jordan_kick',
      displayName: 'Jordan Lee',
      totalCheckIns: 187,
      spotsVisited: 45,
      tricksUnlocked: 68,
      points: 8560,
      streak: 12,
    },
    {
      rank: 8,
      userId: '8',
      username: '@riley_manual',
      displayName: 'Riley Brooks',
      totalCheckIns: 176,
      spotsVisited: 42,
      tricksUnlocked: 64,
      points: 8020,
      streak: 10,
    },
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-400';
      case 3:
        return 'from-orange-600 to-orange-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return null;
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
              <Trophy className="w-10 h-10 text-[#ff6a00]" />
              Legendary Spot Leaderboard
            </h1>
            <p className="text-gray-300">Top skaters ranked by check-ins, spots, and tricks unlocked</p>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {leaderboardData.slice(0, 3).map((entry) => (
              <Card
                key={entry.userId}
                className={`bg-gradient-to-br ${getRankColor(entry.rank)} border-none text-white relative overflow-hidden`}
                data-testid={`card-podium-${entry.rank}`}
              >
                <div className="absolute top-0 right-0 opacity-10">
                  <Trophy className="w-32 h-32" />
                </div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      #{entry.rank}
                    </Badge>
                    {getRankIcon(entry.rank)}
                  </div>
                  <CardTitle className="text-xl">{entry.displayName}</CardTitle>
                  <CardDescription className="text-white/80 flex items-center gap-1">
                    {entry.username}
                    {entry.isPro && (
                      <Badge variant="outline" className="bg-orange-500/30 text-white border-orange-400 text-xs ml-1">
                        PRO
                      </Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Points:</span>
                      <span className="font-bold">{entry.points.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Check-ins:</span>
                      <span className="font-semibold">{entry.totalCheckIns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Spots:</span>
                      <span className="font-semibold">{entry.spotsVisited}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Tricks:</span>
                      <span className="font-semibold">{entry.tricksUnlocked}</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-300">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">{entry.streak} day streak</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard Table */}
          <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#fafafa]">Full Rankings</CardTitle>
              <CardDescription className="text-gray-300">
                All skaters competing for legendary status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      entry.rank <= 3
                        ? 'bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/30'
                        : 'bg-neutral-900/50 hover:bg-neutral-800/50 border border-gray-700'
                    }`}
                    data-testid={`row-leaderboard-${entry.rank}`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold">
                      {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#fafafa] font-semibold">{entry.displayName}</h3>
                        {entry.isPro && (
                          <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                            PRO
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{entry.username}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-400">Points</p>
                        <p className="text-[#fafafa] font-semibold">{entry.points.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Check-ins</p>
                        <p className="text-[#fafafa] font-semibold">{entry.totalCheckIns}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Spots</p>
                        <p className="text-[#fafafa] font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-500" />
                          {entry.spotsVisited}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Tricks</p>
                        <p className="text-[#fafafa] font-semibold flex items-center gap-1">
                          <Award className="w-3 h-3 text-green-500" />
                          {entry.tricksUnlocked}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Streak</p>
                        <p className="text-orange-400 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {entry.streak}d
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Stats Card (if logged in) */}
          {user && (
            <Card className="mt-6 bg-gradient-to-br from-orange-950/30 to-black border-orange-500/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Your Stats
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Keep checking in to climb the leaderboard!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center py-4">
                  Start checking in at spots to see your ranking here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
