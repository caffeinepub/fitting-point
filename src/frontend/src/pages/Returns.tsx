import { RotateCcw, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Returns() {
  return (
    <div className="min-h-screen py-12 px-4 lg:px-8 xl:px-12 2xl:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold mb-6 text-center">
          Returns & Exchanges
        </h1>
        <p className="text-center text-muted-foreground font-body mb-12 text-lg">
          Your satisfaction is our priority
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-gold/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-serif">
                <RotateCcw className="h-5 w-5" />
                30-Day Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body text-muted-foreground">
              <p>Return unused items within 30 days of delivery for a full refund.</p>
            </CardContent>
          </Card>

          <Card className="border-gold/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-serif">
                <CheckCircle className="h-5 w-5" />
                Easy Process
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body text-muted-foreground">
              <p>Contact us via WhatsApp to initiate your return or exchange.</p>
            </CardContent>
          </Card>

          <Card className="border-gold/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold font-serif">
                <MessageCircle className="h-5 w-5" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body text-muted-foreground">
              <p>Our team is here to help with any questions or concerns.</p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-gold max-w-none space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gold mb-4">Return Policy</h2>
            <div className="space-y-4 text-muted-foreground font-body">
              <p>
                We want you to be completely satisfied with your purchase. If for any reason you are not happy
                with your order, you may return it within 30 days of delivery for a full refund or exchange.
              </p>
              <p>
                Items must be unused, unwashed, and in their original packaging with all tags attached.
                We reserve the right to refuse returns that do not meet these conditions.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-gold mb-4">How to Return</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground font-body">
              <li>Contact us via WhatsApp with your order number and reason for return</li>
              <li>We will provide you with return instructions and a return authorization</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Ship the item back to us using a trackable shipping method</li>
              <li>Once we receive and inspect the item, we will process your refund</li>
            </ol>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-gold mb-4">Exchanges</h2>
            <div className="space-y-4 text-muted-foreground font-body">
              <p>
                If you would like to exchange an item for a different size or color, please contact us
                via WhatsApp. We will arrange the exchange at no additional cost to you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <XCircle className="h-4 w-4 text-destructive" />
            <p>
              Please note: Custom or personalized items cannot be returned or exchanged unless defective.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-gold hover:bg-gold/90 text-white"
            onClick={() => window.open('https://wa.me/', '_blank')}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact Us on WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
