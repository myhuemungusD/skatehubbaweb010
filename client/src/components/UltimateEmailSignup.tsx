import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { z } from 'zod';

// Validation schema
const emailSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address').transform(v => v.trim().toLowerCase()),
  firstName: z.string().optional().transform(v => v?.trim() || null),
});

type EmailSignupData = z.infer<typeof emailSignupSchema>;

interface UltimateEmailSignupProps {
  /** Layout variant for different contexts */
  variant?: 'hero' | 'inline' | 'minimal' | 'sidebar';
  /** Show first name field */
  includeFirstName?: boolean;
  /** Custom CTA text */
  ctaText?: string;
  /** Show social proof elements */
  showSocialProof?: boolean;
  /** Track conversion source for analytics */
  source?: string;
  /** Success callback */
  onSuccess?: (data: { email: string; firstName?: string; status: string }) => void;
  /** Custom styling classes */
  className?: string;
}

export default function UltimateEmailSignup({ 
  variant = 'hero',
  includeFirstName = true,
  ctaText,
  showSocialProof = true,
  source = 'unknown',
  onSuccess,
  className = ''
}: UltimateEmailSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { toast } = useToast();

  // Social proof counter (simulated for demo)
  const [subscriberCount, setSubscriberCount] = useState(1247);

  useEffect(() => {
    // Simulate real-time counter updates for psychological effect
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every second
        setSubscriberCount(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: 'max-w-lg mx-auto space-y-6',
          form: 'space-y-4',
          input: 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 h-12 text-lg',
          button: 'bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg'
        };
      case 'inline':
        return {
          container: 'max-w-md space-y-4',
          form: 'flex flex-col sm:flex-row gap-3',
          input: 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500',
          button: 'bg-orange-500 hover:bg-orange-600 text-white px-6 font-semibold transition-all duration-200'
        };
      case 'minimal':
        return {
          container: 'max-w-sm space-y-3',
          form: 'space-y-3',
          input: 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-orange-400',
          button: 'bg-orange-500 hover:bg-orange-600 text-white font-medium'
        };
      case 'sidebar':
        return {
          container: 'space-y-4',
          form: 'space-y-3',
          input: 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500',
          button: 'bg-orange-500 hover:bg-orange-600 text-white w-full font-semibold'
        };
      default:
        return {
          container: 'max-w-md space-y-4',
          form: 'space-y-4',
          input: 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500',
          button: 'bg-orange-500 hover:bg-orange-600 text-white font-semibold'
        };
    }
  };

  const styles = getVariantStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Client-side validation
    try {
      const validatedData = emailSignupSchema.parse({ 
        email, 
        firstName: includeFirstName ? firstName : undefined 
      });
      
      setIsSubmitting(true);

      // Track submission attempt
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'signup_attempted', {
          source,
          variant,
          has_first_name: includeFirstName && !!firstName
        });
      }

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData)
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        
        // Track successful conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'signup_success', {
            source,
            variant,
            status: data.status
          });
        }

        if (data.status === "exists") {
          toast({
            title: "Already on the list! 👋",
            description: "You're already signed up. We'll keep you updated!",
          });
        } else {
          toast({
            title: "Welcome to SkateHubba! 🎉",
            description: data.msg || "You're now on the beta list!",
          });
        }

        // Call success callback
        onSuccess?.({ 
          email: validatedData.email, 
          firstName: validatedData.firstName || undefined,
          status: data.status 
        });

        // Clear form
        setEmail('');
        setFirstName('');
      } else {
        throw new Error(data.error || 'Signup failed');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0]?.message || "Please check your input");
      } else {
        toast({
          title: "Signup failed",
          description: "Please try again in a moment.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess && variant === 'hero') {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="bg-green-500/20 border border-green-400 rounded-xl p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-green-400 font-bold text-xl mb-2">You're In! 🎉</h3>
          <p className="text-green-300 mb-4">Get ready for updates, drops & exclusive sessions.</p>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-orange-400 hover:text-orange-300 text-sm flex items-center justify-center gap-2 mx-auto"
            data-testid="button-subscribe-another"
          >
            Subscribe another email <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`} data-testid="email-signup-form">
      {/* Social proof */}
      {showSocialProof && variant === 'hero' && (
        <div className="flex justify-center items-center gap-8 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-500" />
            <span>Join {subscriberCount.toLocaleString()}+ skaters</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-500" />
            <span>Free beta access</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {includeFirstName && (
          <Input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={styles.input}
            disabled={isSubmitting}
            data-testid="input-first-name"
          />
        )}
        
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${styles.input} ${variant === 'inline' ? 'flex-1' : ''}`}
          disabled={isSubmitting}
          required
          data-testid="input-email"
        />
        
        <Button
          type="submit"
          disabled={isSubmitting || !email}
          className={styles.button}
          data-testid="button-signup"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing up...
            </span>
          ) : (
            ctaText || (variant === 'hero' ? 'Join the Beta' : 'Get Updates')
          )}
        </Button>
      </form>

      {/* Validation error */}
      {validationError && (
        <p className="text-red-400 text-sm text-center" data-testid="text-validation-error">
          {validationError}
        </p>
      )}

      {/* Minimal social proof for non-hero variants */}
      {showSocialProof && variant !== 'hero' && (
        <p className="text-gray-400 text-xs text-center">
          Join {subscriberCount.toLocaleString()}+ skaters • Free beta access
        </p>
      )}
    </div>
  );
}