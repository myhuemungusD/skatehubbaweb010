import { useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Home, ShoppingCart, DollarSign, LogIn, User, Package, Map, Gamepad2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../lib/auth";
import CartDrawer from "./cart/CartDrawer";

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Best-effort logout: swallow errors to ensure UI still resets state
    } finally {
      window.location.href = '/';
    }
  }, []);

  const profileLabel = user?.isAnonymous
    ? "Guest"
    : user?.email || user?.displayName || "Profile";

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/shop", label: "Hubba Shop", icon: ShoppingCart },
    { path: "/closet", label: "Closet", icon: Package },
    { path: "/map", label: "Check-In", icon: Map },
    { path: "/skate-game", label: "S-K-A-T-E", icon: Gamepad2 },
    { path: "/donate", label: "Support", icon: DollarSign },
  ];

  return (
    <>
      <nav className="bg-neutral-900 border-b border-neutral-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#ff6a00]" style={{ fontFamily: "'Permanent Marker', cursive" }}>SkateHubba</span>
            </div>

            <div className="flex items-center space-x-2">
            {navItems
              .filter((item) => !(item.path === "/" && location === "/"))
              .map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant="ghost"
                      className={`${
                        isActive
                          ? "bg-[#ff6a00] text-black hover:bg-[#e55f00]"
                          : "text-gray-300 hover:bg-neutral-800 hover:text-white"
                      }`}
                      data-testid={`button-nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

            <CartDrawer />

            {!isAuthenticated ? (
              <Link href="/auth">
                <Button
                  className="bg-[#24d52b] text-black hover:bg-[#1fb125]"
                  data-testid="button-nav-login"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:bg-neutral-800 hover:text-white"
                  data-testid="button-nav-profile"
                >
                  <User className="w-4 h-4 mr-2" />
                  {profileLabel}
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:bg-neutral-800 hover:text-white"
                  data-testid="button-nav-logout"
                  onClick={() => {
                    void handleLogout();
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    
    {/* Subtitle Banner */}
    <div className="bg-black/40 border-b border-neutral-800 py-3 sticky top-16 z-40">
      <p className="text-center text-sm md:text-base text-gray-200 px-4" style={{ fontFamily: "'Permanent Marker', cursive" }}>
        The ultimate mobile skateboarding platform where your skills become collectibles and every spot tells a story.
      </p>
    </div>
    </>
  );
}
