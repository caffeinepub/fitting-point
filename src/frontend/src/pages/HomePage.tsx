import { useGetAllProducts, useGetBestsellers, useGetNewProducts, useGetMostLovedProducts, useGetAllBanners } from '../hooks/useQueries';
import HomepageBannerRail from '../components/home/HomepageBannerRail';
import OffersSection from '../components/home/OffersSection';
import HomepageProductSection from '../components/home/HomepageProductSection';
import CustomerReviewsSection from '../components/home/CustomerReviewsSection';
import PartnersSection from '../components/home/PartnersSection';
import ContactCtaSection from '../components/home/ContactCtaSection';
import BespokeSection from '../components/home/BespokeSection';
import RevealOnScroll from '../components/motion/RevealOnScroll';
import { homepageCategoryCards } from '../utils/storefrontNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { CatalogFilter } from '../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface HomePageProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: allProducts = [] } = useGetAllProducts();
  const { data: bestsellers = [] } = useGetBestsellers();
  const { data: newProducts = [] } = useGetNewProducts();
  const { data: mostLoved = [] } = useGetMostLovedProducts();
  const { data: backendBanners = [] } = useGetAllBanners();

  // Default banners as fallback
  const defaultBanners = [
    {
      image: '/assets/generated/mecca-hero-banner-v2.dim_2400x1000.png',
      title: 'Premium Hajj & Umrah Essentials',
      subtitle: 'Embark on your sacred journey with confidence and comfort',
      ctaText: 'Explore Collection',
      ctaAction: () => onNavigate('catalog'),
    },
    {
      image: '/assets/generated/hajj-umrah-promo-banner-1-v2.dim_2400x900.png',
      title: 'Exclusive Hajj Collection',
      subtitle: 'Specially curated for your pilgrimage needs',
      ctaText: 'Shop Hajj Essentials',
      ctaAction: () => onNavigate('catalog', undefined, { usageCategory: 'hajj' }),
    },
    {
      image: '/assets/generated/hajj-umrah-promo-banner-2-v2.dim_2400x900.png',
      title: 'Umrah Essentials',
      subtitle: 'Complete your spiritual journey in style',
      ctaText: 'Discover Umrah Collection',
      ctaAction: () => onNavigate('catalog', undefined, { usageCategory: 'umrah' }),
    },
  ];

  // Use backend banners if available, otherwise use defaults
  const banners = backendBanners.length > 0
    ? backendBanners.map((banner) => ({
        image: banner.image.getDirectURL(),
        title: banner.title,
        subtitle: banner.description,
        ctaText: banner.link ? 'Learn More' : 'Explore',
        ctaAction: banner.link
          ? () => {
              if (banner.link!.startsWith('http')) {
                window.open(banner.link!, '_blank');
              } else {
                window.location.href = banner.link!;
              }
            }
          : () => onNavigate('catalog'),
      }))
    : defaultBanners;

  return (
    <div className="w-full">
      <HomepageBannerRail banners={banners} onNavigate={onNavigate} />

      <RevealOnScroll>
        <section className="section-spacing bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gold mb-4">
                Shop by Category
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated collections for your sacred journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {homepageCategoryCards.map((card) => (
                <Card
                  key={card.title}
                  className="group overflow-hidden border-gold/10 hover:border-gold/40 transition-all duration-500 hover:shadow-premium-lg hover:-translate-y-2 cursor-pointer"
                  onClick={() => onNavigate('catalog', undefined, card.filter)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/85" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2 transition-transform duration-500 group-hover:translate-x-2">
                        {card.title}
                      </h3>
                      <p className="font-body text-base text-white/90 mb-4">
                        {card.description}
                      </p>
                      <Button
                        className="bg-gold hover:bg-gold-dark text-white transition-all duration-300 hover:shadow-gold-soft hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('catalog', undefined, card.filter);
                        }}
                      >
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <OffersSection onNavigate={onNavigate} />
      </RevealOnScroll>

      <RevealOnScroll delay={150}>
        <HomepageProductSection
          title="Bestsellers"
          products={bestsellers}
          filter={{ isBestseller: true }}
          onNavigate={onNavigate}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <BespokeSection onNavigate={onNavigate} />
      </RevealOnScroll>

      <RevealOnScroll delay={250}>
        <HomepageProductSection
          title="New Arrivals"
          products={newProducts}
          filter={{ isNew: true }}
          onNavigate={onNavigate}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={300}>
        <HomepageProductSection
          title="Most Loved"
          products={mostLoved}
          filter={{ isMostLoved: true }}
          onNavigate={onNavigate}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={350}>
        <CustomerReviewsSection />
      </RevealOnScroll>

      <RevealOnScroll delay={400}>
        <PartnersSection />
      </RevealOnScroll>

      <RevealOnScroll delay={450}>
        <ContactCtaSection onNavigate={onNavigate} />
      </RevealOnScroll>
    </div>
  );
}
