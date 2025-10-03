"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, User } from "lucide-react";

export default function MapPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/attached_assets/graffwallskateboardrack_1754296307132.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />
      
      <nav className="relative z-10 bg-[#24d52b]/90 border-b border-[#1fb125] px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">SkateHubba Map</h1>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-black text-black hover:bg-[#1fb125]">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="border-black text-black hover:bg-[#1fb125]">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-4 py-16">
        <Card className="bg-black/60 border-gray-700 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-[#24d52b]/20 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-[#24d52b]" />
            </div>
            <CardTitle className="text-3xl text-white mb-2">Skate Spot Check-ins</CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Coming Soon
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">
              Discover and check in at skate spots near you. Share your sessions, find new locations, 
              and connect with the local skating community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-neutral-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-2xl font-bold text-[#24d52b] mb-2">500+</p>
                <p className="text-sm text-gray-400">Skate Spots</p>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-2xl font-bold text-[#ff6a00] mb-2">10k+</p>
                <p className="text-sm text-gray-400">Check-ins</p>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-2xl font-bold text-white mb-2">Global</p>
                <p className="text-sm text-gray-400">Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
