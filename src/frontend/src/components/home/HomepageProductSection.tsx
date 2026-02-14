import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';
import type { Product } from '../../backend';
import type { CatalogFilter } from '../../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface HomepageProductSectionProps {
  title: string;
  products: Product[];
  filter?: CatalogFilter;
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function HomepageProductSection({
  title,
  products,
  filter,
  onNavigate,
}: HomepageProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-spacing bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gold">
            {title}
          </h2>
          {filter && (
            <Button
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 hover:shadow-gold-soft hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              onClick={() => onNavigate('catalog', undefined, filter)}
            >
              View More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
}
