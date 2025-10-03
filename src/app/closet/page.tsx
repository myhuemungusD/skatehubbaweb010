"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Home, User, Lock } from "lucide-react";

export default function ClosetPage() {
  return (
    <main
      className="relative min-h-screen bg-black"
      style={{
        backgroundImage: "url('/attached_assets/profilecloset.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <nav className="relative z-10 bg-neutral-900/90 border-b border-neutral-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#ff6a00]">SkateHubba Closet</h1>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-neutral-800">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-neutral-800">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Avatar Customization</h2>
          <p className="text-gray-400">Customize your skater avatar with unlocked items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-black/60 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Your Avatar</CardTitle>
                <CardDescription className="text-gray-400">Preview your customizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-neutral-800 rounded-lg flex items-center justify-center">
                  <User className="w-32 h-32 text-[#ff6a00]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: 1, name: "Red Cap", category: "Headwear", owned: true },
                { id: 2, name: "Black Hoodie", category: "Tops", owned: true },
                { id: 3, name: "Blue Jeans", category: "Bottoms", owned: true },
                { id: 4, name: "White Sneakers", category: "Shoes", owned: true },
                { id: 5, name: "Gold Chain", category: "Accessories", owned: false },
                { id: 6, name: "Sunglasses", category: "Accessories", owned: false },
              ].map((item) => (
                <Card
                  key={item.id}
                  className={`${
                    item.owned
                      ? "bg-black/60 border-gray-700 hover:border-[#ff6a00] cursor-pointer"
                      : "bg-black/30 border-gray-800 opacity-60"
                  } backdrop-blur-sm transition-colors`}
                >
                  <CardHeader className="p-4">
                    <div className="w-full h-24 bg-neutral-800 rounded-lg mb-2 flex items-center justify-center">
                      {item.owned ? (
                        <Package className="w-8 h-8 text-[#24d52b]" />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <CardTitle className="text-sm text-white">{item.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-400">{item.category}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
