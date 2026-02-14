import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { CatalogFilter } from '../../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface OffersSectionProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function OffersSection({ onNavigate }: OffersSectionProps) {
  const offers = [
    {
      image: '/assets/generated/homepage-offer-banner-1-v2.dim_2400x900.png',
      title: 'Special Hajj Collection',
      subtitle: 'Premium essentials for your sacred journey',
      ctaText: 'Shop Hajj Essentials',
      filter: { usageCategory: 'hajj' } as CatalogFilter,
    },
    {
      image: '/assets/generated/homepage-offer-banner-2-v2.dim_2400x900.png',
      title: 'Umrah Exclusive Offers',
      subtitle: 'Complete your pilgrimage with comfort',
      ctaText: 'Explore Umrah Collection',
      filter: { usageCategory: 'umrah' } as CatalogFilter,
    },
  ];

  return (
    <section className="section-spacing bg-muted/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-gold mb-12">
          Special Offers & Promotions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offers.map((offer, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-gold/10 hover:border-gold/40 transition-all duration-500 hover:shadow-premium-lg hover:-translate-y-1"
            >
              <div className="relative aspect-[21/9] overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/85" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2 transition-transform duration-500 group-hover:translate-x-1">
                    {offer.title}
                  </h3>
                  <p className="font-body text-base md:text-lg opacity-90 mb-4">
                    {offer.subtitle}
                  </p>
                  <Button
                    className="bg-gold hover:bg-gold-dark text-white transition-all duration-300 hover:shadow-gold-soft hover:scale-105"
                    onClick={() => onNavigate('catalog', undefined, offer.filter)}
                  >
                    {offer.ctaText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
