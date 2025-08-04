import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SkateHubbaLogo from "@/components/SkateHubbaLogo";

export default function Home() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome to SkateHubba!",
        description: "Thanks for joining! We'll keep you updated on our launch.",
      });
      setEmail("");
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#181818] text-[#fafafa]">
      {/* Navigation */}
      <nav className="bg-[#131313] border-b border-[#333] mb-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <strong className="text-xl text-[#fafafa]">SkateHubba</strong>
            </div>
            <div className="flex gap-6 items-center">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-[#fafafa] hover:text-orange-500 transition-colors"
                data-testid="link-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-[#fafafa] hover:text-orange-500 transition-colors"
                data-testid="link-gallery"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('join')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
                data-testid="button-join-nav"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          {/* Hero Section */}
          <section className="mb-12">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <SkateHubbaLogo size="lg" className="w-40 h-auto rounded-xl bg-[#222] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)]" />
              </div>
              <h1 className="text-4xl font-bold mb-2 text-[#fafafa]">SKATEHUBBA</h1>
              <h2 className="text-2xl mb-6 text-[#fafafa]">Stream. Connect. Skate. Your Skateboarding Social Universe.</h2>
            </div>
            
            <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed text-[#fafafa]">
              Level up your skate life: customize your skater, discover gear, join digital sessions, and share clips with your crew. SkateHubba is where digital meets street.
            </p>
            
            {/* Hero Image */}
            <figure className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?q=80&w=2000&auto=format&fit=crop"
                alt="Meet Your Crew - Skateboarding community"
                className="w-full max-w-2xl mx-auto rounded-lg shadow-[0_1px_8px_rgba(0,0,0,0.2)] bg-[#232323]"
                data-testid="img-hero-crew"
              />
              <figcaption className="mt-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-orange-500 hover:text-orange-400 underline transition-colors"
                  data-testid="link-meet-crew"
                >
                  Meet Your Crew
                </button>
              </figcaption>
            </figure>
          </section>

          {/* Features Section */}
          <section id="features" className="mb-12 mt-12">
            <h3 className="text-3xl font-bold mb-6 text-[#fafafa]">Why SkateHubba?</h3>
            <ul className="text-left max-w-2xl mx-auto space-y-4 text-lg">
              <li className="flex items-start gap-3" data-testid="feature-customize">
                <span className="text-xl">🔥</span>
                <span className="text-[#fafafa]">Customize your own skater & digital skate zone</span>
              </li>
              <li className="flex items-start gap-3" data-testid="feature-gear">
                <span className="text-xl">🛹</span>
                <span className="text-[#fafafa]">Equip, collect & show off rare skate gear (even NFT kicks!)</span>
              </li>
              <li className="flex items-start gap-3" data-testid="feature-stream">
                <span className="text-xl">🎥</span>
                <span className="text-[#fafafa]">Stream live sessions & share skate clips</span>
              </li>
              <li className="flex items-start gap-3" data-testid="feature-connect">
                <span className="text-xl">🤝</span>
                <span className="text-[#fafafa]">Connect, chat, & squad up with other skaters worldwide</span>
              </li>
            </ul>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="mb-12 mt-12">
            <h3 className="text-3xl font-bold mb-8 text-[#fafafa]">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <figure className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1547483921-34b1271a93f2?q=80&w=1000&auto=format&fit=crop"
                  alt="Vibe Out at SkateHubba Spots"
                  className="w-full h-64 object-cover rounded-lg shadow-[0_1px_8px_rgba(0,0,0,0.2)] bg-[#232323]"
                  data-testid="img-gallery-spots"
                />
                <figcaption className="mt-3 text-[#fafafa]">Vibe Out at SkateHubba Spots</figcaption>
              </figure>
              
              <figure className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=1000&auto=format&fit=crop"
                  alt="Customize Your Boards"
                  className="w-full h-64 object-cover rounded-lg shadow-[0_1px_8px_rgba(0,0,0,0.2)] bg-[#232323]"
                  data-testid="img-gallery-boards"
                />
                <figcaption className="mt-3 text-[#fafafa]">Customize Your Boards</figcaption>
              </figure>
              
              <figure className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop"
                  alt="Street Skating Sessions"
                  className="w-full h-64 object-cover rounded-lg shadow-[0_1px_8px_rgba(0,0,0,0.2)] bg-[#232323]"
                  data-testid="img-gallery-sessions"
                />
                <figcaption className="mt-3 text-[#fafafa]">Street Skating Sessions</figcaption>
              </figure>
            </div>
          </section>

          {/* Join Section */}
          <section id="join" className="mb-12 mt-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-[#fafafa]">Join the Community</h3>
              <p className="mb-6 text-[#fafafa]">Be the first to know when SkateHubba launches!</p>
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#232323] border-[#333] text-[#fafafa] placeholder-gray-400"
                  data-testid="input-email"
                  required
                />
                <Button 
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
                  data-testid="button-join-submit"
                >
                  Join SkateHubba
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#333] pt-4 text-center bg-[#181818]">
        <div className="container mx-auto px-4">
          <p className="text-gray-400 text-sm">&copy; 2025 SkateHubba. Level up your skate life.</p>
        </div>
      </footer>
    </div>
  );
}