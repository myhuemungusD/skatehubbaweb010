
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel"

interface ImageCarouselProps {
  slides: Array<{
    id: number
    title: string
    images: string[]
  }>
}

export function ImageCarousel({ slides }: ImageCarouselProps) {
  return (
    <section className="image-carousel-section">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-orange-400 text-center mb-6 font-orbitron">
                    {slide.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {slide.images.map((imageSrc, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-[#232323] border-2 border-gray-700 hover:border-orange-400/50 transition-all duration-300"
                      >
                        <img
                          src={imageSrc}
                          alt={`${slide.title} - Image ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-[#fafafa] hover:text-orange-400 bg-[#232323] border-gray-600 hover:bg-orange-400/20 hover:border-orange-400" />
          <CarouselNext className="text-[#fafafa] hover:text-orange-400 bg-[#232323] border-gray-600 hover:bg-orange-400/20 hover:border-orange-400" />
        </Carousel>
      </div>
    </section>
  )
}
