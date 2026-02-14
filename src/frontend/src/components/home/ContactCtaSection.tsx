import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface ContactCtaSectionProps {
  onNavigate: (page: Page) => void;
}

export default function ContactCtaSection({ onNavigate }: ContactCtaSectionProps) {
  return (
    <section className="section-spacing bg-gradient-to-br from-gold/5 via-background to-gold/5">
      <div className="max-w-5xl mx-auto">
        <Card className="border-gold/20 shadow-premium-lg overflow-hidden transition-all duration-500 hover:shadow-premium-lg hover:border-gold/40">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-gold">
                Get in Touch
              </h2>
              <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions about our products or need assistance with your order? 
                Our dedicated team is here to help you prepare for your sacred journey.
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-foreground transition-colors duration-300 hover:text-gold">
                  <Phone className="w-5 h-5 text-gold" />
                  <span className="font-body">Available 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-foreground transition-colors duration-300 hover:text-gold">
                  <Mail className="w-5 h-5 text-gold" />
                  <span className="font-body">Quick Response</span>
                </div>
                <div className="flex items-center gap-2 text-foreground transition-colors duration-300 hover:text-gold">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span className="font-body">Worldwide Shipping</span>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-white mt-6 transition-all duration-300 hover:shadow-gold-soft hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                onClick={() => onNavigate('contact')}
              >
                Contact Us Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
