
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ImageCarouselProps {
  slides: Array<{
    id: number
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  {slide.images.map((imageSrc, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-lg bg-skatehubba-card border border-gray-700"
                    >
                      <img
                        src={imageSrc}
                        alt={`Slide ${slide.id} Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-skatehubba-light hover:text-skatehubba-primary" />
          <CarouselNext className="text-skatehubba-light hover:text-skatehubba-primary" />
        </Carousel>
      </div>
    </section>
  )
}
