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
              {/* Navigation */}
              <Navigation />

              {/* HERO SECTION */}
              <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-black/70 to-black/90">
                <div className="absolute inset-0 bg-[url('/graffiti-wall.jpg')] bg-cover bg-center opacity-40" />
                <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                  <h1 className="text-6xl md:text-7xl font-extrabold font-orbitron tracking-tight leading-tight">
                    Own Your Tricks.
                    <br />
                    <span className="text-orange-500">Play SKATE Anywhere.</span>
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    The ultimate mobile skateboarding platform where every clip, spot,
                    and session tells a story.
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
                <h2 className="text-3xl font-orbitron mb-6 text-orange-400">
                  Join 1,000+ Skaters
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  Backed by local crews, shops, and the true core skate scene.
                </p>
                <div className="flex justify-center gap-8 mt-8 text-3xl">
                  <span>🛹</span>
                  <span>📹</span>
                  <span>🏁</span>
                  <span>🔥</span>
                  <span>💥</span>
                </div>
              </section>

              {/* FEATURE GRID */}
              <section className="py-28 bg-gradient-to-b from-zinc-900 to-black text-white border-t border-orange-500/10">
                <h2 className="text-4xl font-orbitron text-center mb-16 text-orange-400">
                  What Makes SkateHubba Different
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
                  {[
                    {
                      icon: "🛹",
                      title: "Remote S.K.A.T.E.",
                      desc: "Challenge friends from anywhere with real-time trick validation.",
                    },
                    {
                      icon: "📍",
                      title: "Legendary Spots",
                      desc: "Check in at real-world skate spots to earn points and respect.",
                    },
                    {
                      icon: "🎥",
                      title: "Live Sessions",
                      desc: "Stream sessions and let others spectate or drop props.",
                    },
                    {
                      icon: "🧢",
                      title: "Digital Closet",
                      desc: "Collect gear, flex your setup, and unlock pro collabs.",
                    },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="bg-black/60 border border-orange-400/20 p-8 rounded-xl text-center hover:border-orange-400/40 transition-all hover:scale-[1.02]"
                    >
                      <div className="text-5xl mb-4">{f.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-orange-400">
                        {f.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* COLLECTIBLES */}
              <section className="py-28 bg-black border-t border-orange-500/10 text-center">
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-8 text-orange-400">
                  Mint Your Moments.
                </h2>
                <p className="text-gray-300 max-w-3xl mx-auto text-lg mb-10">
                  Every landed trick becomes a verifiable collectible — proof of skill,
                  locked on the blockchain and owned by you.
                </p>
                <a
                  href="/closet"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg font-bold transition-transform hover:scale-105"
                >
                  See Collectibles
                </a>
              </section>

              {/* SIGNUP */}
              <section
                id="signup"
                className="py-24 bg-gradient-to-b from-orange-600/10 to-black text-center border-t border-orange-400/10"
              >
                <h2 className="text-4xl font-orbitron mb-6 text-orange-400">
                  Get Early Access
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8">
                  Sign up for beta access, exclusive drops, and SkateHubba updates.
                </p>
                <div className="max-w-md mx-auto">
                  <EmailSignup />
                </div>
              </section>

              {/* COMMUNITY */}
              <section className="py-20 bg-black border-t border-orange-500/10 text-center">
                <DonorRecognition />
                <h3 className="text-2xl font-orbitron text-orange-400 mb-4">
                  Follow the Movement
                </h3>
                <div className="flex flex-wrap justify-center gap-6 text-lg text-orange-400">
                  <a
                    href="https://instagram.com/SkateHubba_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-300"
                  >
                    📸 Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@skatehubba_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-300"
                  >
                    🎵 TikTok
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCwpWreJbWngkaLVsdOIKyUQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-300"
                  >
                    📺 YouTube
                  </a>
                  <a
                    href="mailto:hello@skatehubba.com"
                    className="hover:text-orange-300"
                  >
                    💬 Contact
                  </a>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="py-8 text-center text-gray-400 bg-black border-t border-orange-400/10">
                <small>
                  &copy; 2025{" "}
                  <span className="text-orange-400 font-semibold">SkateHubba</span> — Own
                  Your Tricks.
                </small>
              </footer>
            </BackgroundCarousel>
          );
        }
