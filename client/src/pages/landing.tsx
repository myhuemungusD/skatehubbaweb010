import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import BackgroundCarousel from "../components/BackgroundCarousel";
import { useToast } from "../hooks/use-toast";

const SkateHubbaLogo = () => (
  <div className="relative">
    <svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-orange-500"
    >
      {/* Skateboard deck */}
      <path
        d="M20 45 L80 45 Q85 45 85 50 L85 55 Q85 60 80 60 L20 60 Q15 60 15 55 L15 50 Q15 45 20 45 Z"
        fill="currentColor"
        stroke="#fafafa"
        strokeWidth="2"
      />
      
      {/* Wheel wells */}
      <circle cx="25" cy="52.5" r="8" fill="#181818" stroke="currentColor" strokeWidth="2"/>
      <circle cx="75" cy="52.5" r="8" fill="#181818" stroke="currentColor" strokeWidth="2"/>
      
      {/* Trucks */}
      <rect x="22" y="48" width="6" height="9" fill="#666" rx="1"/>
      <rect x="72" y="48" width="6" height="9" fill="#666" rx="1"/>
      
      {/* Street art elements */}
      <text x="50" y="55" textAnchor="middle" fontSize="8" fill="#fafafa" fontWeight="bold">SH</text>
      
      {/* Grip tape texture lines */}
      <line x1="25" y1="49" x2="25" y2="56" stroke="#333" strokeWidth="0.5"/>
      <line x1="30" y1="49" x2="30" y2="56" stroke="#333" strokeWidth="0.5"/>
      <line x1="70" y1="49" x2="70" y2="56" stroke="#333" strokeWidth="0.5"/>
      <line x1="75" y1="49" x2="75" y2="56" stroke="#333" strokeWidth="0.5"/>
    </svg>
  </div>
);

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const { toast } = useToast();
  
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testToast = () => {
    toast({
      title: "Toast Test",
      description: "This is a test toast notification to verify functionality.",
      variant: "default"
    });
  };

  return (
    <BackgroundCarousel className="text-[#fafafa]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#181818]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <SkateHubbaLogo />
              <span className="text-xl font-bold">SkateHubba</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-orange-500 transition-colors font-medium">Features</a>
              <a href="#gallery" className="text-gray-300 hover:text-orange-500 transition-colors font-medium">Gallery</a>
              <a href="#join" className="text-gray-300 hover:text-orange-500 transition-colors font-medium">Join</a>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200"
                data-testid="button-login"
              >
                Get Started
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                data-testid="button-mobile-login"
              >
                Join Beta
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <SkateHubbaLogo />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
            Stream. Connect. Skate.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            Your Skateboarding Social Universe
          </p>
          <p className="text-base sm:text-lg text-gray-400 mb-8" data-testid="text-coming-soon">
            Coming Soon • Free Beta Download
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              data-testid="button-hero-login"
            >
              🚀 Join Beta Now
            </Button>
            <Button 
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="outline" 
              className="w-full sm:w-auto border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
              data-testid="button-hero-learn-more"
            >
              Learn More
            </Button>
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/donate">
              <Button 
                variant="ghost"
                className="text-gray-400 hover:text-orange-500 underline text-base transition-colors"
                data-testid="button-hero-donate"
              >
                💝 Support Development
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-features-title">
              Why Skaters Love SkateHubba
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Connect with the global skate community and take your skills to the next level
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8 text-center hover:transform hover:scale-105 transition-all duration-300" data-testid="card-feature-stream">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Live Streaming</h3>
              <p className="text-gray-300 leading-relaxed">Broadcast your sessions in real-time and connect with skaters worldwide</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8 text-center hover:transform hover:scale-105 transition-all duration-300" data-testid="card-feature-connect">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Global Community</h3>
              <p className="text-gray-300 leading-relaxed">Find local skaters, join crews, and build lasting friendships</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8 text-center hover:transform hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1" data-testid="card-feature-progress">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Skill Tracking</h3>
              <p className="text-gray-300 leading-relaxed">Log tricks, track progress, and celebrate your achievements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-gallery-title">
              Community Highlights
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              See what the community is creating and sharing
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl overflow-hidden group hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50" data-testid={`img-gallery-${i}`}>
                <div className="w-full h-full bg-gradient-to-br from-orange-500/10 to-gray-800 flex items-center justify-center group-hover:from-orange-500/20 transition-all duration-300">
                  <span className="text-3xl sm:text-4xl md:text-6xl opacity-50 group-hover:opacity-75 transition-opacity">🛹</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200"
              data-testid="button-gallery-join"
            >
              Join & Share Your Content
            </Button>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#111111]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" data-testid="text-join-title">
              Ready to Join the Revolution?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto" data-testid="text-join-description">
              Be among the first to experience the next generation of skateboarding social connection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mb-6">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                data-testid="button-join-cta"
              >
                🎯 Get Early Access
              </Button>
              <Link href="/donate">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
                  data-testid="button-join-support"
                >
                  💝 Support Us
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              💯 100% Free Beta • 🚀 No Credit Card Required • 🎉 Exclusive Early Features
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <SkateHubbaLogo />
            <span className="text-xl font-bold">SkateHubba</span>
          </div>
          <p className="text-gray-400 mb-6" data-testid="text-footer-description">
            The ultimate mobile skateboarding platform
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <Link href="/donate">
              <span className="hover:text-orange-500 cursor-pointer" data-testid="link-footer-support">
                Support Development
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </BackgroundCarousel>
  );
}