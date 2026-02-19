import { useEffect } from 'react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGuestCart } from '../hooks/useGuestCart';
import { useGetAllProducts } from '../hooks/useQueries';
import { buildWhatsAppCheckoutURL } from '../utils/whatsapp';
import { calculateCartSummary } from '../utils/cartSummary';
import { formatINR } from '../utils/currency';

type Page = 'home' | 'catalog' | 'cart';

interface CheckoutProps {
  onNavigate: (page: Page) => void;
}

export default function Checkout({ onNavigate }: CheckoutProps) {
  const { cart } = useGuestCart();
  const { data: allProducts = [] } = useGetAllProducts();

  useEffect(() => {
    if (cart.length === 0) {
      onNavigate('cart');
    }
  }, [cart, onNavigate]);

  const cartWithDetails = cart.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });

  const summary = calculateCartSummary(cartWithDetails);

  const handleWhatsAppCheckout = () => {
    const whatsappURL = buildWhatsAppCheckoutURL(cartWithDetails);
    window.open(whatsappURL, '_blank');
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-gold mb-4">Checkout</h1>
          <p className="text-muted-foreground">Complete your order via WhatsApp</p>
        </div>

        <Card className="border-gold/20 mb-6">
          <CardHeader>
            <CardTitle className="text-gold font-serif flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-serif text-gold">
                    {formatINR(item.lineTotal)}
                  </p>
                </div>
                {index < summary.items.length - 1 && <Separator className="mt-4 bg-gold/20" />}
              </div>
            ))}

            <Separator className="bg-gold/20" />

            <div className="flex justify-between items-center text-lg font-serif">
              <span>Total</span>
              <span className="text-gold text-2xl">{formatINR(summary.subtotal)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold/20 bg-gold/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <MessageCircle className="h-16 w-16 text-gold mx-auto" />
              <h2 className="font-serif text-2xl text-gold">Complete Order via WhatsApp</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Click below to open WhatsApp with your order details pre-filled. 
                Our team will confirm your order and arrange delivery.
              </p>
              <Button
                size="lg"
                onClick={handleWhatsAppCheckout}
                className="bg-gold hover:bg-gold/90 text-white font-serif text-lg px-8 transition-all duration-300 hover:shadow-gold-soft hover:scale-105"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Open WhatsApp
              </Button>
              <p className="text-xs text-muted-foreground">
                You'll be redirected to WhatsApp with your order details
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate('cart')}
            className="text-gold hover:text-gold/80 transition-colors duration-300"
          >
            ← Back to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
