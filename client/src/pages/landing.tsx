import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import BackgroundCarousel from "../components/BackgroundCarousel";
import { useToast } from "../hooks/use-toast";

const SkateHubbaLogo = () => (
  <div className="relative">
    <svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-orange-500"
    >
      {/* Skateboard deck */}
      <path
        d="M20 45 L80 45 Q85 45 85 50 L85 55 Q85 60 80 60 L20 60 Q15 60 15 55 L15 50 Q15 45 20 45 Z"
        fill="currentColor"
        stroke="#fafafa"
        strokeWidth="2"
      />
      
      {/* Wheel wells */}
      <circle cx="25" cy="52.5" r="8" fill="#181818" stroke="currentColor" strokeWidth="2"/>
      <circle cx="75" cy="52.5" r="8" fill="#181818" stroke="currentColor" strokeWidth="2"/>
      
      {/* Trucks */}
      <rect x="22" y="48" width="6" height="9" fill="#666" rx="1"/>
      <rect x="72" y="48" width="6" height="9" fill="#666" rx="1"/>
      
      {/* Street art elements */}
      <text x="50" y="55" textAnchor="middle" fontSize="8" fill="#fafafa" fontWeight="bold">SH</text>
      
      {/* Grip tape texture lines */}
      <line x1="25" y1="49" x2="25" y2="56" stroke="#333" strokeWidth="0.5"/>
      <line x1="30" y1="49" x2="30" y2="56" stroke="#333" strokeWidth="0.5"/>
      <line x1="70" y1="49" x2="70" y2="56" stroke="#333" strokeWidth="0.5"/>
      <line x1="75" y1="49" x2="75" y2="56" stroke="#333" strokeWidth="0.5"/>
    </svg>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-red-500 text-white">
      <h1 className="text-4xl p-8">TEST: Landing Page is Working!</h1>
      <p className="p-8">If you can see this, the component is rendering correctly.</p>
      <p className="p-8">This should show a bright red background with white text.</p>
    </div>
  );
}