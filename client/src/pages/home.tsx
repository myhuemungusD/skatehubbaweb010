import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SkateHubbaLogo from "@/components/SkateHubbaLogo";

export default function Home() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleJoinClick = () => {
    toast({
      title: "Join SkateHubba!",
      description: "Coming soon - get ready to level up your skate life!",
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#181818] text-[#fafafa]">
      {/* Navigation */}
      <nav className="bg-[#131313] border-b border-[#333] mb-8 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <strong className="text-xl">SkateHubba</strong>
          </div>
          <div className="flex gap-6">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-[#fafafa] hover:text-orange-500 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-[#fafafa] hover:text-orange-500 transition-colors"
            >
              Gallery
            </button>
            <Button 
              onClick={handleJoinClick}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Join
            </Button>
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
                <SkateHubbaLogo size="lg" className="w-40 h-auto rounded-xl bg-[#222] p-4 shadow-lg" />
              </div>
              <h1 className="text-4xl font-bold mb-2">SKATEHUBBA</h1>
              <h2 className="text-2xl mb-6 text-gray-300">Stream. Connect. Skate. Your Skateboarding Social Universe.</h2>
            </div>
            <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              Level up your skate life: customize your skater, discover gear, join digital sessions, and share clips with your crew. SkateHubba is where digital meets street.
            </p>
            
            {/* Hero Image */}
            <figure className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?q=80&w=2000&auto=format&fit=crop"
                alt="Meet Your Crew"
                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg bg-[#232323]"
                data-testid="img-hero-crew"
              />
              <figcaption className="mt-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-orange-500 hover:text-orange-400 underline"
                  data-testid="link-meet-crew"
                >
                  Meet Your Crew
                </button>
              </figcaption>
            </figure>
          </section>

          {/* Features Section */}
          <section id="features" className="mb-12">
            <h3 className="text-3xl font-bold mb-6">Why SkateHubba?</h3>
            <ul className="text-left max-w-2xl mx-auto space-y-3 text-lg">
              <li className="flex items-start gap-3" data-testid="feature-customize">
                <span>🔥</span>
                <span>Customize your own skater & digital skate zone</span>
              </li>
              <li className="flex items-start gap-3" data-testid="feature-gear">
                <span>🛹</span>
                <span>Equip, collect & show off rare skate gear (even NFT kicks!)</span>
              </li>
              <li className="flex items-start gap-3" data-testid="feature-stream">
                <span>🎥</span>
                <span>Stream live sessions & share skate clips</span>
              </li>
              <li className="flex items-start gap-3" data-testid="feature-connect">
                <span>🤝</span>
                <span>Connect, chat, & squad up with other skaters worldwide</span>
              </li>
            </ul>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="mb-12">
            <h3 className="text-3xl font-bold mb-8">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <figure>
                <img 
                  src="https://images.unsplash.com/photo-1547483921-34b1271a93f2?q=80&w=1000&auto=format&fit=crop"
                  alt="Vibe Out at SkateHubba Spots"
                  className="w-full h-64 object-cover rounded-lg shadow-lg bg-[#232323]"
                  data-testid="img-gallery-spots"
                />
                <figcaption className="mt-3 text-gray-300">Vibe Out at SkateHubba Spots</figcaption>
              </figure>
              
              <figure>
                <img 
                  src="https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=1000&auto=format&fit=crop"
                  alt="Customize Your Boards"
                  className="w-full h-64 object-cover rounded-lg shadow-lg bg-[#232323]"
                  data-testid="img-gallery-boards"
                />
                <figcaption className="mt-3 text-gray-300">Customize Your Boards</figcaption>
              </figure>
              
              <figure>
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop"
                  alt="Skate with Style"
                  className="w-full h-64 object-cover rounded-lg shadow-lg bg-[#232323]"
                  data-testid="img-gallery-style"
                />
                <figcaption className="mt-3 text-gray-300">Skate with Style</figcaption>
              </figure>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#333] pt-8 text-center bg-[#181818]">
        <div className="container mx-auto px-4">
          <p className="text-gray-400">&copy; 2025 SkateHubba. Level up your skate life.</p>
        </div>
      </footer>
    </div>
  );
}