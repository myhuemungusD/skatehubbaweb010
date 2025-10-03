"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Home, User } from "lucide-react";

export default function ShopPage() {
  return (
    <main
      className="relative min-h-screen bg-black"
      style={{
        backgroundImage: "url('/attached_assets/graffwallskateboardrack_1754296307132.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <nav className="relative z-10 bg-neutral-900/90 border-b border-neutral-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#ff6a00]">SkateHubba Shop</h1>
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
          <h2 className="text-3xl font-bold text-white mb-2">Trick Collectibles</h2>
          <p className="text-gray-400">Own your tricks with exclusive NFT collectibles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 1, name: "Golden Kickflip", price: "0.5 ETH", rarity: "Legendary" },
            { id: 2, name: "Silver Heelflip", price: "0.3 ETH", rarity: "Rare" },
            { id: 3, name: "Bronze Tre Flip", price: "0.2 ETH", rarity: "Uncommon" },
            { id: 4, name: "Manual Master", price: "0.4 ETH", rarity: "Rare" },
            { id: 5, name: "Grind King", price: "0.6 ETH", rarity: "Legendary" },
            { id: 6, name: "Flip Combo", price: "0.25 ETH", rarity: "Uncommon" },
          ].map((item) => (
            <Card key={item.id} className="bg-black/60 border-gray-700 backdrop-blur-sm hover:border-[#ff6a00] transition-colors">
              <CardHeader>
                <div className="w-full h-48 bg-neutral-800 rounded-lg mb-4 flex items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-[#ff6a00]" />
                </div>
                <CardTitle className="text-white">{item.name}</CardTitle>
                <CardDescription className="text-gray-400">{item.rarity}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#24d52b]">{item.price}</span>
                  <Button className="bg-[#ff6a00] hover:bg-[#e55f00]">
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
