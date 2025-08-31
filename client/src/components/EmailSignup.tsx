import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { trackButtonClick } from '../lib/analytics';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    trackButtonClick('email_signup', 'landing_page');

    try {
      const response = await fetch('/api/secure-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          source: 'landing',
          userAgent: navigator.userAgent,
          ipAddress: 'client-side', // Server will get real IP
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success! 🎉",
          description: data.msg || "Thanks for signing up! We'll keep you updated.",
        });
        setEmail('');
      } else {
        throw new Error(data.msg || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
          disabled={isSubmitting}
          required
        />
        <Button
          type="submit"
          disabled={isSubmitting || !email}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 font-semibold transition-all duration-200"
        >
          {isSubmitting ? 'Signing up...' : 'Get Updates'}
        </Button>
      </form>
    </div>
  );
}