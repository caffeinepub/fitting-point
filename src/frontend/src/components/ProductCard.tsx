import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGuestWishlist } from '../hooks/useGuestWishlist';
import { useGuestCart } from '../hooks/useGuestCart';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';
import { getProductCardImages } from '../utils/productImageFallback';
import type { Product } from '../backend';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: Page, productId?: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { wishlist, addToWishlist, removeFromWishlist } = useGuestWishlist();
  const { addToCart } = useGuestCart();

  const isInWishlist = wishlist.includes(product.id);
  const { primaryImage, secondaryImage, hasHoverSwap } = getProductCardImages(product);
  const displaySecondaryImage = secondaryImage || primaryImage;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'One Size';
    const defaultColor = product.colors[0] || 'Default';
    addToCart({
      productId: product.id,
      size: defaultSize,
      color: defaultColor,
      quantity: BigInt(1),
    });
    toast.success('Added to cart');
  };

  return (
    <Card
      className="group overflow-hidden border-gold/10 hover:border-gold/40 transition-all duration-500 hover:shadow-premium-lg hover:-translate-y-2 cursor-pointer"
      onClick={() => onNavigate('product', product.id)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/10">
        <div className="absolute inset-0">
          <img
            src={primaryImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-110"
          />
          <img
            src={displaySecondaryImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
          />
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNewProduct && (
            <Badge className="bg-gold text-white border-0 shadow-md">New</Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-gold-dark text-white border-0 shadow-md">Bestseller</Badge>
          )}
          {product.isMostLoved && (
            <Badge className="bg-gold text-white border-0 shadow-md">Most Loved</Badge>
          )}
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white shadow-md transition-all duration-300 hover:scale-110"
          onClick={handleWishlistToggle}
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-300 ${
              isInWishlist ? 'fill-gold text-gold' : 'text-muted-foreground'
            }`}
          />
        </Button>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
          <Button
            className="w-full bg-gold hover:bg-gold-dark text-white transition-all duration-300 hover:shadow-gold-soft hover:scale-105"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-2 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
          {product.shortDescriptor}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gold">{formatINR(Number(product.price))}</p>
          {product.sizes.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
