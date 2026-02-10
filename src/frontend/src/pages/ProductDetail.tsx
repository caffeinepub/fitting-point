import { useState } from 'react';
import { Heart, ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGetProduct, useAddToCart, useAddToWishlist, useGetWishlist } from '../hooks/useQueries';
import { toast } from 'sonner';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: Page) => void;
}

export default function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const { data: product, isLoading } = useGetProduct(productId);
  const { data: wishlist = [] } = useGetWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const isInWishlist = wishlist.includes(productId);

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart.mutate(
      {
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
        quantity: BigInt(quantity),
      },
      {
        onSuccess: () => {
          toast.success('Added to cart!');
        },
        onError: () => {
          toast.error('Failed to add to cart');
        },
      }
    );
  };

  const handleAddToWishlist = () => {
    if (isInWishlist) {
      toast.info('Already in wishlist');
      return;
    }

    addToWishlist.mutate(productId, {
      onSuccess: () => {
        toast.success('Added to wishlist!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to add to wishlist');
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border border-gold/20">
            <img
              src={product.images[selectedImage]?.getDirectURL()}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index ? 'border-gold' : 'border-gold/20 hover:border-gold/50'
                  }`}
                >
                  <img src={image.getDirectURL()} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-4 border-gold text-gold">
              {product.category}
            </Badge>
            <h1 className="font-serif text-4xl text-gold mb-4">{product.name}</h1>
            <p className="text-3xl font-semibold text-foreground">${Number(product.price).toFixed(2)}</p>
          </div>

          <Separator className="bg-gold/20" />

          <div>
            <h3 className="font-serif text-lg text-gold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-serif text-lg text-gold mb-3">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  className={
                    selectedSize === size
                      ? 'bg-gold text-primary hover:bg-gold/90'
                      : 'border-gold/30 hover:border-gold'
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-serif text-lg text-gold mb-3">Select Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? 'default' : 'outline'}
                  className={
                    selectedColor === color
                      ? 'bg-gold text-primary hover:bg-gold/90'
                      : 'border-gold/30 hover:border-gold'
                  }
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor === color && <Check className="mr-2 h-4 w-4" />}
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-serif text-lg text-gold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="border-gold/30"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="border-gold/30"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1 bg-gold text-primary hover:bg-gold/90 font-serif"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`border-gold ${isInWishlist ? 'bg-gold/10 text-gold' : 'text-gold hover:bg-gold/10'}`}
              onClick={handleAddToWishlist}
              disabled={addToWishlist.isPending || isInWishlist}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-gold' : ''}`} />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full text-gold hover:text-gold/80"
            onClick={() => onNavigate('catalog')}
          >
            ← Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
