
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface Donor {
  firstName: string | null;
  createdAt: string;
}

export function DonorRecognition() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentDonors();
  }, []);

  const fetchRecentDonors = async () => {
    try {
      const response = await fetch('/api/recent-donors?limit=15');
      if (response.ok) {
        const donorData = await response.json();
        setDonors(donorData);
      }
    } catch (error) {
      console.error('Failed to fetch donors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || donors.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-purple-600/10 border-b border-orange-400/20 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-orange-400">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-semibold text-sm">Recent Supporters:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#fafafa]">
            {donors.slice(0, 10).map((donor, index) => (
              <span 
                key={`${donor.firstName}-${donor.createdAt}`}
                className="inline-flex items-center gap-1"
              >
                <span className="bg-orange-400/20 px-2 py-1 rounded text-orange-200 font-medium">
                  {donor.firstName?.trim() || "Skater"}
                </span>
                {index < Math.min(donors.length - 1, 9) && (
                  <span className="text-gray-400">•</span>
                )}
              </span>
            ))}
            {donors.length > 10 && (
              <span className="text-orange-400 font-semibold">
                +{donors.length - 10} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
