import { useState } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Product } from '../backend';
import { ProductBadge } from '../backend';
import { useGetWishlist } from '../hooks/useQueries';
import { useGuestCart } from '../hooks/useGuestCart';
import { useGuestWishlist } from '../hooks/useGuestWishlist';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { CatalogFilter } from '../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { data: backendWishlist = [] } = useGetWishlist();
  const { addToCart: addToGuestCart } = useGuestCart();
  const { addToWishlist: addToGuestWishlist } = useGuestWishlist();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isInWishlist = backendWishlist.includes(product.id);

  const displayImage = isHovered && product.images.length > 1 
    ? product.images[1].getDirectURL() 
    : product.images[0]?.getDirectURL();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      addToGuestCart({
        productId: product.id,
        size: product.sizes[0] || 'One Size',
        color: product.colors[0] || 'Default',
        quantity: BigInt(1),
      });
      toast.success('Added to cart');
    } else {
      toast.info('Please select size and color on product page');
      onNavigate('product', product.id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      addToGuestWishlist(product.id);
      toast.success('Added to wishlist');
    } else {
      toast.info('Please login to add to wishlist');
    }
  };

  const getBadgeVariant = () => {
    if (product.badge === ProductBadge.new_) return 'default';
    if (product.badge === ProductBadge.bestseller) return 'secondary';
    return 'outline';
  };

  const getBadgeLabel = () => {
    if (product.badge === ProductBadge.new_) return 'New';
    if (product.badge === ProductBadge.bestseller) return 'Bestseller';
    return null;
  };

  return (
    <>
      <Card
        className="group cursor-pointer overflow-hidden border-gold/10 hover:border-gold/30 transition-all duration-500 hover:shadow-gold-subtle"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onNavigate('product', product.id)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          {/* Image Crossfade */}
          <div className="relative w-full h-full">
            <img
              src={product.images[0]?.getDirectURL()}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {product.images.length > 1 && (
              <img
                src={product.images[1].getDirectURL()}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>

          {/* Badge */}
          {getBadgeLabel() && (
            <Badge
              variant={getBadgeVariant()}
              className="absolute top-3 left-3 bg-gold text-white border-none"
            >
              {getBadgeLabel()}
            </Badge>
          )}

          {/* Quick Actions */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Button
              size="icon"
              variant="secondary"
              className="bg-white hover:bg-gold hover:text-white transition-all duration-300"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white hover:bg-gold hover:text-white transition-all duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className={`transition-all duration-300 ${
                isInWishlist
                  ? 'bg-gold text-white'
                  : 'bg-white hover:bg-gold hover:text-white'
              }`}
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 font-body">
            {product.shortDescriptor}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-gold">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.colors.length > 0 && (
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full border border-gold/30"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick View Modal */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-gold">{product.name}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted/20">
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground font-body">{product.shortDescriptor}</p>
              <div className="text-2xl font-bold text-gold">
                ${Number(product.price).toFixed(2)}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Available Sizes:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="outline">{size}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Available Colors:</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gold/30"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-gold hover:bg-gold/90 text-white"
                  onClick={() => {
                    setQuickViewOpen(false);
                    onNavigate('product', product.id);
                  }}
                >
                  View Full Details
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gold text-gold hover:bg-gold hover:text-white"
                  onClick={(e) => {
                    handleAddToCart(e);
                    setQuickViewOpen(false);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
