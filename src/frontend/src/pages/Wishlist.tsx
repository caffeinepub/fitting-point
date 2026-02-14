import { Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllProducts } from '../hooks/useQueries';
import { useGuestWishlist } from '../hooks/useGuestWishlist';
import { useGuestCart } from '../hooks/useGuestCart';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface WishlistProps {
  onNavigate: (page: Page, productId?: string) => void;
}

export default function Wishlist({ onNavigate }: WishlistProps) {
  const { data: allProducts = [] } = useGetAllProducts();
  const { wishlist, removeFromWishlist, clearWishlist } = useGuestWishlist();
  const { addToCart } = useGuestCart();

  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (productId: string) => {
    const product = wishlistProducts.find((p) => p.id === productId);
    if (!product) return;

    addToCart({
      productId: product.id,
      size: product.sizes[0] || 'One Size',
      color: product.colors[0] || 'Default',
      quantity: BigInt(1),
    });
    toast.success('Added to cart');
  };

  const handleClearAll = () => {
    clearWishlist();
    toast.success('Wishlist cleared');
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold">Your Wishlist</h1>
          <p className="text-muted-foreground text-lg">Your wishlist is empty</p>
          <Button
            onClick={() => onNavigate('catalog')}
            className="bg-gold hover:bg-gold/90 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">Your Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={handleClearAll}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden border-gold/10 hover:border-gold/30 transition-all duration-500"
          >
            <div
              className="relative aspect-square overflow-hidden bg-muted/20 cursor-pointer"
              onClick={() => onNavigate('product', product.id)}
            >
              <img
                src={product.images[0]?.getDirectURL()}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div
                className="cursor-pointer"
                onClick={() => onNavigate('product', product.id)}
              >
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.shortDescriptor}
                </p>
                <div className="text-lg font-bold text-gold mt-2">
                  {formatINR(product.price)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gold hover:bg-gold/90 text-white"
                  size="sm"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  onClick={() => handleRemove(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
