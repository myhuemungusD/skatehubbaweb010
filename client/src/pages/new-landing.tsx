
import { useState } from "react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { z } from "zod";
import { subscribeSchema } from "@shared/schema";

const DONATE_STRIPE = import.meta.env.VITE_DONATE_STRIPE_URL || "#";
const DONATE_PAYPAL = import.meta.env.VITE_DONATE_PAYPAL_URL || "#";

export default function NewLanding() {
  return (
    <div>
      <Header />
      <Hero />
      <SocialProof />
      <Features />
      <Donate />
      <Signup />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <nav className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="text-2xl">🛹</span>
          <span>SkateHubba</span>
        </a>
        <div className="hidden sm:flex items-center gap-2">
          <a href="#features" className="btn btn-ghost">Features</a>
          <a href="#donate" className="btn btn-ghost">Donate</a>
          <a href="#signup" className="btn btn-primary">Join the beta</a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            SkateHubba
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Own your tricks. Play SKATE anywhere.
          </p>
          <p className="mt-2 text-gray-600">
            Remote SKATE battles. Legendary spot check-ins. Live lobbies. Built for core skaters.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#donate" className="btn btn-primary">Donate</a>
            <a href="#signup" className="btn">Get beta access</a>
          </div>
          <ul className="mt-6 text-sm text-gray-500">
            <li>24-hr trick reply window · Legendary spot multipliers · Live lobbies and replays</li>
          </ul>
        </div>
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎥</div>
              <p className="text-gray-500">Demo video coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { number: "1,000+", label: "Beta signups" },
    { number: "50+", label: "Legendary spots" },
    { number: "24/7", label: "Global battles" },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-black">{stat.number}</div>
              <div className="text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: "🏆",
      title: "Remote SKATE battles",
      description: "Challenge anyone, anywhere. Upload tricks, vote on winners, climb the leaderboards."
    },
    {
      icon: "📍",
      title: "Legendary spot check-ins",
      description: "Find iconic skate spots worldwide. Check-in for rewards and rep your local scene."
    },
    {
      icon: "🎥",
      title: "Live streaming",
      description: "Broadcast your sessions, watch others skate, and build your following."
    },
    {
      icon: "👕",
      title: "Digital closet",
      description: "Customize your avatar with the latest gear and show off your style."
    },
    {
      icon: "🌍",
      title: "Global community",
      description: "Connect with skaters worldwide, join crews, and make lasting friendships."
    },
    {
      icon: "📱",
      title: "Mobile-first",
      description: "Designed for your phone. Capture, share, and compete on the go."
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to dominate
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built by skaters, for skaters. Every feature designed to elevate your game.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Donate() {
  return (
    <section id="donate" className="bg-gray-50 py-20 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Support the vision
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Support the build. Keep the beta rolling.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={DONATE_STRIPE}
            className="btn btn-primary px-8 py-3"
          >
            Donate with Stripe
          </a>
          <a 
            href={DONATE_PAYPAL}
            className="btn px-8 py-3"
          >
            Donate with PayPal
          </a>
        </div>
      </div>
    </section>
  );
}

function Signup() {
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
        setEmail("");
        setFirstName("");
        toast({
          title: "Welcome to SkateHubba! 🛹",
          description: data.msg || "You're now on the beta list!",
          variant: "default"
        });
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

  return (
    <section id="signup" className="py-20 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Join the beta
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Be the first to experience the future of skateboarding. Get exclusive early access.
        </p>
        
        {isSuccess ? (
          <div className="card max-w-md mx-auto">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">You're in!</h3>
            <p className="text-gray-600">We'll notify you when the beta launches.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card max-w-md mx-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="signup-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationError("");
                  }}
                  required
                  aria-describedby="signup-form-error"
                  aria-invalid={validationError ? "true" : "false"}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:border-transparent ${
                    validationError ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <div id="signup-form-error" role="alert" aria-live="polite" className="min-h-[1.25rem]">
                  {validationError && (
                    <p className="text-red-500 text-sm">{validationError}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                {isSubmitting ? "Submitting..." : "Join the beta"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🛹</span>
            <span className="text-xl font-bold">SkateHubba</span>
          </div>
          <p className="text-gray-400 max-w-md mx-auto">
            The ultimate skateboarding platform. Built by skaters, for skaters.
          </p>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 SkateHubba. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
