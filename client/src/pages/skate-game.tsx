import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Gamepad2, 
  Users, 
  Trophy, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Crown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { apiRequest, queryClient } from '../lib/queryClient';

interface Game {
  id: string;
  player1: string;
  player2: string;
  status: 'waiting' | 'active' | 'completed';
  currentTurn: string;
  player1Letters: string;
  player2Letters: string;
  winner?: string;
  createdAt: string;
}

export default function SkateGamePage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [trickDescription, setTrickDescription] = useState('');

  const activeGames: Game[] = [
    {
      id: 'game-1',
      player1: 'Mike',
      player2: 'Sarah',
      status: 'active',
      currentTurn: 'Mike',
      player1Letters: 'SK',
      player2Letters: 'S',
      createdAt: '2024-10-02T10:30:00Z',
    },
    {
      id: 'game-2',
      player1: 'Tony',
      player2: 'Emma',
      status: 'active',
      currentTurn: 'Emma',
      player1Letters: 'SKAT',
      player2Letters: 'SKA',
      createdAt: '2024-10-02T09:15:00Z',
    },
  ];

  const waitingGames: Game[] = [
    {
      id: 'game-3',
      player1: 'Jake',
      player2: '',
      status: 'waiting',
      currentTurn: '',
      player1Letters: '',
      player2Letters: '',
      createdAt: '2024-10-02T11:00:00Z',
    },
  ];

  const completedGames: Game[] = [
    {
      id: 'game-4',
      player1: 'Alex',
      player2: 'Jordan',
      status: 'completed',
      currentTurn: '',
      player1Letters: 'SKATE',
      player2Letters: 'SKAT',
      winner: 'Jordan',
      createdAt: '2024-10-01T14:20:00Z',
    },
  ];

  const createGameMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/games/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Game Created!',
        description: 'Waiting for another player to join...',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    },
  });

  const joinGameMutation = useMutation({
    mutationFn: async (gameId: string) => {
      return await apiRequest(`/api/games/${gameId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Joined Game!',
        description: "Let's play!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    },
  });

  const submitTrickMutation = useMutation({
    mutationFn: async ({ gameId, trick }: { gameId: string; trick: string }) => {
      return await apiRequest(`/api/games/${gameId}/trick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid, trick }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Trick Submitted!',
        description: 'Waiting for opponent response...',
      });
      setTrickDescription('');
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    },
  });

  const handleCreateGame = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to create a game.',
        variant: 'destructive',
      });
      return;
    }
    createGameMutation.mutate();
  };

  const handleJoinGame = (gameId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to join a game.',
        variant: 'destructive',
      });
      return;
    }
    joinGameMutation.mutate(gameId);
  };

  const handleSubmitTrick = (gameId: string) => {
    if (!trickDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please describe your trick.',
        variant: 'destructive',
      });
      return;
    }
    submitTrickMutation.mutate({ gameId, trick: trickDescription });
  };

  const getLettersDisplay = (letters: string) => {
    const fullWord = 'SKATE';
    return (
      <div className="flex gap-1">
        {fullWord.split('').map((letter, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded border ${
              letters.length > index
                ? 'bg-red-500/20 border-red-500 text-red-400'
                : 'bg-gray-700 border-gray-600 text-gray-500'
            }`}
          >
            {letter}
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#181818]">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-[#fafafa] mb-4">Login Required</h2>
          <p className="text-gray-300">Please log in to play S.K.A.T.E. games.</p>
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#fafafa] mb-2 flex items-center gap-2">
                <Gamepad2 className="w-10 h-10 text-[#ff6a00]" />
                Remote S.K.A.T.E.
              </h1>
              <p className="text-gray-300">Challenge skaters worldwide to a game of S.K.A.T.E.</p>
            </div>
            <Button
              onClick={handleCreateGame}
              disabled={createGameMutation.isPending}
              className="bg-[#24d52b] hover:bg-[#1fb125] text-black"
              data-testid="button-create-game"
            >
              <Play className="w-4 h-4 mr-2" />
              Create New Game
            </Button>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-neutral-900 border-neutral-700">
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-[#ff6a00] data-[state=active]:text-black"
                data-testid="tab-active-games"
              >
                <Play className="w-4 h-4 mr-2" />
                Active Games ({activeGames.length})
              </TabsTrigger>
              <TabsTrigger
                value="waiting"
                className="data-[state=active]:bg-[#ff6a00] data-[state=active]:text-black"
                data-testid="tab-waiting-games"
              >
                <Clock className="w-4 h-4 mr-2" />
                Waiting ({waitingGames.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-[#ff6a00] data-[state=active]:text-black"
                data-testid="tab-completed-games"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Completed ({completedGames.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeGames.map((game) => (
                  <Card
                    key={game.id}
                    className="bg-black/60 border-gray-600 backdrop-blur-sm"
                    data-testid={`card-game-${game.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-[#fafafa] flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#ff6a00]" />
                          {game.player1} vs {game.player2}
                        </span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Current turn: <span className="text-[#ff6a00] font-semibold">{game.currentTurn}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">{game.player1}</p>
                          {getLettersDisplay(game.player1Letters)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">{game.player2}</p>
                          {getLettersDisplay(game.player2Letters)}
                        </div>
                      </div>

                      {game.currentTurn === user?.email?.split('@')[0] && (
                        <div className="space-y-2">
                          <Input
                            placeholder="Describe your trick (e.g., kickflip down 5 stair)"
                            value={trickDescription}
                            onChange={(e) => setTrickDescription(e.target.value)}
                            className="bg-neutral-900 border-gray-700 text-white"
                            data-testid="input-trick-description"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSubmitTrick(game.id)}
                              disabled={submitTrickMutation.isPending}
                              className="flex-1 bg-[#24d52b] hover:bg-[#1fb125] text-black"
                              data-testid="button-submit-trick"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Submit Trick
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                              data-testid="button-miss-trick"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Missed
                            </Button>
                          </div>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-neutral-800"
                        onClick={() => setSelectedGame(game)}
                        data-testid="button-view-details"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="waiting" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {waitingGames.map((game) => (
                  <Card
                    key={game.id}
                    className="bg-black/60 border-gray-600 backdrop-blur-sm"
                    data-testid={`card-waiting-game-${game.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-[#fafafa] flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-400" />
                        Waiting for Player
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Created by: {game.player1}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleJoinGame(game.id)}
                        disabled={joinGameMutation.isPending}
                        className="w-full bg-[#ff6a00] hover:bg-[#e55f00] text-white"
                        data-testid={`button-join-${game.id}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Join Game
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedGames.map((game) => (
                  <Card
                    key={game.id}
                    className="bg-black/60 border-gray-600 backdrop-blur-sm"
                    data-testid={`card-completed-game-${game.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-[#fafafa] flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-[#24d52b]" />
                          {game.player1} vs {game.player2}
                        </span>
                        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                          Completed
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Winner: <span className="text-[#24d52b] font-semibold flex items-center gap-1">
                          <Crown className="w-4 h-4" />
                          {game.winner}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">{game.player1}</p>
                          {getLettersDisplay(game.player1Letters)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">{game.player2}</p>
                          {getLettersDisplay(game.player2Letters)}
                        </div>
                      </div>
                    </CardContent>
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
