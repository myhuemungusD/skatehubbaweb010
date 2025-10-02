import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { analytics } from "../lib/analytics";
import { Mail, Phone, Calendar, Users, MapPin, Trophy } from "lucide-react";
import BackgroundCarousel from "../components/BackgroundCarousel";
import Navigation from "../components/Navigation";
import { z } from "zod";
import { NewSubscriberInput } from "../../../shared/schema";
import EmailSignup from "../components/EmailSignup";

// Placeholder for custom SkateHubba images - removed missing imports

// Import components
import { DonorRecognition } from "../components/DonorRecognition";

// Hero Access Button Component - Simplified with UltimateEmailSignup  
const HeroAccessButton = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = (data: any) => {
    // Track successful signup with existing analytics
    analytics.subscribeSubmitted(data.email);
    analytics.subscribeSuccess();
  };

  if (!showForm) {
    return (
      <button
        onClick={() => {
          const element = document.getElementById('signup');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          analytics.ctaClickHero('join_beta'); // Track CTA click
        }}
        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-lg md:text-xl font-bold px-8 md:px-12 py-4 md:py-5 rounded-lg transition-all transform hover:scale-105 shadow-2xl min-h-[56px] touch-manipulation"
        data-testid="button-join-beta"
      >
        Join the Beta
      </button>
    );
  }

  return (
    <div className="space-y-4 max-w-md mx-auto lg:mx-0">
      <EmailSignup />
      <button
        onClick={() => setShowForm(false)}
        className="text-orange-400 hover:text-orange-300 text-sm"
        data-testid="button-back-to-cta"
      >
        ← Back to overview
      </button>
    </div>
  );
};




