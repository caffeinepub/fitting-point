import { Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetWishlist, useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface WishlistProps {
  onNavigate: (page: Page, productId?: string) => void;
}

export default function Wishlist({ onNavigate }: WishlistProps) {
  const { data: wishlistIds = [], isLoading: wishlistLoading } = useGetWishlist();
  const { data: allProducts = [], isLoading: productsLoading } = useGetAllProducts();

  const isLoading = wishlistLoading || productsLoading;

  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 py-16">
          <h1 className="font-serif text-4xl text-gold">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground text-lg">Save your favorite items for later</p>
          <Button
            size="lg"
            className="bg-gold text-primary hover:bg-gold/90 font-serif"
            onClick={() => onNavigate('catalog')}
          >
            Discover Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl text-gold mb-4">My Wishlist</h1>
        <p className="text-muted-foreground">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
