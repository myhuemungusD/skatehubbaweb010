import { useState, useEffect, useMemo } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";

// Define location type
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
}

// Dynamic imports for Leaflet to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MapContainer: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TileLayer: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Marker: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useMapEvents: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let L: any;

const loadLeaflet = async () => {
  if (typeof window === "undefined") return;
  
  const leaflet = await import("leaflet");
  const reactLeaflet = await import("react-leaflet");
  
  L = leaflet.default;
  MapContainer = reactLeaflet.MapContainer;
  TileLayer = reactLeaflet.TileLayer;
  Marker = reactLeaflet.Marker;
  useMapEvents = reactLeaflet.useMapEvents;

  // Fix default marker icon issue with webpack
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

// Los Angeles default location
const DEFAULT_CENTER: Location = { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" };

function MapClickHandler({ onLocationClick }: { onLocationClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click: (e: any) => {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const { toast } = useToast();
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>(initialLocation || DEFAULT_CENTER);
  const [manualLat, setManualLat] = useState(initialLocation?.lat.toString() || "");
  const [manualLng, setManualLng] = useState(initialLocation?.lng.toString() || "");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    loadLeaflet().then(() => setLeafletLoaded(true));
  }, []);

  const handleLocationClick = (lat: number, lng: number) => {
    const newLocation: Location = {
      lat,
      lng,
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    };
    setSelectedLocation(newLocation);
    setManualLat(lat.toFixed(6));
    setManualLng(lng.toFixed(6));
    onLocationSelect(newLocation);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationClick(latitude, longitude);
        toast({
          title: "Location found! 📍",
          description: "Your current location has been set.",
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location access denied",
          description: "Please enable location services or enter coordinates manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleManualUpdate = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid latitude and longitude values.",
        variant: "destructive",
      });
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Invalid coordinates",
        description: "Latitude must be between -90 and 90, longitude between -180 and 180.",
        variant: "destructive",
      });
      return;
    }

    handleLocationClick(lat, lng);
    toast({
      title: "Location updated! 📍",
      description: "Coordinates have been set manually.",
    });
  };

  const markerPosition = useMemo(
    () => [selectedLocation.lat, selectedLocation.lng] as [number, number],
    [selectedLocation]
  );

  if (!leafletLoaded) {
    return (
      <div className="w-full h-[400px] bg-[#232323] rounded-lg flex items-center justify-center border border-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </Label>
        <Button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          size="sm"
        >
          <Navigation className="w-4 h-4" />
          {isGettingLocation ? "Getting location..." : "Use Current Location"}
        </Button>
      </div>

      {/* Leaflet Map */}
      <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-700">
        <MapContainer
          center={markerPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          key={`${markerPosition[0]}-${markerPosition[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition} />
          <MapClickHandler onLocationClick={handleLocationClick} />
        </MapContainer>
      </div>

      {/* Manual Coordinate Entry */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lat" className="text-white">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            placeholder="34.0522"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            className="bg-[#181818] border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng" className="text-white">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="any"
            placeholder="-118.2437"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            className="bg-[#181818] border-gray-600 text-white"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={handleManualUpdate}
        variant="outline"
        className="w-full border-gray-600 text-white hover:bg-gray-700"
      >
        Update Location from Coordinates
      </Button>

      {selectedLocation && (
        <div className="text-sm text-gray-400 text-center p-2 bg-[#232323] rounded border border-gray-700">
          Selected: {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Click on the map to drop a pin, or enter coordinates manually
      </p>
    </div>
  );
}
