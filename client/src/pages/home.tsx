import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Video, 
  Users, 
  ChevronDown, 
  Download,
  CheckCircle,
  Shield,
  Star,
  Instagram,
  Youtube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SkateHubbaLogo from "@/components/SkateHubbaLogo";

export default function Home() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thanks for subscribing!",
        description: "You'll receive updates about SkateHubba soon.",
      });
      setEmail("");
    }
  };

  const handleAppStoreDownload = () => {
    toast({
      title: "Coming Soon to App Store!",
      description: "SkateHubba will launch on the App Store after the free beta period.",
    });
  };

  const handleGooglePlayDownload = () => {
    toast({
      title: "Coming Soon to Google Play!",
      description: "SkateHubba will launch on Google Play after the free beta period.",
    });
  };

  const handleBetaSignup = () => {
    toast({
      title: "Get Free Beta Access!",
      description: "Download the SkateHubba beta for free - no payment required!",
    });
  };

  const scrollToMain = () => {
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-skatehubba-dark text-skatehubba-light">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-skatehubba-dark/95 backdrop-blur-sm border-b border-skatehubba-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <SkateHubbaLogo size="md" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1547483921-34b1271a93f2?q=80&w=2070&auto=format&fit=crop')"
          }}
        ></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          {/* SkateHubba Logo */}
          <div className="mb-8 flex justify-center">
            <SkateHubbaLogo size="xl" className="animate-pulse" />
          </div>
          
          <div className="mb-6">
            <span className="inline-block bg-skatehubba-primary text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 uppercase tracking-wider leading-tight">
            The Streets Are <span className="text-skatehubba-primary">Calling</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
            The ultimate mobile skateboarding platform. Challenge skaters worldwide, battle in real-time, 
            and climb the leaderboard. Street culture meets social gaming.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <Button 
              onClick={handleBetaSignup}
              className="group bg-skatehubba-primary hover:bg-skatehubba-primary-hover text-white font-black py-6 px-12 text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 min-w-[300px] rounded-full"
            >
              <Download className="w-6 h-6 group-hover:animate-bounce" />
              <span>Download Beta for FREE</span>
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleAppStoreDownload}
                variant="outline"
                className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-skatehubba-dark font-bold py-3 px-6 text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 min-w-[200px]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Coming to App Store</span>
              </Button>
              <Button 
                onClick={handleGooglePlayDownload}
                variant="outline"
                className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-skatehubba-dark font-bold py-3 px-6 text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2 min-w-[200px]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span>Coming to Google Play</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer"
          onClick={scrollToMain}
        >
          <ChevronDown className="text-skatehubba-primary text-2xl" />
        </div>
      </header>

      <main>
        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 uppercase tracking-wide">
                Why You'll <span className="text-skatehubba-primary">Love</span> SkateHubba
              </h2>
              <div className="w-20 h-1 bg-skatehubba-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Feature Card 1 */}
              <Card className="group bg-skatehubba-card border-none hover:bg-opacity-80 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-skatehubba-primary text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-10 h-10" />
                  </div>
                  <h3 className="text-skatehubba-primary text-xl font-bold mb-4">Live S.K.A.T.E. Battles (Pro Rules)</h3>
                  <p className="text-skatehubba-secondary leading-relaxed">
                    Challenge anyone, anywhere. With our "One-Shot" rule, you have 30 seconds to land your trick. 
                    No retakes. No mercy. Pure skill on demand.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature Card 2 */}
              <Card className="group bg-skatehubba-card border-none hover:bg-opacity-80 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-skatehubba-primary text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-10 h-10" />
                  </div>
                  <h3 className="text-skatehubba-primary text-xl font-bold mb-4">Upload & Showcase Your Clips</h3>
                  <p className="text-skatehubba-secondary leading-relaxed">
                    Share your best lines and single tricks from Instagram, TikTok, or your camera roll. 
                    Get featured in the community showcase and earn respect.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature Card 3 */}
              <Card className="group bg-skatehubba-card border-none hover:bg-opacity-80 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl md:col-span-2 lg:col-span-1">
                <CardContent className="p-8">
                  <div className="text-skatehubba-primary text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10" />
                  </div>
                  <h3 className="text-skatehubba-primary text-xl font-bold mb-4">Connect with the Community</h3>
                  <p className="text-skatehubba-secondary leading-relaxed">
                    Use the built-in direct messaging to connect with friends, find skaters in your area, 
                    and even chat with pros who are active on the platform.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-skatehubba-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-3xl lg:text-4xl font-black text-skatehubba-primary mb-2 group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-skatehubba-secondary font-semibold uppercase tracking-wide">Active Skaters</div>
              </div>
              <div className="group">
                <div className="text-3xl lg:text-4xl font-black text-skatehubba-primary mb-2 group-hover:scale-110 transition-transform duration-300">1M+</div>
                <div className="text-skatehubba-secondary font-semibold uppercase tracking-wide">Tricks Landed</div>
              </div>
              <div className="group">
                <div className="text-3xl lg:text-4xl font-black text-skatehubba-primary mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-skatehubba-secondary font-semibold uppercase tracking-wide">Live Battles</div>
              </div>
              <div className="group">
                <div className="text-3xl lg:text-4xl font-black text-skatehubba-primary mb-2 group-hover:scale-110 transition-transform duration-300">100+</div>
                <div className="text-skatehubba-secondary font-semibold uppercase tracking-wide">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* Beta Section */}
        <section className="py-16 lg:py-24 bg-skatehubba-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--skatehubba-primary)] to-[var(--skatehubba-primary-hover)] opacity-90"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="mb-6">
              <span className="inline-block bg-white text-skatehubba-primary px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-white uppercase tracking-wide">
              Download the Beta for <span className="text-black">FREE</span>
            </h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed">
              Be among the first to experience SkateHubba. Get early access to the beta version 
              completely free and help shape the future of mobile skateboarding.
            </p>
            
            <Button 
              onClick={handleBetaSignup}
              className="group inline-flex items-center gap-3 bg-white text-skatehubba-primary font-black py-6 px-16 text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50 rounded-full"
            >
              <Download className="text-xl group-hover:animate-bounce" />
              <span>Get Free Beta Access</span>
            </Button>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-bold">100% FREE Beta</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-bold">Early Access</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Star className="w-5 h-5" />
                <span className="text-sm font-bold">No Payment Required</span>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-skatehubba-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Stay in the Loop</h3>
            <p className="text-skatehubba-secondary mb-8 max-w-2xl mx-auto">
              Get exclusive updates about new features, tournaments, and pro skater partnerships.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-skatehubba-card text-skatehubba-light border-gray-600 focus:border-skatehubba-primary"
                required
              />
              <Button 
                type="submit" 
                className="bg-skatehubba-primary hover:bg-skatehubba-primary-hover text-white px-6 py-3 font-semibold"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-skatehubba-primary mb-4">SkateHubba</h4>
              <p className="text-skatehubba-secondary mb-4 max-w-md">
                The ultimate mobile skateboarding platform connecting street culture enthusiasts worldwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-skatehubba-secondary hover:text-skatehubba-primary transition-colors duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-skatehubba-secondary hover:text-skatehubba-primary transition-colors duration-300">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a href="#" className="text-skatehubba-secondary hover:text-skatehubba-primary transition-colors duration-300">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="text-skatehubba-secondary hover:text-skatehubba-primary transition-colors duration-300">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">App</h5>
              <ul className="space-y-2 text-skatehubba-secondary">
                <li><a href="#" className="hover:text-skatehubba-primary transition-colors duration-300">Download</a></li>
                <li><a href="#" className="hover:text-skatehubba-primary transition-colors duration-300">Features</a></li>
                <li><a href="#" className="hover:text-skatehubba-primary transition-colors duration-300">System Requirements</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-skatehubba-secondary">
                <li><a href="#" className="hover:text-skatehubba-primary transition-colors duration-300">About</a></li>
                <li><a href="#" className="hover:text-skatehubba-primary transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-skatehubba-primary transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-skatehubba-secondary">
              &copy; 2025 SkateHubba.com - For Skaters, By Skaters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
