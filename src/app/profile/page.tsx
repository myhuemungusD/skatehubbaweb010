"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { updateProfile } from "@/lib/userService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Edit, LogOut, Upload } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, firebaseUser, loading, signOut, bootstrap, refreshUserDoc, updateDisplayNameLocal, updatePhotoURLLocal } = useUserStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setNewDisplayName(user.displayName || "");
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleUpdateProfile = async () => {
    if (!firebaseUser) return;
    
    try {
      setUploading(true);
      const photoURL = await updateProfile(firebaseUser.uid, {
        displayName: newDisplayName,
        avatarFile: avatarFile || undefined,
      });

      if (newDisplayName) {
        updateDisplayNameLocal(newDisplayName);
      }
      if (photoURL) {
        updatePhotoURLLocal(photoURL);
      }

      await refreshUserDoc();
      setIsEditOpen(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const xpProgress = ((user.xp || 0) % 100);

  return (
    <main
      className="relative min-h-screen bg-black p-4"
      style={{
        backgroundImage: "url('/attached_assets/graffwallskateboardrack_1754296307132.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#ff6a00]">Profile</h1>
          <Link href="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-neutral-800">
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="bg-black/60 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.photoURL} alt={user.displayName} />
                  <AvatarFallback className="bg-[#ff6a00] text-black text-2xl">
                    {user.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-white">{user.displayName}</CardTitle>
                  <CardDescription className="text-gray-400">{user.email}</CardDescription>
                </div>
              </div>
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-neutral-800">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Update your profile information and avatar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="bg-neutral-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar Image</Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        className="bg-neutral-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={uploading}
                      className="bg-[#ff6a00] hover:bg-[#e55f00]"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Updating..." : "Update Profile"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Level {user.level || 1}</span>
                <span className="text-sm text-[#24d52b]">{user.xp || 0} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-neutral-800" />
              <p className="text-xs text-gray-500 mt-1">{100 - xpProgress} XP to next level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Total XP</p>
                <p className="text-2xl font-bold text-white">{user.xp || 0}</p>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Level</p>
                <p className="text-2xl font-bold text-[#ff6a00]">{user.level || 1}</p>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Rank</p>
                <p className="text-2xl font-bold text-[#24d52b]">Beginner</p>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
