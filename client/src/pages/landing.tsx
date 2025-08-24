import { Button } from "../components/ui/button";
import Background from "../components/BackgroundCarousel";

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
              <a href="#features" className="text-gray-300 hover:text-orange-500 transition-colors">Features</a>
              <a href="#join" className="text-gray-300 hover:text-orange-500 transition-colors">Join</a>
              <Button 
                onClick={() => window.location.href = 'https://skate-hubba-frontend-jayham710.replit.app'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold"
                data-testid="button-login"
              >
                Get Started
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
              Stream. Connect. Skate.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              Your Skateboarding Social Universe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => window.location.href = 'https://skate-hubba-frontend-jayham710.replit.app'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                data-testid="button-hero-login"
              >
                Join Beta Now
              </Button>
              <Button 
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
                data-testid="button-hero-learn-more"
              >
                Learn More
              </Button>
            </div>
            <p className="text-gray-400 mt-6">Coming Soon • Free Beta</p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-black/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" data-testid="text-features-title">
                Why Skaters Choose SkateHubba
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Connect with the global skate community and level up your skills
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300" data-testid="card-feature-stream">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎥</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Live Streaming</h3>
                <p className="text-gray-300">Broadcast your sessions and connect with skaters worldwide</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300" data-testid="card-feature-connect">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Global Community</h3>
                <p className="text-gray-300">Find local skaters, join crews, and build lasting friendships</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300" data-testid="card-feature-progress">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Skill Tracking</h3>
                <p className="text-gray-300">Log tricks, track progress, and celebrate achievements</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="join" className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6" data-testid="text-join-title">
              Ready to Join?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto" data-testid="text-join-description">
              Be among the first to experience the next generation of skateboarding social connection
            </p>
            <Button 
              onClick={() => window.location.href = 'https://skate-hubba-frontend-jayham710.replit.app'}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              data-testid="button-join-cta"
            >
              Get Early Access
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              100% Free Beta • No Credit Card Required
            </p>
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