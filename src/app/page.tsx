"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "url('/attached_assets/graffwallskateboardrack_1754296307132.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center space-y-6 px-4">
        <div className="w-60 h-60 relative mb-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6a00" />
                <stop offset="100%" stopColor="#24d52b" />
              </linearGradient>
            </defs>
            <rect x="60" y="80" width="80" height="25" rx="12" fill="url(#boardGrad)" />
            <circle cx="75" cy="110" r="8" fill="#fafafa" />
            <circle cx="125" cy="110" r="8" fill="#fafafa" />
            <text
              x="100"
              y="100"
              textAnchor="middle"
              fill="#000"
              fontSize="16"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
            >
              HUBBA
            </text>
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[#ff6a00] drop-shadow-lg">
          Own Your Tricks
        </h1>

        <nav className="flex flex-wrap gap-4 mt-6 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-[#24d52b] text-black font-semibold hover:bg-[#1fb125] transition"
          >
            Login
          </Link>
          <Link
            href="/profile"
            className="px-6 py-3 rounded-xl bg-[#ff6a00] text-black font-semibold hover:bg-[#e55f00] transition"
          >
            Profile
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition"
          >
            Shop
          </Link>
          <Link
            href="/closet"
            className="px-6 py-3 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition"
          >
            Closet
          </Link>
          <Link
            href="/map"
            className="px-6 py-3 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition"
          >
            Map
          </Link>
        </nav>
      </div>
    </main>
  );
}
