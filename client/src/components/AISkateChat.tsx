import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '../lib/queryClient';
import { Badge } from './ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  ok: boolean;
  reply: {
    role: 'assistant';
    content: string;
  };
  error?: string;
}

export function AISkateChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Yo! I'm Beagle, your AI skate buddy! 🛹 Ask me anything about tricks, spots, or the app!",
    },
  ]);
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest('POST', '/api/ai/chat', {
        messages: [
          ...messages.slice(-10), // Last 10 messages for context
          { role: 'user', content: userMessage },
        ],
      });
      return (await response.json()) as ChatResponse;
    },
    onSuccess: (data) => {
      if (data.ok && data.reply) {
        setMessages((prev) => [...prev, data.reply]);
      } else {
        toast({
          title: 'Chat Error',
          description: data.error || 'Failed to get response from Beagle.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Chat Error',
        description: error.message || 'Failed to send message.',
        variant: 'destructive',
      });
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    chatMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 z-50"
        data-testid="button-open-chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl bg-[#232323] border-gray-700 flex flex-col z-50" data-testid="card-chat">
      <CardHeader className="border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                Beagle AI
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  ONLINE
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Your AI Skate Buddy
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
            data-testid="button-close-chat"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            data-testid={`message-${message.role}-${index}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-800 text-gray-200 border border-gray-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t border-gray-700 p-4 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Beagle anything..."
            className="flex-1 bg-neutral-800 border-gray-700 text-white placeholder:text-gray-500"
            disabled={chatMutation.isPending}
            data-testid="input-chat"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
