import { useState } from 'react';
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetProduct } from '../hooks/useQueries';
import { useGuestCart } from '../hooks/useGuestCart';
import { useGuestWishlist } from '../hooks/useGuestWishlist';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: Page, productId?: string) => void;
}

export default function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const { data: product, isLoading, error } = useGetProduct(productId);
  const { addToCart: addToGuestCart } = useGuestCart();
  const { wishlist: guestWishlist, addToWishlist: addToGuestWishlist } = useGuestWishlist();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <p className="text-destructive">Product not found</p>
          <Button onClick={() => onNavigate('catalog')} variant="outline">
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const isInWishlist = guestWishlist.includes(product.id);

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0] || 'One Size';
    const color = selectedColor || product.colors[0] || 'Default';

    addToGuestCart({
      productId: product.id,
      size,
      color,
      quantity: BigInt(quantity),
    });

    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleAddToWishlist = () => {
    if (!isInWishlist) {
      addToGuestWishlist(product.id);
      toast.success('Added to wishlist');
    } else {
      toast.info('Already in wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-gold hover:text-gold/80 hover:bg-gold/5"
          onClick={() => onNavigate('catalog')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-muted/20 border border-gold/10 shadow-gold-subtle">
              <img
                src={product.images[selectedImageIndex]?.getDirectURL()}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? 'border-gold shadow-gold-subtle'
                        : 'border-gold/10 hover:border-gold/30'
                    }`}
                  >
                    <img
                      src={image.getDirectURL()}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gold mb-3">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground font-body">{product.shortDescriptor}</p>
            </div>

            <div className="text-3xl font-bold text-gold">
              {formatINR(product.price)}
            </div>

            <Separator className="bg-gold/20" />

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground font-body leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Size</Label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      className={
                        selectedSize === size
                          ? 'bg-gold hover:bg-gold/90 text-white'
                          : 'border-gold/30 hover:border-gold hover:bg-gold/5'
                      }
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Color</Label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === color
                          ? 'border-gold scale-110 shadow-gold-subtle'
                          : 'border-gold/30 hover:border-gold'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold/30 hover:bg-gold/5"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold/30 hover:bg-gold/5"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="bg-gold/20" />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gold hover:bg-gold/90 text-white shadow-gold-subtle"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`border-gold ${
                  isInWishlist
                    ? 'bg-gold text-white hover:bg-gold/90'
                    : 'text-gold hover:bg-gold hover:text-white'
                }`}
                onClick={handleAddToWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Product Meta */}
            <Card className="border-gold/20 bg-muted/10 shadow-gold-subtle">
              <CardContent className="p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-body">Category:</span>
                  <span className="font-semibold">{product.category}</span>
                </div>
                {product.productType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-body">Type:</span>
                    <span className="font-semibold capitalize">
                      {product.productType.__kind__ === 'other'
                        ? product.productType.other
                        : product.productType.__kind__}
                    </span>
                  </div>
                )}
                {product.usageCategory && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-body">Usage:</span>
                    <span className="font-semibold capitalize">{product.usageCategory}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium ${className || ''}`}>{children}</label>;
}
