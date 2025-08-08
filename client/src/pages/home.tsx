import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Import your custom SkateHubba images
import shopBackground from "@assets/shop backgroung_1754296459156.png";
import checkinMapImage from "@assets/checkinmap_1754368423116.png";
import shopTemplate from "@assets/shoptemplate0.2_1754296307132.png";
import graffWallRack from "@assets/graffwallskateboardrack_1754296307132.png";
import nftShoe from "@assets/baigeESnft_1754296307131.png";

// Import the ImageCarousel component
import { ImageCarousel } from "@/components/ImageCarousel";

// Gallery data organized by categories
const gallerySlides = [
  {
    id: 1,
    title: "Avatar & Character System",
    images: ["/attached_assets/cartoonavatar_1754296307132.png", "/attached_assets/baigeES_1754296307131.png", "/attached_assets/baigeESnft_1754296307131.png"]
  },
  {
    id: 2, 
    title: "Shop & Trading System",
    images: ["/attached_assets/graffwallskateboardrack_1754296307132.png", "/attached_assets/shoptemplate0.2_1754296307132.png", "/attached_assets/shop background_1754296307133.png"]
  },
  {
    id: 3,
    title: "Environment & Locations", 
    images: ["/attached_assets/alley back ground_1754296307133.png", "/attached_assets/profile background_1754296307133.png", "/attached_assets/graff wall_1754296307134.png"]
  },
  {
    id: 4,
    title: "Game Interface & Avatars",
    images: ["/attached_assets/avatar4_1754685109473.png", "/attached_assets/avatar11_1754685109474.png", "/attached_assets/avatar6_1754685109474.png"]
  },
  {
    id: 5,
    title: "Customization & Inventory",
    images: ["/attached_assets/shopscreen3_1754685109474.png", "/attached_assets/avatar5_1754685109474.png"]
  }
]

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
        {/* Beta Notice */}
        <div className="bg-orange-500 text-white text-center py-3">
          <div className="container mx-auto px-4">
            <strong>BETA VERSION</strong> - We need your feedback to make SkateHubba even better! 
            <a 
              href="mailto:hello@skatehubba.com" 
              className="underline hover:text-orange-200 ml-2"
              data-testid="link-beta-feedback"
            >
              Send Feedback
            </a>
          </div>
        </div>

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
            {/* Video Ad Style Hero Section */}
            <section className="mb-16">
              {/* Main Title */}
              <div className="mb-12">
                <h1 className="text-5xl md:text-7xl font-black text-[#fafafa] mb-6 leading-tight font-orbitron">
              Stream. Connect. Skate.
            </h1>
                <h2 className="text-2xl mb-8 text-[#fafafa]">Your Skateboarding Social Universe.</h2>
              </div>

              {/* Video Ad Style Sequence */}
              <div className="space-y-16 max-w-4xl mx-auto">
                {/* Action Shot */}
                <div className="text-center">
                  <div className="mb-6">
                    <img 
                      src={checkinMapImage} 
                      alt="SkateHubba Check-in Map" 
                      className="w-full max-w-lg mx-auto rounded-lg shadow-2xl bg-[#232323]"
                      data-testid="img-action-shot"
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-orange-400 mb-4 tracking-wide">
                    THIS IS WHERE IT STARTS...
                  </h3>
                </div>

                {/* Follow Up Shot */}
                <div className="text-center">
                  <div className="mb-6">
                    <img 
                      src={graffWallRack} 
                      alt="Pull Up and Drop Clips" 
                      className="w-full max-w-lg mx-auto rounded-lg shadow-2xl bg-[#232323]"
                      data-testid="img-follow-up-shot"
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-[#fafafa] mb-4 tracking-wide">
                    PULL UP. DROP CLIPS. CHALLENGE ANYONE.
                  </h3>
                </div>

                {/* Board/Unique Moment Shot */}
                <div className="text-center">
                  <div className="mb-6">
                    <img 
                      src={shopTemplate} 
                      alt="Earn Respect and Level Up" 
                      className="w-full max-w-lg mx-auto rounded-lg shadow-2xl bg-[#232323]"
                      data-testid="img-board-shot"
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-orange-400 mb-4 tracking-wide">
                    EARN RESPECT. LEVEL UP. REP YOUR SPOT.
                  </h3>
                </div>

                {/* End Shot with Call to Action */}
                <div className="text-center bg-black/60 rounded-2xl p-12 border border-orange-400/30">
                  <div className="mb-8">
                    <img 
                      src={nftShoe} 
                      alt="SkateHubba NFT Gear" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-2xl bg-[#232323]"
                      data-testid="img-end-shot"
                    />
                  </div>
                  <h1 className="text-6xl font-bold text-[#fafafa] mb-6 tracking-wider">
                    SKATEHUBBA
                  </h1>
                  <h2 className="text-2xl font-bold text-orange-400 mb-8 tracking-wide">
                    SKATE. CHALLENGE. STREAM. TRADE.
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <a 
                      href="/donate"
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold px-12 py-4 rounded-lg transition-all transform hover:scale-105 shadow-2xl"
                      data-testid="button-support-now"
                    >
                      SUPPORT NOW
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Description */}
              <div className="mt-16 text-center">
                <p className="text-lg text-[#fafafa] max-w-3xl mx-auto leading-relaxed">
                  Level up your skate life: customize your skater, discover gear, join digital sessions, and share clips with your crew. SkateHubba is where digital meets street.
                </p>
                <div className="mt-8">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button 
                      onClick={() => scrollToSection('features')}
                      className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer text-lg font-semibold"
                      data-testid="link-meet-crew"
                    >
                      Meet Your Crew →
                    </button>
                    <a 
                      href="/donate"
                      className="px-6 py-2 bg-orange-400/20 border border-orange-400/50 text-orange-400 rounded-lg hover:bg-orange-400/30 transition-all text-sm font-semibold"
                      data-testid="button-support-project"
                    >
                      💰 Support This Project
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section py-24 bg-[#0a0a0a]">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#fafafa] font-orbitron">
              Features
            </h2>
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
                    <span className="text-orange-400">💰</span>
                    <span>Trade exclusive gear, NFTs & collectibles with your crew</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-400">🤝</span>
                    <span>Connect, chat, & squad up with other skaters worldwide</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Development Roadmap */}
            <section className="mb-12 bg-black/40 rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-8 text-[#fafafa] text-center font-orbitron">Development Roadmap</h3>

              <div className="max-w-4xl mx-auto space-y-8">

                {/* Phase 1 */}
                <div className="border-l-4 border-orange-400 pl-6">
                  <h4 className="text-2xl font-bold text-orange-400 mb-4 font-orbitron">Phase 1: Core Loop & Community</h4>
                  <div className="space-y-3 text-[#fafafa]">
                    <p><strong>Remote S.K.A.T.E. Battles:</strong> Video upload, challenge/response, 24-hour timer, and basic trick validation (manual at first, AI-assisted later).</p>
                    <p><strong>Map & Check-Ins:</strong> Geolocation map with skate spots, shops, and parks. Check-in for rewards and see who's nearby.</p>
                    <p><strong>Live Sessions:</strong> Simple live stream/spectate feature, plus a "Trenches" feed for clips and feedback.</p>
                    <p><strong>Closet & Avatars:</strong> Basic avatar customization and digital closet for gear flexing.</p>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="border-l-4 border-orange-400 pl-6">
                  <h4 className="text-2xl font-bold text-orange-400 mb-4 font-orbitron">Phase 2: Social & Progression</h4>
                  <div className="space-y-3 text-[#fafafa]">
                    <p><strong>Crews & Rep:</strong> Crew creation, stats, badges, and leaderboards.</p>
                    <p><strong>Trading & Collectibles:</strong> Item trading with rarity/history, daily challenges, and coin/cosmetic rewards.</p>
                    <p><strong>Notifications & Chat:</strong> Real-time alerts and WebSocket chat for battles and sessions.</p>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="border-l-4 border-orange-400 pl-6">
                  <h4 className="text-2xl font-bold text-orange-400 mb-4 font-orbitron">Phase 3: AR & Advanced Features</h4>
                  <div className="space-y-3 text-[#fafafa]">
                    <p><strong>AR Spot Check-Ins:</strong> Camera overlay for immersive check-ins and navigation.</p>
                    <p><strong>Advanced Customization:</strong> More avatar/closet options, limited drops, and pro features.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="gallery-section py-24 bg-[#0a0a0a]">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#fafafa] font-orbitron">
                  Gallery
                </h2>
                <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
                  Explore the visual journey of SkateHubba™ - from character customization to immersive environments
                </p>
                <div className="bg-[#131313] rounded-2xl border border-gray-700 overflow-hidden">
                  <ImageCarousel slides={gallerySlides} />
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Join Section */}
        <section id="join" className="join-section py-24 bg-[#181818]">
          <div className="container mx-auto px-4">
            <article className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#fafafa] font-orbitron">
              Join the Community
            </h2>
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

        {/* Social Follow Section */}
        <section className="py-12 bg-black/50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-6 text-[#fafafa] font-orbitron">Follow Us</h3>
            <p className="text-lg mb-8 text-[#fafafa]">Stay in the loop and connect with the culture:</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 max-w-2xl mx-auto">
              <a 
                href="https://instagram.com/SkateHubba_app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-orange-400 hover:text-orange-300 transition-colors text-lg"
                data-testid="link-instagram"
              >
                <span>📸</span>
                <span>Instagram: @SkateHubba_app</span>
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61578731058004&mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-orange-400 hover:text-orange-300 transition-colors text-lg"
                data-testid="link-facebook"
              >
                <span>📘</span>
                <span>Facebook: SkateHubba</span>
              </a>
              <a 
                href="/donate"
                className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
                data-testid="link-donate-footer"
              >
                <span>💰</span>
                <span>Donate to Dev</span>
              </a>
            </div>
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
            <h3 id="privacy-title" className="text-2xl font-bold mb-4 font-orbitron">Privacy Policy</h3>
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
            <h3 id="terms-title" className="text-2xl font-bold mb-4 font-orbitron">Terms of Service</h3>
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
            <h3 id="accessibility-title" className="text-2xl font-bold mb-4 font-orbitron">Accessibility</h3>
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