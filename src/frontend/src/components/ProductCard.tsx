import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../backend';
import { useGetWishlist } from '../hooks/useQueries';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: Page, productId?: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { data: wishlist = [] } = useGetWishlist();
  const isInWishlist = wishlist.includes(product.id);

  return (
    <Card className="group overflow-hidden border-gold/20 hover:border-gold transition-all duration-300 hover:shadow-gold-soft">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]?.getDirectURL()}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
            onClick={() => onNavigate('product', product.id)}
          />
          <div className="absolute top-4 right-4">
            <Button
              size="icon"
              variant="secondary"
              className={`rounded-full shadow-lg ${
                isInWishlist ? 'bg-gold text-white' : 'bg-background/80 backdrop-blur'
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-white' : ''}`} />
            </Button>
          </div>
          {product.category && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur border-gold/30">
                {product.category}
              </Badge>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              className="w-full bg-gold text-white hover:bg-gold/90 font-serif"
              onClick={() => onNavigate('product', product.id)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Quick View
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3
            className="font-serif text-lg text-gold line-clamp-1 cursor-pointer hover:underline"
            onClick={() => onNavigate('product', product.id)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xl font-semibold text-foreground">${Number(product.price).toFixed(2)}</p>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gold/30"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

