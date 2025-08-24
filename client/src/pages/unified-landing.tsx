import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Background from "../components/BackgroundCarousel";
import { useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import { analytics } from "../lib/analytics";
import { z } from "zod";
import { ChevronDown, Play, CheckCircle, Zap, MapPin, Users, Trophy } from "lucide-react";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
});

// Apple-level micro-interaction hooks
const useSpringAnimation = (isVisible: boolean) => {
  const [style, setStyle] = useState({ transform: 'translateY(20px)', opacity: 0 });
  
  useEffect(() => {
    if (isVisible) {
      setStyle({ 
        transform: 'translateY(0px)', 
        opacity: 1,
      });
    }
  }, [isVisible]);
  
  return {
    style: {
      ...style,
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    }
  };
};

// Sophisticated loading states
const LoadingButton = ({ isLoading, children, ...props }: any) => (
  <Button 
    {...props}
    disabled={isLoading}
    className={`${props.className} relative overflow-hidden transition-all duration-200 ${
      isLoading ? 'cursor-wait' : ''
    }`}
  >
    <span className={`transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      {children}
    </span>
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      </div>
    )}
  </Button>
);

// Systematic component spacing
const Section = ({ children, className = "", ...props }: any) => (
  <section className={`py-16 md:py-24 ${className}`} {...props}>
    <div className="max-w-6xl mx-auto px-6">
      {children}
    </div>
  </section>
);

const SkateHubbaLogo = () => (
  <div className="relative">
    <svg
      width="60"
      height="60"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-orange-500 transition-transform duration-300 hover:scale-105"
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

export default function UnifiedLanding() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showDetailedFeatures, setShowDetailedFeatures] = useState(false);
  const { toast } = useToast();
  
  // Progressive disclosure with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const springAnimation = useSpringAnimation(true);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValidationError("");

    try {
      const validatedData = subscribeSchema.parse({ email, firstName });
      setIsSubmitting(true);
      analytics.subscribeSubmitted(validatedData.email);

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...validatedData,
          company: "" // honeypot field
        })
      });

      const data = await response.json();

      if (data.ok) {
        analytics.subscribeSuccess();
        setSignupSuccess(true);
        setEmail("");
        setFirstName("");
        
        toast({
          title: "Welcome to SkateHubba! 🎉",
          description: data.msg || "You're now on the beta list!",
        });

        // Auto-hide success after 8 seconds
        setTimeout(() => setSignupSuccess(false), 8000);
      } else {
        throw new Error(data.msg || "Signup failed");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0]?.message || "Please check your email");
      } else {
        toast({
          title: "Signup failed",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Background className="text-white min-h-screen">
      {/* Enhanced Navigation with Apple-level polish */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <SkateHubbaLogo />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SkateHubba
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setShowDetailedFeatures(!showDetailedFeatures)}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                data-testid="button-features-toggle"
              >
                Features
              </button>
              <Button 
                onClick={() => window.location.href = '/donate'}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                data-testid="button-donate-nav"
              >
                Donate
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Progressive Disclosure */}
      <Section className="pt-24 pb-16">
        <div className="text-center" style={springAnimation.style}>
          <div className="mb-8">
            <SkateHubbaLogo />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent" data-testid="text-hero-title">
            Own Your Tricks.
            <br />
            <span className="text-orange-500">Play SKATE Anywhere.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
            The ultimate mobile skateboarding platform where your skills become collectibles and every spot tells a story.
          </p>

          {/* Social Proof Indicators */}
          <div className="flex justify-center items-center gap-8 mb-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <span>Join 1,000+ skaters</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free beta access</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Mint your moments</span>
            </div>
          </div>

          {/* Enhanced Signup Form */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-400/30 max-w-md mx-auto">
            {signupSuccess ? (
              <div className="text-center fade-in-section">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  You're In! 🛹
                </h3>
                <p className="text-green-400 mb-4 font-semibold">
                  Welcome to the crew! Check your email for confirmation.
                </p>
                <p className="text-gray-300 text-sm mb-6">
                  We'll notify you as soon as the beta drops. Get ready to own your tricks!
                </p>
                <Button
                  onClick={() => setSignupSuccess(false)}
                  variant="outline"
                  className="text-sm border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Sign up another email →
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Join the Beta
                </h3>
                <p className="text-gray-300 mb-6 text-center">
                  Be the first to experience the future of skateboarding
                </p>
                <form onSubmit={handleJoinSubmit} className="space-y-4" autoComplete="on">
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 bg-black/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                      required
                      autoComplete="given-name"
                      data-testid="input-hero-firstname"
                    />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-black/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                      required
                      autoComplete="email"
                      data-testid="input-hero-email"
                    />
                  </div>
                  {validationError && (
                    <p className="text-red-400 text-sm text-center" role="alert">
                      {validationError}
                    </p>
                  )}
                  <LoadingButton
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105"
                    data-testid="button-hero-join"
                  >
                    {isSubmitting ? 'Joining...' : 'Join the Beta'}
                  </LoadingButton>
                </form>
              </>
            )}
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {[
              { icon: Zap, title: "Remote S.K.A.T.E.", desc: "Challenge skaters worldwide" },
              { icon: MapPin, title: "Spot Check-ins", desc: "Discover and share locations" },
              { icon: Trophy, title: "Trick Collectibles", desc: "Mint your best moments" }
            ].map((feature, index) => (
              <div key={index} className="bg-black/30 rounded-xl p-6 border border-gray-600/30 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 fade-in-section">
                <feature.icon className="h-8 w-8 text-orange-500 mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Expandable Detailed Features */}
      {showDetailedFeatures && (
        <Section className="bg-gradient-to-br from-orange-500/10 to-purple-600/10 border-y border-orange-400/20 fade-in-section">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              More Than Just an App
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-orange-400">Core Features</h3>
                <div className="space-y-4 text-gray-300">
                  <p><strong className="text-white">Remote S.K.A.T.E.:</strong> Video challenges with 24-hour timers and trick validation</p>
                  <p><strong className="text-white">Live Sessions:</strong> Stream and spectate with the community</p>
                  <p><strong className="text-white">Trenches Feed:</strong> Share clips and get feedback</p>
                  <p><strong className="text-white">Digital Closet:</strong> Customize avatars and flex gear</p>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-orange-400">Collectibles System</h3>
                <div className="space-y-4 text-gray-300">
                  <p><strong className="text-white">Blockchain Verified:</strong> Your tricks are minted as unique collectibles</p>
                  <p><strong className="text-white">Trade & Collect:</strong> Exchange rare gear and earn exclusive drops</p>
                  <p><strong className="text-white">Pro Collaborations:</strong> Unlock secret challenges from your favorite pros</p>
                  <p><strong className="text-white">Moment Ownership:</strong> From first-try rails to MBD at your local spot</p>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* CTA Section */}
      <Section className="text-center">
        <div className="max-w-2xl mx-auto fade-in-section">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Own Your Tricks?
          </h2>
          <p className="text-gray-300 mb-8">
            Join thousands of skaters already building their digital legacy
          </p>
          <Button
            onClick={() => document.querySelector('[data-testid="input-hero-email"]')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-bold rounded-lg transition-all duration-200 hover:scale-105"
            data-testid="button-cta-scroll"
          >
            Get Beta Access
          </Button>
        </div>
      </Section>

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

      <style>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-in-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </Background>
  );
}