import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { analytics } from "../lib/analytics";
import { Mail, Phone, Calendar, Users, MapPin, Trophy } from "lucide-react";
import BackgroundCarousel from "../components/BackgroundCarousel";
import { z } from "zod";
import { subscribeSchema } from "@shared/schema";

// Placeholder for custom SkateHubba images - removed missing imports

// Import components
import { DonorRecognition } from "../components/DonorRecognition";

// Hero Access Button Component
const HeroAccessButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Client-side validation
    try {
      const validatedData = subscribeSchema.parse({ email, firstName });
      setIsSubmitting(true);
      analytics.subscribeSubmitted();

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...validatedData,
          company: "" // honeypot field
        })
      });

      const data = await response.json();

      if (data.ok) {
        setIsSuccess(true);
        analytics.subscribeSuccess();
        toast({
          title: "Welcome to SkateHubba! 🎉",
          description: data.msg || "You're now on the beta list!",
        });
        setEmail("");
        setFirstName("");
      } else {
        toast({
          title: "Signup failed",
          description: data.msg || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0]?.message || "Please check your email");
      } else {
        toast({
          title: "Network Error",
          description: "Please check your connection and try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 max-w-md mx-auto lg:mx-0">
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-center">
          <div className="text-green-400 text-2xl mb-2">🎉</div>
          <h3 className="text-green-400 font-bold mb-1">You're In!</h3>
          <p className="text-green-300 text-sm">Get ready for updates, drops & sessions.</p>
        </div>
        <button
          onClick={() => {
            setIsSuccess(false);
            setShowForm(false);
          }}
          className="text-orange-400 hover:text-orange-300 text-sm"
        >
          Subscribe another email →
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-4 max-w-md mx-auto lg:mx-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="hero-email" className="sr-only">
              Email Address
            </label>
            <Input
              id="hero-email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError("");
              }}
              required
              aria-describedby="hero-form-description hero-form-error"
              aria-invalid={validationError ? "true" : "false"}
              className={`bg-[#232323] border-[#333] text-[#fafafa] placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] focus-visible:outline-none ${
                validationError ? "border-red-500" : ""
              }`}
            />
            <div id="hero-form-error" role="alert" aria-live="polite" className="min-h-[1.25rem]">
              {validationError && (
                <p className="text-red-400 text-sm">{validationError}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] focus-visible:outline-none"
            >
              {isSubmitting ? 'Joining...' : 'Join the beta'}
            </Button>
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              variant="outline"
              className="px-3 border-[#333] text-[#fafafa] hover:bg-[#333] focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] focus-visible:outline-none"
              aria-label="Close form"
            >
              ×
            </Button>
          </div>
        </form>
        <p id="hero-form-description" className="text-xs text-gray-300 text-center">
          Get updates on drops, sessions & early access
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        window.location.href = 'https://skate-hubba-frontend-jayham710.replit.app';
        analytics.ctaClickHero('get_early_access'); // Track CTA click
      }}
      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-lg md:text-xl font-bold px-8 md:px-12 py-4 md:py-5 rounded-lg transition-all transform hover:scale-105 shadow-2xl min-h-[56px] touch-manipulation"
      data-testid="button-get-early-access"
    >
      Get Early Access
    </button>
  );
};




export default function Home() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { toast } = useToast();

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Client-side validation
    try {
      const validatedData = subscribeSchema.parse({ email, firstName });
      setIsSubmitting(true);
      analytics.subscribeSubmitted();

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...validatedData,
          company: "" // honeypot field
        })
      });

      const data = await response.json();

      if (data.ok) {
        analytics.subscribeSuccess();
        toast({
          title: "Welcome to SkateHubba! 🎉",
          description: data.msg || "You're now on the beta list!",
        });
        setEmail("");
        setFirstName("");
      } else {
        toast({
          title: "Signup failed",
          description: data.msg || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0]?.message || "Please check your email");
      } else {
        toast({
          title: "Network Error",
          description: "Please check your connection and try again.",
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

        {/* Navigation */}
        <nav className="bg-[#131313] border-b border-[#333] mb-8">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-xl text-[#fafafa]">SkateHubba</strong>
              </div>
              <div className="flex gap-6 items-center">
                <button
                  onClick={() => {
                    window.location.href = 'https://skate-hubba-frontend-jayham710.replit.app';
                    analytics.ctaClickHero(); // Track CTA click
                  }}
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
                      Own your tricks. Play SKATE anywhere.
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

                    <HeroAccessButton />
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
                <p id="join-form-description" className="text-xl text-[#fafafa]">Be first to know about updates, exclusive gear drops & sessions.</p>
              </div>
              <form onSubmit={handleJoinSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="join-first-name" className="sr-only">
                    First Name
                  </label>
                  <Input
                    id="join-first-name"
                    type="text"
                    placeholder="Your Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    aria-describedby="join-form-description"
                    className="bg-[#232323] border-[#333] text-[#fafafa] placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] focus-visible:outline-none"
                    data-testid="input-firstname"
                  />
                </div>
                <div>
                  <label htmlFor="join-email" className="sr-only">
                    Email Address
                  </label>
                  <Input
                    id="join-email"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationError("");
                    }}
                    required
                    aria-describedby="join-form-description join-form-error"
                    aria-invalid={validationError ? "true" : "false"}
                    className={`bg-[#232323] border-[#333] text-[#fafafa] placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] focus-visible:outline-none ${
                      validationError ? "border-red-500" : ""
                    }`}
                    data-testid="input-email"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] focus-visible:outline-none"
                  data-testid="button-subscribe"
                  disabled={isSubmitting}
                  aria-describedby="join-form-description"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
              <div id="join-form-error" role="alert" aria-live="polite" className="min-h-[1.25rem] mt-4">
                {validationError && (
                  <p className="text-red-400 text-sm">{validationError}</p>
                )}
              </div>
            </article>
          </div>
        </section>

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
    </BackgroundCarousel>
  );
}