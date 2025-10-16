import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Home, ShoppingCart, DollarSign, LogIn, User, Package, Map, Gamepad2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/shop", label: "Hubba Shop", icon: ShoppingCart },
    { path: "/closet", label: "Closet", icon: Package },
    { path: "/map", label: "Check-In", icon: Map },
    { path: "/skate-game", label: "S-K-A-T-E", icon: Gamepad2 },
    { path: "/donate", label: "Support", icon: DollarSign },
  ];

  return (
    <nav className="bg-neutral-900 border-b border-neutral-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
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
                  {user?.email || user?.firstName || "Profile"}
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:bg-neutral-800 hover:text-white"
                  data-testid="button-nav-logout"
                  onClick={() => {
                    localStorage.removeItem('sessionToken');
                    window.location.href = '/';
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
  );
}
