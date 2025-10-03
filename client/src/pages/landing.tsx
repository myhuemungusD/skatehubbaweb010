import { Button } from "../components/ui/button";
import Background from "../components/BackgroundCarousel";
import { useEffect } from "react";
import EmailSignup from "../components/EmailSignup";

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
  useEffect(() => {
    const donate = document.getElementById('donate');
    if (donate) document.body.appendChild(donate);
  }, []);
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
            
            {/* Beta Signup Form - Now Powered by Ultimate Component */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-400/30 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Sign up
              </h3>
              <p className="text-gray-300 mb-6 text-center">
                Sign up to get early access to beta and dev updates
              </p>
              <EmailSignup />
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