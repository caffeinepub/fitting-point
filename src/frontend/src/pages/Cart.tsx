import { Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetAllProducts } from '../hooks/useQueries';
import { useGuestCart } from '../hooks/useGuestCart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'checkout';

interface CartProps {
  onNavigate: (page: Page, productId?: string) => void;
}

export default function Cart({ onNavigate }: CartProps) {
  const { data: allProducts = [], isLoading: productsLoading } = useGetAllProducts();
  const { cart: guestCart, removeFromCart: removeFromGuestCart } = useGuestCart();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const cart = isAuthenticated ? [] : guestCart; // TODO: Add backend cart support

  const getProductDetails = (productId: string) => {
    return allProducts.find((p) => p.id === productId);
  };

  const handleRemove = (productId: string) => {
    try {
      removeFromGuestCart(productId);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const product = getProductDetails(item.productId);
    return sum + (product ? Number(product.price) * Number(item.quantity) : 0);
  }, 0);

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 py-16">
          <h1 className="font-serif text-4xl text-gold">Your Cart is Empty</h1>
          <p className="text-muted-foreground text-lg">Add some pilgrimage essentials to your collection</p>
          <Button
            size="lg"
            className="bg-gold text-white hover:bg-gold/90 font-serif"
            onClick={() => onNavigate('catalog')}
          >
            Shop Collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl md:text-5xl text-gold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const product = getProductDetails(item.productId);
            if (!product) return null;

            return (
              <Card key={`${item.productId}-${item.size}-${item.color}`} className="border-gold/20 hover:border-gold transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.images[0]?.getDirectURL()}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onNavigate('product', product.id)}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h3
                            className="font-serif text-lg text-gold cursor-pointer hover:underline"
                            onClick={() => onNavigate('product', product.id)}
                          >
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size} | Color: {item.color}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleRemove(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Qty:</span>
                          <span className="font-semibold">{Number(item.quantity)}</span>
                        </div>
                        <p className="font-semibold text-lg">
                          ${(Number(product.price) * Number(item.quantity)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-gold/20 sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-serif text-2xl text-gold">Order Summary</h2>
              <Separator className="bg-gold/20" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
              </div>
              <Separator className="bg-gold/20" />
              <div className="flex justify-between text-lg">
                <span className="font-serif text-gold">Total</span>
                <span className="font-bold text-gold">${subtotal.toFixed(2)}</span>
              </div>
              <Button
                size="lg"
                className="w-full bg-gold text-white hover:bg-gold/90 font-serif flex items-center justify-center gap-2"
                onClick={() => onNavigate('checkout')}
              >
                Checkout on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full border-gold text-gold hover:bg-gold/10"
                onClick={() => onNavigate('catalog')}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
