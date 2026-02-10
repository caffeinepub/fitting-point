import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllProducts } from '../hooks/useQueries';
import { useSiteContent } from '../hooks/useSiteContent';
import { useGetBanners } from '../hooks/useHomepageBanners';
import ProductCard from '../components/ProductCard';
import HomepageBannerRail from '../components/home/HomepageBannerRail';
import HomepageSectionRenderer from '../components/home/HomepageSectionRenderer';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface HomePageProps {
  onNavigate: (page: Page, productId?: string, category?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
  const { data: siteContent } = useSiteContent();
  const { data: banners = [], isLoading: bannersLoading } = useGetBanners();

  const featuredProducts = products.slice(0, 8);

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map(p => p.category))
  ).slice(0, 6);

  return (
    <div className="space-y-0">
      {/* Hero Banner Section */}
      {!bannersLoading && banners.length > 0 && (
        <HomepageBannerRail banners={banners} onNavigate={onNavigate} />
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl text-gold">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">Explore our carefully selected pilgrimage essentials</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => {
                const categoryProduct = products.find(p => p.category === category);
                return (
                  <Card
                    key={index}
                    className="group cursor-pointer overflow-hidden border-gold/20 hover:border-gold transition-all duration-300 hover:shadow-gold-soft"
                    onClick={() => onNavigate('catalog', undefined, category)}
                  >
                    <CardContent className="p-0 relative aspect-square">
                      {categoryProduct?.images[0] && (
                        <img
                          src={categoryProduct.images[0].getDirectURL()}
                          alt={category}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent flex items-end">
                        <div className="p-4 w-full">
                          <h3 className="font-serif text-lg text-gold mb-1">{category}</h3>
                          <div className="flex items-center text-primary-foreground group-hover:text-gold transition-colors">
                            <span className="text-xs">Explore</span>
                            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-gold" />
              <h2 className="font-serif text-4xl md:text-5xl text-gold">Featured Collection</h2>
              <Sparkles className="h-6 w-6 text-gold" />
            </div>
            <p className="text-muted-foreground text-lg">Handpicked essentials for your pilgrimage</p>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-gold text-gold hover:bg-gold hover:text-white font-serif"
              onClick={() => onNavigate('catalog')}
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Editorial Sections */}
      {siteContent?.sections && siteContent.sections.length > 0 && (
        <HomepageSectionRenderer 
          sections={siteContent.sections} 
          onNavigate={onNavigate}
        />
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl text-gold">
              Ready for Your Sacred Journey?
            </h2>
            <p className="text-xl text-primary-foreground">
              Discover quality Hajj and Umrah essentials designed for comfort and ease
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gold text-white hover:bg-gold/90 font-serif text-lg px-8"
                onClick={() => onNavigate('catalog')}
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gold text-gold bg-white hover:bg-gold hover:text-white font-serif text-lg px-8"
                onClick={() => onNavigate('about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
