import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Background from "../components/BackgroundCarousel";
import Navigation from "../components/Navigation";
import { Link } from "wouter";
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

// Mobile-optimized loading button
const LoadingButton = ({ isLoading, children, className, ...props }: any) => (
  <button
    {...props}
    disabled={isLoading}
    className={`${className} relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed`}
    style={{
      minHeight: '48px',
      fontSize: '16px',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation'
    }}
  >
    <span className={`transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      {children}
    </span>
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      </div>
    )}
  </button>
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
  const [showDetailedFeatures, setShowDetailedFeatures] = useState(false);
  
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

  return (
    <Background className="text-white min-h-screen">
      <Navigation />

      {/* Hero Section with Optimized Layout */}
      <Section className="pt-12 pb-12">
        <div className="text-center" style={springAnimation.style}>
          <div className="mb-8">
            <SkateHubbaLogo />
          </div>

          {/* Social Proof Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-10 text-sm text-gray-400 px-4" style={{ fontFamily: "'Permanent Marker', cursive" }}>
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

          {/* Primary Auth Button */}
          <div className="text-center mb-12">
            <Link to="/auth">
              <button 
                className="auth-button"
                data-testid="button-auth-primary"
              >
                Create Account / Sign In
              </button>
            </Link>
          </div>

          {/* Feature Preview Cards - Premium SkateHubba Style */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
            {[
              { icon: Zap, title: "Remote S.K.A.T.E.", desc: "Challenge skaters worldwide" },
              { icon: MapPin, title: "Spot Check-ins", desc: "Discover and share locations" },
              { icon: Trophy, title: "Trick Collectibles", desc: "Mint your best moments" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-black/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-orange-500/60 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 fade-in-section overflow-hidden"
                data-testid={`card-feature-${index}`}
              >
                {/* Gradient glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-transparent transition-all duration-500 rounded-2xl pointer-events-none" />
                
                {/* Icon with background glow */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full scale-150 group-hover:bg-orange-500/30 transition-all duration-500" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-500">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
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