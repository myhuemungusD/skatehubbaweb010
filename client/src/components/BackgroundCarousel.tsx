import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const backgroundImages = [
  '/attached_assets/alley back ground_1754296307133.png',
  '/attached_assets/hubbagraffwall.png',
  '/attached_assets/graff wall_1754296307134.png',
  '/attached_assets/graffwallskateboardrack_1754296307132.png',
  '/attached_assets/profile background_1754296307133.png',
  '/attached_assets/shop background_1754296307133.png'
];

interface BackgroundCarouselProps {
  autoSlide?: boolean;
  slideInterval?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function BackgroundCarousel({ 
  autoSlide = true, 
  slideInterval = 5000,
  className = "",
  children
}: BackgroundCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval]);

  // Preload images
  useEffect(() => {
    const imagePromises = backgroundImages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true)); // Still show even if some images fail
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? backgroundImages.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === backgroundImages.length - 1 ? 0 : currentIndex + 1);
  };

  if (!isLoaded) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-orange-900/30 to-gray-900 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Loading images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Background Images */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
            data-testid={`background-slide-${index}`}
          />
        ))}
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
          data-testid="carousel-prev"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="bg-black/50 border-white/20 text-white hover:bg-black/70"
          data-testid="carousel-next"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-orange-500 scale-110' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              data-testid={`carousel-indicator-${index}`}
            />
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
          {currentIndex + 1} / {backgroundImages.length}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-30">
        {children}
      </div>
    </div>
  );
}