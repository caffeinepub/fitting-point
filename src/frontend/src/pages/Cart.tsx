import { Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetAllProducts } from '../hooks/useQueries';
import { useGuestCart } from '../hooks/useGuestCart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { calculateCartSummary } from '../utils/cartSummary';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'checkout';

interface CartProps {
  onNavigate: (page: Page, productId?: string) => void;
}

export default function Cart({ onNavigate }: CartProps) {
  const { data: allProducts = [], isLoading: productsLoading } = useGetAllProducts();
  const { cart: guestCart, removeFromCart: removeFromGuestCart } = useGuestCart();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const cart = isAuthenticated ? [] : guestCart;

  const cartWithDetails = cart.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });

  const summary = calculateCartSummary(cartWithDetails);

  const handleRemove = (productId: string) => {
    removeFromGuestCart(productId);
    toast.success('Removed from cart');
  };

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold">Your Cart</h1>
          <p className="text-muted-foreground text-lg">Your cart is empty</p>
          <Button
            onClick={() => onNavigate('catalog')}
            className="bg-gold hover:bg-gold/90 text-white transition-all duration-300 hover:shadow-gold-soft hover:scale-105"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {summary.items.map((item, index) => {
            const product = allProducts.find(p => p.id === item.productId);
            if (!product) return null;

            return (
              <Card key={index} className="border-gold/20 hover:border-gold/30 transition-colors duration-300">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div
                      className="w-24 h-24 rounded-lg overflow-hidden bg-muted/20 shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => onNavigate('product', product.id)}
                    >
                      <img
                        src={product.images[0]?.getDirectURL()}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-serif text-lg font-semibold text-foreground hover:text-gold transition-colors duration-300 cursor-pointer line-clamp-1"
                        onClick={() => onNavigate('product', product.id)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-gold mt-2">
                        {formatINR(item.lineTotal)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 hover:scale-110"
                      onClick={() => handleRemove(item.productId)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="border-gold/20 sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-serif text-2xl text-gold">Order Summary</h2>
              <Separator className="bg-gold/20" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatINR(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
              </div>

              <Separator className="bg-gold/20" />

              <div className="flex justify-between text-lg font-serif">
                <span>Total</span>
                <span className="text-gold text-2xl">{formatINR(summary.subtotal)}</span>
              </div>

              <Button
                className="w-full bg-gold hover:bg-gold/90 text-white transition-all duration-300 hover:shadow-gold-soft hover:scale-105"
                size="lg"
                onClick={() => onNavigate('checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-gold/30 text-gold hover:bg-gold/5 transition-all duration-300"
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
