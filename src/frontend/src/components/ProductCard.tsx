import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Product } from '../backend';
import { useGuestCart } from '../hooks/useGuestCart';
import { useGuestWishlist } from '../hooks/useGuestWishlist';
import { toast } from 'sonner';
import type { CatalogFilter } from '../App';
import { getProductCardImages } from '../utils/productImageFallback';
import { formatINR } from '../utils/currency';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart: addToGuestCart } = useGuestCart();
  const { wishlist: guestWishlist, addToWishlist: addToGuestWishlist } = useGuestWishlist();

  const isInWishlist = guestWishlist.includes(product.id);
  const { primaryImage, secondaryImage, hasHoverSwap } = getProductCardImages(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    addToGuestCart({
      productId: product.id,
      size: product.sizes[0] || 'One Size',
      color: product.colors[0] || 'Default',
      quantity: BigInt(1),
    });
    toast.success('Added to cart');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInWishlist) {
      addToGuestWishlist(product.id);
      toast.success('Added to wishlist');
    } else {
      toast.info('Already in wishlist');
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-gold/10 hover:border-gold/40 transition-all duration-500 hover:shadow-premium-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onNavigate('product', product.id)}
    >
      {/* Tall portrait image container with stacked cross-fade */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
        {/* Stacked image container - no layout shift */}
        <div className="absolute inset-0">
          {/* Primary image - fades out on hover if secondary exists */}
          <img
            src={primaryImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              hasHoverSwap && isHovered
                ? 'opacity-0 scale-105'
                : 'opacity-100 scale-100'
            } ${!hasHoverSwap ? 'group-hover:scale-105' : ''}`}
          />
          
          {/* Secondary image - fades in on hover (only if available) */}
          {hasHoverSwap && secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}

          {/* Premium overlay gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>

        {/* Top-left wishlist button */}
        <Button
          size="icon"
          variant="secondary"
          className={`absolute top-3 left-3 z-10 w-10 h-10 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
            isInWishlist
              ? 'bg-gold text-white hover:bg-gold-dark scale-110'
              : 'bg-white/90 hover:bg-gold hover:text-white hover:scale-110'
          }`}
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 transition-all duration-300 ${isInWishlist ? 'fill-current scale-110' : ''}`} />
        </Button>

        {/* Bottom add-to-cart bar */}
        <div className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-500 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-95'
        }`}>
          <Button
            className="w-full rounded-none bg-white/95 hover:bg-gold text-foreground hover:text-white transition-all duration-300 h-14 font-semibold backdrop-blur-md border-t border-gold/20 hover:border-gold/40 shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span className="tracking-wide">Add to Cart</span>
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-5 space-y-2 bg-gradient-to-b from-card to-card/80">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-1 tracking-wide">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 font-body leading-relaxed min-h-[2.5rem]">
          {product.shortDescriptor}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-gold/10">
          <span className="text-xl font-bold text-gold tracking-wide font-heading">
            {formatINR(product.price)}
          </span>
          {product.colors.length > 0 && (
            <div className="flex gap-1.5">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border-2 border-gold/30 shadow-sm transition-transform duration-300 hover:scale-125"
                  style={{ 
                    backgroundColor: color.toLowerCase().replace(/\s+/g, ''),
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-5 h-5 rounded-full border-2 border-gold/30 bg-muted flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-muted-foreground">+{product.colors.length - 4}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
