import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import HomepageBannerRail from '../components/home/HomepageBannerRail';
import HomepageProductSection from '../components/home/HomepageProductSection';
import OffersSection from '../components/home/OffersSection';
import CustomerReviewsSection from '../components/home/CustomerReviewsSection';
import PartnersSection from '../components/home/PartnersSection';
import ContactCtaSection from '../components/home/ContactCtaSection';
import { homepageCategoryCards } from '../utils/storefrontNav';
import { ArrowRight } from 'lucide-react';
import type { CatalogFilter } from '../App';
import { UsageCategory } from '../backend';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface HomePageProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: products = [], isLoading } = useGetAllProducts();

  // Best Sellers
  const bestSellers = useMemo(
    () => products.filter((p) => p.isBestseller).slice(0, 8),
    [products]
  );

  // Most Loved
  const mostLoved = useMemo(
    () => products.filter((p) => p.isMostLoved).slice(0, 8),
    [products]
  );

  // New Arrivals
  const newArrivals = useMemo(
    () => products.filter((p) => p.isNewProduct).slice(0, 8),
    [products]
  );

  // Category-based sections
  const hajjProducts = useMemo(
    () => products.filter((p) => p.usageCategory === UsageCategory.hajj || p.usageCategory === UsageCategory.both).slice(0, 8),
    [products]
  );

  const umrahProducts = useMemo(
    () => products.filter((p) => p.usageCategory === UsageCategory.umrah || p.usageCategory === UsageCategory.both).slice(0, 8),
    [products]
  );

  // Banner configuration with v2 assets
  const banners = [
    {
      image: '/assets/generated/mecca-hero-banner-v2.dim_2400x1000.png',
      title: 'Premium Hajj & Umrah Essentials',
      subtitle: 'Prepare for your sacred journey with quality and comfort',
      ctaText: 'Shop Now',
      ctaAction: () => onNavigate('catalog'),
    },
    {
      image: '/assets/generated/hajj-umrah-promo-banner-1-v2.dim_2400x900.png',
      title: 'Exclusive Hajj Collection',
      subtitle: 'Everything you need for a blessed pilgrimage',
      ctaText: 'Explore Collection',
      ctaAction: () => onNavigate('catalog', undefined, { usageCategory: 'hajj' }),
    },
    {
      image: '/assets/generated/hajj-umrah-promo-banner-2-v2.dim_2400x900.png',
      title: 'Umrah Essentials',
      subtitle: 'Complete your spiritual journey with comfort',
      ctaText: 'View Products',
      ctaAction: () => onNavigate('catalog', undefined, { usageCategory: 'umrah' }),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <HomepageBannerRail banners={banners} onNavigate={onNavigate} />

      {/* Category Cards Section */}
      <section className="section-spacing bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-gold mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {homepageCategoryCards.map((category) => (
              <Card
                key={category.title}
                className="group cursor-pointer overflow-hidden border-gold/10 hover:border-gold/40 transition-all duration-500 hover:shadow-premium-lg hover:-translate-y-2 bg-card/50 backdrop-blur-sm"
                onClick={() => onNavigate('catalog', undefined, category.filter)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/80" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2 text-center transition-transform duration-500 group-hover:scale-105">
                      {category.title}
                    </h3>
                    <p className="font-body text-sm md:text-base text-center opacity-90 mb-4">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      className="border-white/80 text-white hover:bg-gold hover:border-gold hover:text-white transition-all duration-300 backdrop-blur-sm"
                    >
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-0" />

      {/* Offers Section */}
      <OffersSection onNavigate={onNavigate} />

      <Separator className="my-0" />

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <>
          <HomepageProductSection
            title="Best Sellers"
            products={bestSellers}
            filter={{ isBestseller: true }}
            onNavigate={onNavigate}
          />
          <Separator className="my-0" />
        </>
      )}

      {/* Most Loved */}
      {mostLoved.length > 0 && (
        <>
          <HomepageProductSection
            title="Most Loved"
            products={mostLoved}
            filter={{ isMostLoved: true }}
            onNavigate={onNavigate}
          />
          <Separator className="my-0" />
        </>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <>
          <HomepageProductSection
            title="New Arrivals"
            products={newArrivals}
            filter={{ isNew: true }}
            onNavigate={onNavigate}
          />
          <Separator className="my-0" />
        </>
      )}

      {/* Hajj Collection */}
      {hajjProducts.length > 0 && (
        <>
          <HomepageProductSection
            title="Hajj Essentials"
            products={hajjProducts}
            filter={{ usageCategory: 'hajj' }}
            onNavigate={onNavigate}
          />
          <Separator className="my-0" />
        </>
      )}

      {/* Umrah Collection */}
      {umrahProducts.length > 0 && (
        <>
          <HomepageProductSection
            title="Umrah Collection"
            products={umrahProducts}
            filter={{ usageCategory: 'umrah' }}
            onNavigate={onNavigate}
          />
          <Separator className="my-0" />
        </>
      )}

      {/* Customer Reviews */}
      <CustomerReviewsSection />

      <Separator className="my-0" />

      {/* Partners */}
      <PartnersSection />

      <Separator className="my-0" />

      {/* Contact CTA */}
      <ContactCtaSection onNavigate={onNavigate} />
    </div>
  );
}
