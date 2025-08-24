import { Button } from "../components/ui/button";
import Background from "../components/BackgroundCarousel";
import { useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import { analytics } from "../lib/analytics";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
});

const SkateHubbaLogo = () => (
  <div className="relative">
    <svg
      width="60"
      height="60"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-orange-500"
    >
      <path
        d="M20 45 L80 45 Q85 45 85 50 L85 55 Q85 60 80 60 L20 60 Q15 60 15 55 L15 50 Q15 45 20 45 Z"
        fill="currentColor"
        stroke="#fafafa"
        strokeWidth="2"
      />
      <circle cx="25" cy="52.5" r="8" fill="#181818" stroke="currentColor" strokeWidth="2"/>
      <circle cx="75" cy="52.5" r="8" fill="#181818" stroke="currentColor" strokeWidth="2"/>
      <rect x="22" y="48" width="6" height="9" fill="#666" rx="1"/>
      <rect x="72" y="48" width="6" height="9" fill="#666" rx="1"/>
      <text x="50" y="55" textAnchor="middle" fontSize="8" fill="#fafafa" fontWeight="bold">SH</text>
    </svg>
  </div>
);

export default function Landing() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const donate = document.getElementById('donate');
    if (donate) document.body.appendChild(donate);
  }, []);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValidationError("");

    // Client-side validation
    try {
      const validatedData = subscribeSchema.parse({ email, firstName });
      setIsSubmitting(true);
      analytics.subscribeSubmitted(validatedData.email);

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: validatedData.email })
      });

      const data = await response.json();

      if (data.ok) {
        console.log('Signup success!', data);
        analytics.subscribeSuccess();
        
        // Force success state immediately
        setSignupSuccess(true);
        
        // Clear form
        setEmail("");
        setFirstName("");
        
        // Show toast
        toast({
          title: "Welcome to SkateHubba! 🎉",
          description: data.msg || "You're now on the beta list!",
        });
        
        // Hide success message after 10 seconds
        setTimeout(() => {
          setSignupSuccess(false);
        }, 10000);
      } else {
        toast({
          title: "Signup failed",
          description: data.msg || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0]?.message || "Please check your email");
      } else {
        toast({
          title: "Network Error",
          description: "Please check your connection and try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Background className="text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <SkateHubbaLogo />
              <span className="text-xl font-bold">SkateHubba</span>
            </div>
            <div className="flex items-center space-x-8">
              <Button 
                onClick={() => {
                  window.location.href = '/donate';
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                data-testid="button-donate-nav"
              >
                Donate
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-6 pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <SkateHubbaLogo />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
              SkateHubba
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              Own your tricks. Play SKATE anywhere.
            </p>
            
            {/* Beta Signup Form */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-400/30 max-w-md mx-auto">
              {signupSuccess ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    You're In! 🛹
                  </h3>
                  <p className="text-green-400 mb-4 font-semibold">
                    Welcome to the crew! Check your email for confirmation.
                  </p>
                  <p className="text-gray-300 text-sm">
                    We'll notify you as soon as the beta drops. Get ready to own your tricks!
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">
                    Sign up
                  </h3>
                  <p className="text-gray-300 mb-6 text-center">
                    Sign up to get early access to beta and dev updates
                  </p>
                  <form onSubmit={handleJoinSubmit} className="space-y-4" autoComplete="on">
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-4 bg-black/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none text-base"
                        required
                        autoComplete="given-name"
                        data-testid="input-hero-firstname"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-4 bg-black/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none text-base"
                        required
                        autoComplete="email"
                        data-testid="input-hero-email"
                      />
                    </div>
                    {validationError && (
                      <p className="text-red-400 text-sm text-center">{validationError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-4 rounded-lg transition-colors touch-manipulation text-lg"
                      data-testid="button-hero-join"
                      style={{ 
                        minHeight: '48px', 
                        fontSize: '16px',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      {isSubmitting ? 'Signing up...' : 'Sign up'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-black/60">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-features-title">
              Why Skaters Choose SkateHubba
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Connect with the global skate community and level up your skills
            </p>
          </div>
        </section>

        {/* Donate Section - will be moved to bottom via useEffect */}
        <section id="donate" className="py-20 px-6 bg-black/60">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Support SkateHubba Development
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Help us build the future of skateboarding social connection
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => window.location.href = '/donate'}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                data-testid="button-donate-cta"
              >
                Support Project
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-white/20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <SkateHubbaLogo />
              <span className="text-xl font-bold">SkateHubba</span>
            </div>
            <p className="text-gray-400">The ultimate skateboarding social platform</p>
          </div>
        </footer>
      </div>
    </Background>
  );
}