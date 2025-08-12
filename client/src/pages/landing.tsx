import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";

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
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#181818] text-[#fafafa]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#181818]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <SkateHubbaLogo />
              <span className="text-xl font-bold">SkateHubba</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-orange-500 transition-colors">Features</a>
              <a href="#gallery" className="text-gray-300 hover:text-orange-500 transition-colors">Gallery</a>
              <a href="#join" className="text-gray-300 hover:text-orange-500 transition-colors">Join</a>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                data-testid="button-login"
              >
                Log In
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6" data-testid="text-hero-title">
            Stream. Connect. Skate.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8" data-testid="text-hero-subtitle">
            Your Skateboarding Social Universe
          </p>
          <p className="text-lg text-gray-400 mb-10" data-testid="text-coming-soon">
            Coming Soon • Free Beta Download
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-lg transition-colors"
              data-testid="button-hero-login"
            >
              Get Started
            </Button>
            <Link href="/donate">
              <Button 
                variant="outline" 
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg rounded-lg transition-colors"
                data-testid="button-hero-donate"
              >
                Support Development
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" data-testid="text-features-title">
            Skate Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6" data-testid="card-feature-stream">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Stream Sessions</h3>
              <p className="text-gray-400">Live stream your skate sessions and watch others in real-time</p>
            </div>
            <div className="text-center p-6" data-testid="card-feature-connect">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Globally</h3>
              <p className="text-gray-400">Find skaters worldwide and build your crew</p>
            </div>
            <div className="text-center p-6" data-testid="card-feature-progress">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-gray-400">Log tricks, track progress, and level up your skills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" data-testid="text-gallery-title">
            Skate Gallery
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden" data-testid={`img-gallery-${i}`}>
                <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-gray-800 flex items-center justify-center">
                  <span className="text-6xl">🛹</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-20 px-4 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8" data-testid="text-join-title">
            Join the Community
          </h2>
          <p className="text-xl text-gray-300 mb-12" data-testid="text-join-description">
            Be the first to experience the future of skateboarding social connection
          </p>
          <div className="max-w-md mx-auto">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-lg transition-colors"
              data-testid="button-join-login"
            >
              Join SkateHubba
            </Button>
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
    </div>
  );
}