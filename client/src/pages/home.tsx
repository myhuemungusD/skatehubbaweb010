import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Import your custom SkateHubba images
import shopBackground from "@assets/shop backgroung_1754296459156.png";
import avatarImage from "@assets/f94b6775-118d-47aa-88af-255db05d3bbc-thumbnail_1754296917742.webp";
import shopTemplate from "@assets/shoptemplate0.2_1754296307132.png";
import graffWallRack from "@assets/graffwallskateboardrack_1754296307132.png";
import nftShoe from "@assets/baigeESnft_1754296307131.png";

export default function Home() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const { toast } = useToast();

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && firstName) {
      toast({
        title: "Thanks for joining SkateHubba!",
        description: "We'll keep you updated on updates, exclusive gear drops & sessions.",
      });
      setEmail("");
      setFirstName("");
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = (modalId: string) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
  };

  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  };

  return (
    <div 
      className="min-h-screen text-[#fafafa] bg-cover bg-fixed relative"
      style={{
        backgroundImage: `url(${shopBackground})`,
        backgroundPosition: '50% 30%'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-[#131313] border-b border-[#333] mb-8">
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
                <h1 className="text-4xl font-bold mb-2 text-[#fafafa]">SKATEHUBBA</h1>
                <h2 className="text-2xl mb-6 text-[#fafafa]">Stream. Connect. Skate. Your Skateboarding Social Universe.</h2>
                <p className="text-lg mb-8 text-[#fafafa] max-w-3xl mx-auto">
                  Level up your skate life: customize your skater, discover gear, join digital sessions, and share clips with your crew. SkateHubba is where digital meets street.
                </p>
              </div>
              
              {/* Hero Image */}
              <figure className="mb-12">
                <img 
                  src={avatarImage} 
                  alt="SkateHubba Avatar Interface" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg bg-[#232323]"
                  data-testid="img-hero-avatar"
                />
                <figcaption className="mt-4">
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                    data-testid="link-meet-crew"
                  >
                    Meet Your Crew
                  </button>
                </figcaption>
              </figure>
            </section>

            {/* Features Section */}
            <section id="features" className="mb-12">
              <h3 className="text-3xl font-bold mb-6 text-[#fafafa]">Why SkateHubba?</h3>
              <ul className="text-left max-w-2xl mx-auto space-y-3 text-[#fafafa]">
                <li className="flex items-start gap-3">
                  <span className="text-orange-400">🔥</span>
                  <span>Customize your own skater & digital skate zone</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400">🛹</span>
                  <span>Equip, collect & show off rare skate gear (even NFT kicks!)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400">🎥</span>
                  <span>Stream live sessions & share skate clips</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400">🤝</span>
                  <span>Connect, chat, & squad up with other skaters worldwide</span>
                </li>
              </ul>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="mb-12">
              <h3 className="text-3xl font-bold mb-8 text-[#fafafa]">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <figure className="mb-6">
                  <img 
                    src={avatarImage} 
                    alt="Vibe Out at SkateHubba Spots" 
                    className="w-full rounded-lg shadow-lg bg-[#232323]"
                    data-testid="img-gallery-spots"
                  />
                  <figcaption className="mt-3 text-[#fafafa]">Vibe Out at SkateHubba Spots</figcaption>
                </figure>
                
                <figure className="mb-6">
                  <img 
                    src={graffWallRack} 
                    alt="Customize Your Boards" 
                    className="w-full rounded-lg shadow-lg bg-[#232323]"
                    data-testid="img-gallery-boards"
                  />
                  <figcaption className="mt-3 text-[#fafafa]">Customize Your Boards</figcaption>
                </figure>
                
                <figure className="mb-6">
                  <img 
                    src={shopTemplate} 
                    alt="Gear Up in the Digital Skate Shop" 
                    className="w-full rounded-lg shadow-lg bg-[#232323]"
                    data-testid="img-gallery-shop"
                  />
                  <figcaption className="mt-3 text-[#fafafa]">Gear Up in the Digital Skate Shop</figcaption>
                </figure>
                
                <figure className="mb-6">
                  <img 
                    src={nftShoe} 
                    alt="Unlock Limited Edition NFT Gear" 
                    className="w-full rounded-lg shadow-lg bg-[#232323]"
                    data-testid="img-gallery-nft"
                  />
                  <figcaption className="mt-3 text-[#fafafa]">Unlock Limited Edition NFT Gear</figcaption>
                </figure>
              </div>
            </section>
          </div>
        </main>

        {/* Join Section */}
        <section id="join" className="py-16 bg-black/40">
          <div className="container mx-auto px-4">
            <article className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-[#fafafa]">Join the SkateHubba Community</h2>
                <h3 className="text-xl text-[#fafafa]">Be first to know about updates, exclusive gear drops & sessions.</h3>
              </div>
              <form onSubmit={handleJoinSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-[#232323] border-[#333] text-[#fafafa] placeholder-gray-400"
                  data-testid="input-firstname"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#232323] border-[#333] text-[#fafafa] placeholder-gray-400"
                  data-testid="input-email"
                />
                <Button 
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  data-testid="button-subscribe"
                >
                  Subscribe
                </Button>
              </form>
            </article>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-[#333] text-center text-[#fafafa]">
          <small>
            &copy; 2025 SkateHubba. All rights reserved. •{' '}
            <button 
              onClick={() => openModal('privacy-modal')}
              className="text-orange-400 hover:text-orange-300 transition-colors"
              data-testid="link-privacy"
            >
              Privacy Policy
            </button>{' '}
            •{' '}
            <button 
              onClick={() => openModal('terms-modal')}
              className="text-orange-400 hover:text-orange-300 transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
            </button>{' '}
            •{' '}
            <a 
              href="mailto:hello@skatehubba.com"
              className="text-orange-400 hover:text-orange-300 transition-colors"
              data-testid="link-contact"
            >
              Contact
            </a>{' '}
            •{' '}
            <button 
              onClick={() => openModal('accessibility-modal')}
              className="text-orange-400 hover:text-orange-300 transition-colors"
              data-testid="link-accessibility"
            >
              Accessibility
            </button>{' '}
            •{' '}
            <a 
              href="https://replit.com/@jayham710/SkateStream" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors"
              data-testid="link-replit"
            >
              Replit
            </a>
          </small>
        </footer>

        {/* Privacy Modal */}
        <div 
          id="privacy-modal" 
          className="fixed inset-0 bg-black/85 justify-center items-center z-50 hidden"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
        >
          <div className="bg-[#232323] text-[#fafafa] p-8 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              className="float-right cursor-pointer text-xl bg-none border-none text-[#fafafa] hover:text-orange-400"
              onClick={() => closeModal('privacy-modal')}
              aria-label="Close"
              data-testid="button-close-privacy"
            >
              &times;
            </button>
            <h3 id="privacy-title" className="text-2xl font-bold mb-4">Privacy Policy</h3>
            <p className="mb-4"><strong>Effective date: August 2025</strong></p>
            <p className="mb-4">
              SkateHubba collects your name and email only for the purpose of sending you updates and news. We do not share or sell your personal data with anyone.
            </p>
            <p className="mb-4">
              You may unsubscribe at any time by clicking the link in any email. We do not use cookies or tracking, except those necessary for site function.
            </p>
          </div>
        </div>

        {/* Terms Modal */}
        <div 
          id="terms-modal" 
          className="fixed inset-0 bg-black/85 justify-center items-center z-50 hidden"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
        >
          <div className="bg-[#232323] text-[#fafafa] p-8 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              className="float-right cursor-pointer text-xl bg-none border-none text-[#fafafa] hover:text-orange-400"
              onClick={() => closeModal('terms-modal')}
              aria-label="Close"
              data-testid="button-close-terms"
            >
              &times;
            </button>
            <h3 id="terms-title" className="text-2xl font-bold mb-4">Terms of Service</h3>
            <p className="mb-4"><strong>Effective date: August 2025</strong></p>
            <p className="mb-4">
              By using SkateHubba, you agree to these terms. The service is provided as-is for skateboarding community engagement.
            </p>
            <p className="mb-4">
              Users must be respectful and follow community guidelines. We reserve the right to moderate content and remove inappropriate material.
            </p>
          </div>
        </div>

        {/* Accessibility Modal */}
        <div 
          id="accessibility-modal" 
          className="fixed inset-0 bg-black/85 justify-center items-center z-50 hidden"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
        >
          <div className="bg-[#232323] text-[#fafafa] p-8 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              className="float-right cursor-pointer text-xl bg-none border-none text-[#fafafa] hover:text-orange-400"
              onClick={() => closeModal('accessibility-modal')}
              aria-label="Close"
              data-testid="button-close-accessibility"
            >
              &times;
            </button>
            <h3 id="accessibility-title" className="text-2xl font-bold mb-4">Accessibility</h3>
            <p className="mb-4">
              SkateHubba is committed to providing an accessible experience for all users. We follow WCAG guidelines and continuously improve our accessibility features.
            </p>
            <p className="mb-4">
              If you encounter any accessibility issues, please contact us at hello@skatehubba.com and we'll work to address them promptly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}