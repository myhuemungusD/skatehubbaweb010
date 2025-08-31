import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Background from "../components/BackgroundCarousel";
import SkateHubbaLogo from "../components/SkateHubbaLogo";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import { analytics } from "../lib/analytics";
import { z } from "zod";
import {
  ChevronDown,
  Play,
  CheckCircle,
  Zap,
  MapPin,
  Users,
  Trophy,
} from "lucide-react";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
});

// Apple-level micro-interaction hooks
const useSpringAnimation = (isVisible: boolean) => {
  const [style, setStyle] = useState({
    transform: "translateY(20px)",
    opacity: 0,
  });

  useEffect(() => {
    if (isVisible) {
      setStyle({
        transform: "translateY(0px)",
        opacity: 1,
      });
    }
  }, [isVisible]);

  return {
    style: {
      ...style,
      transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    },
  };
};

// Mobile-optimized loading button
interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const LoadingButton = ({ isLoading, children, className = "", ...props }: LoadingButtonProps) => (
  <button
    {...props}
    disabled={isLoading}
    className={`${className} relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed`}
    style={{
      minHeight: "48px",
      fontSize: "16px",
      WebkitTapHighlightColor: "transparent",
      touchAction: "manipulation",
    }}
  >
    <span
      className={`transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}
    >
      {children}
    </span>
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      </div>
    )}
  </button>
);

// Systematic component spacing
interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section = ({ children, className = "", ...props }: SectionProps) => (
  <section className={`py-16 md:py-24 ${className}`} {...props}>
    <div className="max-w-6xl mx-auto px-6">{children}</div>
  </section>
);

export default function UnifiedLanding() {
  const [showDetailedFeatures, setShowDetailedFeatures] = useState(false);

  // Progressive disclosure with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".fade-in-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <SkateHubbaLogo />
      <h1>Unified Landing Page</h1>
      <p>This is a placeholder unified landing page.</p>
    </div>
  );
}
