import { useState } from "react";
import { useLocation } from "wouter";
import { Upload, Video, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useToast } from "../../hooks/use-toast";
import LocationPicker, { type Location } from "./LocationPicker";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function TrickUpload() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const [trickName, setTrickName] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trickName.trim()) {
      toast({
        title: "Missing trick name",
        description: "Please enter a name for your trick.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Missing location",
        description: "Please select a location for your trick.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to upload a trick.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create trick document in Firestore
      const trickData = {
        name: trickName.trim(),
        description: description.trim() || null,
        videoUrl: videoUrl.trim() || null,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          address: selectedLocation.address || `${selectedLocation.lat}, ${selectedLocation.lng}`,
        },
        userId: user.uid,
        userEmail: user.email || "anonymous",
        userName: user.displayName || "Anonymous User",
        createdAt: serverTimestamp(),
        likes: 0,
        views: 0,
      };

      const tricksCollection = collection(db, "tricks");
      const docRef = await addDoc(tricksCollection, trickData);

      toast({
        title: "Trick uploaded! 🛹",
        description: "Your trick has been successfully saved.",
      });

      // Reset form
      setTrickName("");
      setDescription("");
      setVideoUrl("");
      setSelectedLocation(null);

      // Redirect to home or tricks list
      setTimeout(() => {
        setLocation("/");
      }, 1500);
    } catch (error: any) {
      console.error("Error uploading trick:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload trick. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 text-orange-500 mr-2 text-4xl">🛹</div>
            <h1 className="text-3xl font-bold text-white">Upload Trick</h1>
          </div>
          <p className="text-gray-400">Share your skateboarding skills with the community</p>
        </div>

        <Card className="bg-[#232323] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Trick Details</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details about your trick
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trick Name */}
              <div className="space-y-2">
                <Label htmlFor="trickName" className="text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Trick Name *
                </Label>
                <Input
                  id="trickName"
                  type="text"
                  placeholder="Kickflip, Ollie, etc."
                  value={trickName}
                  onChange={(e) => setTrickName(e.target.value)}
                  className="bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about this trick..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#181818] border-gray-600 text-white placeholder:text-gray-500 min-h-[100px]"
                  rows={4}
                />
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="text-white flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video URL (optional)
                </Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-[#181818] border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Location Picker */}
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={selectedLocation || undefined}
              />

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !trickName.trim() || !selectedLocation}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isSubmitting ? "Uploading..." : "Upload Trick"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
