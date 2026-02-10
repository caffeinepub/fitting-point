import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { Banner } from '../../backend';
import { decodeBannerText } from '../../utils/bannerEncoding';
import { decodeBannerDestination, getBannerClickHandler } from '../../utils/bannerDestination';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface HomepageBannerRailProps {
  banners: Banner[];
  onNavigate: (page: Page, productId?: string, category?: string) => void;
}

export default function HomepageBannerRail({ banners, onNavigate }: HomepageBannerRailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];
  const textData = decodeBannerText(currentBanner.text);
  const destination = decodeBannerDestination(currentBanner.link);
  const clickHandler = getBannerClickHandler(destination, onNavigate);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden group">
      <div className="absolute inset-0">
        <img
          src={currentBanner.image.getDirectURL()}
          alt={textData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-gold leading-tight">
              {textData.title}
            </h1>
            {textData.subtitle && (
              <p className="text-xl md:text-2xl text-primary-foreground">
                {textData.subtitle}
              </p>
            )}
            {clickHandler && (
              <Button
                size="lg"
                className="bg-gold text-white hover:bg-gold/90 font-serif text-lg px-8"
                onClick={clickHandler}
              >
                {destination.type === 'catalog' ? 'Shop Now' : 
                 destination.type === 'product' ? 'View Product' : 
                 'Learn More'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-gold w-8' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
