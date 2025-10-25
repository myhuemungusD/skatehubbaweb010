import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('general');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const feedbackMutation = useMutation({
    mutationFn: async (data: { type: string; message: string }) => {
      const response = await apiRequest('POST', '/api/feedback', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Feedback Sent! 🛹',
        description: 'Thanks for helping us improve SkateHubba!',
        className: 'bg-green-500/90 text-white border-green-600',
      });
      setMessage('');
      setFeedbackType('general');
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Send',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please enter your feedback.',
        variant: 'destructive',
      });
      return;
    }
    feedbackMutation.mutate({ type: feedbackType, message: message.trim() });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="fixed bottom-20 right-6 rounded-full w-12 h-12 shadow-lg bg-neutral-800 border-orange-500/50 hover:bg-orange-500/20 hover:border-orange-500 z-40"
        data-testid="button-open-feedback"
      >
        <MessageSquare className="w-5 h-5 text-orange-500" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#232323] border-gray-700 text-white max-w-md" data-testid="dialog-feedback">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Send Feedback
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Help us improve SkateHubba with your thoughts and ideas
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type" className="text-gray-200">
                Feedback Type
              </Label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger 
                  id="feedback-type"
                  className="bg-neutral-800 border-gray-700 text-white"
                  data-testid="select-feedback-type"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-gray-700">
                  <SelectItem value="bug" className="text-white hover:bg-neutral-700">
                    🐛 Bug Report
                  </SelectItem>
                  <SelectItem value="feature" className="text-white hover:bg-neutral-700">
                    💡 Feature Request
                  </SelectItem>
                  <SelectItem value="improvement" className="text-white hover:bg-neutral-700">
                    ⚡ Improvement
                  </SelectItem>
                  <SelectItem value="general" className="text-white hover:bg-neutral-700">
                    💬 General Feedback
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message" className="text-gray-200">
                Your Feedback
              </Label>
              <Textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                className="min-h-[120px] bg-neutral-800 border-gray-700 text-white placeholder:text-gray-500 resize-none"
                disabled={feedbackMutation.isPending}
                data-testid="textarea-feedback"
              />
            </div>

            {user && (
              <p className="text-sm text-gray-400">
                Sending as: {user.email}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-neutral-800 border-gray-700 text-white hover:bg-neutral-700"
                disabled={feedbackMutation.isPending}
                data-testid="button-cancel-feedback"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                disabled={feedbackMutation.isPending || !message.trim()}
                data-testid="button-submit-feedback"
              >
                {feedbackMutation.isPending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
