import { useState } from "react";
import Navigation from "../components/Navigation";
import BackgroundCarousel from "../components/BackgroundCarousel";
import EmailSignup from "../components/EmailSignup";
import { DonorRecognition } from "../components/DonorRecognition";

export default function Home() {
  const scrollToSignup = () =>
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });

  return (
    <BackgroundCarousel className="text-white font-inter">
      {/* Nav + Background */}
      <Navigation />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-black/70 to-black/90">
        <div className="absolute inset-0 bg-[url('/graffiti-wall.jpg')] bg-cover bg-center opacity-40" />
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl font-extrabold font-orbitron tracking-tight leading-tight">
            Own Your Tricks.
            <br />
            <span className="text-orange-500">Play SKATE Anywhere.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The ultimate mobile skateboarding platform — where your clips, spots, and
            sessions become collectible.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={scrollToSignup}
              className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold px-8 py-4 rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              Join the Beta
            </button>
            <a
              href="/map"
              className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-lg font-bold transition-all"
            >
              Explore Spots
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 bg-black text-center border-t border-orange-500/10">
        <h2 className="text-3xl font-orbitron mb-6 text-orange-400">Join 1,000+ skaters</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Backed by local crews, shop owners, and the core scene.
        </p>
        <div className="flex justify-center gap-8 mt-8 text-3xl">
          <span>📸</span>
          <span>🎥</span>
          <span>🏁</span>
          <span>🛹</span>
          <span>💥</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 bg-gradient-to-b from-zinc-900 to-black text-white border-t border-orange-500/10">
        <h2 className="text-4xl font-orbitron text-center mb-16 text-orange-400">
          What Makes SkateHubba Different
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
          <div className="bg-black/60 border border-orange-400/20 p-8 rounded-xl text-center">
            <div className="text-5xl mb-4">🛹</div>
            <h3 className="text-xl font-bold mb-2 text-orange-400">Remote S.K.A.T.E.</h3>
            <p className="text-gray-300 text-sm">
              Battle friends anywhere with real-time trick validation.
            </p>
          </div>
          <div className="bg-black/60 border border-orange-400/20 p-8 rounded-xl text-center">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-2 text-orange-400">Legendary Spots</h3>
            <p className="text-gray-300 text-sm">
              Check in at real-world spots to earn points and respect.
            </p>
          </div>
          <div className="bg-black/60 border border-orange-400/20 p-8 rounded-xl text-center">
            <div className="text-5xl mb-4">🎥</div>
            <h3 className="text-xl font-bold mb-2 text-orange-400">Live Sessions</h3>
            <p className="text-gray-300 text-sm">
              Stream sessions and let others spectate or drop props.
            </p>
          </div>
          <div className="bg-black/60 border border-orange-400/20 p-8 rounded-xl text-center">
            <div className="text-5xl mb-4">🧢</div>
            <h3 className="text-xl font-bold mb-2 text-orange-400">Digital Closet</h3>
            <p className="text-gray-300 text-sm">
              Collect gear, flex your setup, and unlock pro collabs.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-400 bg-black border-t border-orange-400/10">
        <small>
          &copy; 2025 <span className="text-orange-400">SkateHubba</span> — Own Your Tricks.
        </small>
      </footer>
    </BackgroundCarousel>
  );
}
