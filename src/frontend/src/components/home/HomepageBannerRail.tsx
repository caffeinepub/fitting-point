import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CatalogFilter } from '../../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface Banner {
  image: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
}

interface HomepageBannerRailProps {
  banners: Banner[];
  onNavigate?: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function HomepageBannerRail({ banners, onNavigate }: HomepageBannerRailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-muted/10">
      {/* Banner slides */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              
              {/* Text overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
                  <div className="max-w-2xl space-y-4 text-white">
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="font-body text-lg md:text-xl lg:text-2xl text-white/90">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.ctaText && banner.ctaAction && (
                      <Button
                        size="lg"
                        className="bg-gold hover:bg-gold-dark text-white mt-4 transition-all duration-300 hover:shadow-gold-soft hover:scale-105"
                        onClick={banner.ctaAction}
                      >
                        {banner.ctaText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-gold hover:text-white shadow-lg transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            onClick={goToPrevious}
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-gold hover:text-white shadow-lg transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            onClick={goToNext}
            aria-label="Next banner"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-gold w-8'
                  : 'bg-white/60 hover:bg-white/90 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