export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { toast } = useToast();

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setIsSubmitting(true);

    try {
      const validatedData = NewSubscriberInput.parse({ 
        firstName: firstName.trim() || undefined,
        email: email.trim().toLowerCase()
      });

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData)
      });

      const data = await response.json();

      if (response.ok) {
        analytics.subscribeSubmitted(email);
        analytics.subscribeSuccess();

        if (data.status === "exists") {
          toast({
            title: "Already on the list! 👋",
            description: "You're already signed up. We'll keep you updated!",
          });
        } else {
          toast({
            title: "Welcome to SkateHubba! 🎉",
            description: data.msg || "You're now on the beta list!",
          });
        }

        setFirstName('');
        setEmail('');
      } else {
        throw new Error(data.error || 'Signup failed');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0]?.message || "Please check your input");
      } else {
        toast({
          title: "Signup failed",
          description: "Please try again in a moment.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
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
    <BackgroundCarousel className="text-[#fafafa]">
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>


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

        {/* Donor Recognition */}
        <DonorRecognition />

        <Navigation />

        {/* Main Content */}
        <main id="main-content" className="container mx-auto px-4 py-8 overflow-x-hidden" role="main">
          <div className="text-center">
            {/* Minimal Hero Section */}
            <section className="py-12 md:py-24">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Text Content */}
                  <div className="text-center lg:text-left space-y-6 md:space-y-8 px-4 lg:px-0">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#fafafa] leading-tight font-orbitron">
                      SkateHubba
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
                      Own your tricks. Play S.K.A.T.E. anywhere.
                    </p>

                    {/* Trust & Proof Row */}
                    <div className="space-y-4 max-w-full">
                      {/* Social Proof */}
                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-sm text-gray-400">
                        <span className="font-medium text-center sm:text-left">As seen on:</span>
                        <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
                          <a href="https://instagram.com/SkateHubba_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                            <span className="text-lg">📸</span>
                          </a>
                          <a href="https://www.tiktok.com/@skatehubba_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                            <span className="text-lg">🎵</span>
                          </a>
                          <a href="https://www.facebook.com/profile.php?id=61578731058004" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                            <span className="text-lg">📘</span>
                          </a>
                          <a href="https://www.youtube.com/channel/UCwpWreJbWngkaLVsdOIKyUQ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                            <span className="text-lg">📺</span>
                          </a>
                        </div>
                      </div>

                      {/* What's Inside */}
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-600/30 max-w-full">
                        <h4 className="text-orange-400 font-semibold mb-3 text-center lg:text-left">What's inside:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-400">⚡</span>
                            <span>Remote S.K.A.T.E.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-400">📍</span>
                            <span>Spot Check-ins</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-400">📹</span>
                            <span>Live Sessions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-400">🎨</span>
                            <span>Closet/Gear</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Beta Signup Form */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-400/30 max-w-md mx-auto lg:mx-0">
                      <h3 className="text-2xl font-bold text-[#fafafa] mb-4 text-center lg:text-left">
                        Join the beta
                      </h3>
                      <p className="text-gray-300 mb-6 text-center lg:text-left">
                        Be the first to experience the future of skateboarding. Get exclusive early access.
                      </p>
                      <form onSubmit={handleJoinSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                            required
                            data-testid="input-hero-firstname"
                          />
                          <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                            required
                            data-testid="input-hero-email"
                          />
                        </div>
                        {validationError && (
                          <p className="text-red-400 text-sm">{validationError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-3 rounded-lg transition-colors"
                          data-testid="button-hero-join"
                        >
                          {isSubmitting ? 'Joining...' : 'Join the beta'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Phone Mockup */}
                  <div className="flex justify-center lg:justify-end px-4 lg:px-0">
                    <div className="relative max-w-xs lg:max-w-none">
                      {/* Phone Frame */}
                      <div className="relative w-64 md:w-72 h-80 md:h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl border-4 border-gray-700">
                        {/* Screen */}
                        <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative">
                          {/* Map/Check-in Screenshot */}
                          <div
                            className="w-full h-full bg-gradient-to-br from-orange-900/30 to-gray-900 flex items-center justify-center"
                            data-testid="hero-phone-mockup"
                          >
                            <div className="text-center text-white">
                              <div className="text-4xl mb-2">🛹</div>
                              <div className="text-sm">Map Interface</div>
                            </div>
                          </div>

                          {/* Floating UI Elements */}
                          <div className="absolute top-4 left-4 right-4">
                            <div className="bg-black/80 rounded-lg px-3 py-2 text-white text-sm font-semibold">
                              📍 Check in at spots near you
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-orange-500/90 rounded-lg px-4 py-3 text-white text-center font-bold">
                              Tap to Check In
                            </div>
                          </div>
                        </div>

                        {/* Phone Details */}
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full"></div>
                      </div>

                      {/* Floating Action Bubble */}
                      <div className="absolute -top-6 -right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                        <span className="text-2xl">🏁</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SkateHubba Collectibles Section */}
            <section className="py-24 bg-gradient-to-br from-orange-500/10 to-purple-600/10 border-y border-orange-400/20">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-black text-[#fafafa] mb-8 font-orbitron leading-tight">
                    Your tricks are worth more than likes—now they're collectibles.
                  </h2>
                  <div className="text-left bg-black/50 rounded-2xl p-8 border border-orange-400/30">
                    <h3 className="text-2xl md:text-3xl font-bold text-orange-400 mb-6 font-orbitron">
                      SkateHubba Collectibles – Turn Tricks Into Treasure
                    </h3>
                    <div className="space-y-4 text-[#fafafa] text-lg leading-relaxed">
                      <p>
                        Land a banger? Now it's more than just a clip. With SkateHubba, your best tricks and legendary spot moments can be minted as one-of-a-kind digital collectibles. They're locked on the blockchain—so they can't be faked, copied, or lost.
                      </p>
                      <p>
                        Trade rare gear, earn exclusive drops from your favorite pros, and unlock secret challenges only available to collectible holders. From a first-try rail to an MBD at your local spot, SkateHubba lets you own your moment, flex it forever, and even get rewarded for it.
                      </p>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                      <div className="flex items-center gap-2 text-orange-400 font-semibold">
                        <span className="text-2xl">🏆</span>
                        <span>Mint Your Moments</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-400 font-semibold">
                        <span className="text-2xl">🔒</span>
                        <span>Blockchain Verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-400 font-semibold">
                        <span className="text-2xl">💎</span>
                        <span>Trade & Collect</span>
                      </div>
                    </div>
                  </div>
                </div>
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


            {/* Email Signup Section */}
            <section id="signup" className="py-16 bg-black/50 rounded-2xl mb-12">
              <div className="container mx-auto px-4 text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-5 text-[#fafafa] font-orbitron">Get SkateHubba Updates</h3>
                <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                  Sign up for exclusive content, early access to features, and news about the SkateHubba community.
                </p>
                <EmailSignup />
              </div>
            </section>


          </div>
        </main>


        {/* Social Follow Section */}
        <section className="py-12 bg-black/50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-6 text-[#fafafa] font-orbitron">Follow Us</h3>
            <p className="text-lg mb-8 text-[#fafafa]">Stay in the loop and connect with the culture:</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 max-w-4xl mx-auto">
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
                href="https://www.tiktok.com/@skatehubba_app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-orange-400 hover:text-orange-300 transition-colors text-lg"
                data-testid="link-tiktok"
              >
                <span>🎵</span>
                <span>TikTok: @skatehubba_app</span>
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
                href="https://www.youtube.com/channel/UCwpWreJbWngkaLVsdOIKyUQ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-orange-400 hover:text-orange-300 transition-colors text-lg"
                data-testid="link-youtube"
              >
                <span>📺</span>
                <span>YouTube: SkateHubba</span>
              </a>
              <a
                href="/donate"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
                data-testid="link-donate-footer"
              >
                <span>💚</span>
                <span>Support SkateHubba</span>
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
    </BackgroundCarousel>
  );
}