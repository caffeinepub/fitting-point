import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { homepageCategoryCards } from '../utils/storefrontNav';
import { ArrowRight } from 'lucide-react';
import type { CatalogFilter } from '../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface HomePageProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: products = [], isLoading } = useGetAllProducts();

  const featuredProducts = products.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewProduct).slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/fitting-point-pattern.dim_2048x2048.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-gold animate-fade-in">
            Fitting Point
          </h1>
          <p className="font-body text-xl md:text-2xl text-muted-foreground animate-slide-up">
            Premium Hajj & Umrah Essentials
          </p>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            Your trusted companion for the sacred journey. Discover quality products crafted with devotion and care.
          </p>
          <Button
            size="lg"
            className="bg-gold hover:bg-gold/90 text-white mt-6 animate-slide-up"
            onClick={() => onNavigate('catalog')}
          >
            Explore Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-16 px-4 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-gold mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homepageCategoryCards.map((category) => (
              <Card
                key={category.title}
                className="group cursor-pointer overflow-hidden border-gold/10 hover:border-gold/30 transition-all duration-500 hover:shadow-gold-subtle"
                onClick={() => onNavigate('catalog', undefined, category.filter)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-serif text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="font-body text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 lg:px-8 xl:px-12 2xl:px-16 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gold">
                Featured Products
              </h2>
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
                onClick={() => onNavigate('catalog', undefined, { isBestseller: true })}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 px-4 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gold">
                New Arrivals
              </h2>
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
                onClick={() => onNavigate('catalog', undefined, { isNew: true })}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 px-4 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-gold">
            Prepare for Your Sacred Journey
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Explore our complete collection of premium Hajj and Umrah essentials
          </p>
          <Button
            size="lg"
            className="bg-gold hover:bg-gold/90 text-white"
            onClick={() => onNavigate('catalog')}
          >
            Shop Now
          </Button>
        </div>
      </section>
    </div>
  );
}
