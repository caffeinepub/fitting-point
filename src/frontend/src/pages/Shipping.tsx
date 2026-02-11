import { Package, Truck, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Shipping() {
  return (
    <div className="min-h-screen py-12 px-4 lg:px-8 xl:px-12 2xl:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold mb-6 text-center">
          Shipping Information
        </h1>
        <p className="text-center text-muted-foreground font-body mb-12 text-lg">
          We deliver your sacred journey essentials with care and devotion
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-gold/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-serif">
                <Truck className="h-5 w-5" />
                Delivery Time
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body text-muted-foreground">
              <p>Standard delivery: 5-7 business days</p>
              <p>Express delivery: 2-3 business days</p>
            </CardContent>
          </Card>

          <Card className="border-gold/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-serif">
                <Package className="h-5 w-5" />
                Packaging
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body text-muted-foreground">
              <p>All items are carefully packaged to ensure they arrive in perfect condition.</p>
            </CardContent>
          </Card>

          <Card className="border-gold/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-serif">
                <Clock className="h-5 w-5" />
                Processing Time
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body text-muted-foreground">
              <p>Orders are processed within 1-2 business days.</p>
            </CardContent>
          </Card>

          <Card className="border-gold/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-serif">
                <MapPin className="h-5 w-5" />
                Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body text-muted-foreground">
              <p>Track your order via WhatsApp after shipment confirmation.</p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-gold max-w-none">
          <h2 className="font-serif text-2xl font-bold text-gold mb-4">Shipping Policy</h2>
          <div className="space-y-4 text-muted-foreground font-body">
            <p>
              At Fitting Point, we understand the importance of timely delivery for your sacred journey preparations.
              We work with trusted shipping partners to ensure your items arrive safely and on time.
            </p>
            <p>
              All orders are carefully inspected and packaged before shipment. You will receive a confirmation
              message via WhatsApp once your order has been dispatched, including tracking information.
            </p>
            <p>
              For international orders, please allow additional time for customs clearance. Customs fees and
              import duties are the responsibility of the customer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
