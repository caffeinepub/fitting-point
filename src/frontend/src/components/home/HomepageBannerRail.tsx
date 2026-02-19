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
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
                  <div className="max-w-3xl space-y-6 text-white">
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-in fade-in slide-in-from-left-8 duration-700">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="font-body text-lg md:text-xl lg:text-2xl text-white/95 animate-in fade-in slide-in-from-left-8 delay-150" style={{ animationDuration: '700ms' }}>
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.ctaText && banner.ctaAction && (
                      <Button
                        size="lg"
                        className="bg-gold hover:bg-gold-dark text-white mt-6 transition-all duration-300 hover:shadow-premium-lg hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 animate-in fade-in slide-in-from-left-8 delay-300"
                        style={{ animationDuration: '700ms' }}
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

      {banners.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-gold hover:text-white shadow-premium-lg transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            onClick={goToPrevious}
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-gold hover:text-white shadow-premium-lg transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            onClick={goToNext}
            aria-label="Next banner"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-gold w-10 shadow-gold-soft'
                  : 'bg-white/60 hover:bg-white/80 w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
