import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import type { CatalogFilter } from '../../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface ContactCtaSectionProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function ContactCtaSection({ onNavigate }: ContactCtaSectionProps) {
  const services = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our experts',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Find our location',
    },
  ];

  return (
    <section className="section-spacing bg-gradient-to-br from-gold/5 via-background to-gold/5">
      <div className="max-w-7xl mx-auto">
        <Card className="border-gold/20 hover:border-gold/40 transition-all duration-500 hover:shadow-premium-lg overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-gold">
                  Need Assistance?
                </h2>
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  Our dedicated team is here to help you find the perfect essentials for your sacred journey. 
                  Reach out to us for personalized guidance and support.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={service.title}
                        className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/30 hover:bg-gold/10 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <Icon className="h-8 w-8 text-gold mb-2" />
                        <p className="font-serif text-sm font-semibold text-foreground">{service.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-gold hover:bg-gold-dark text-white transition-all duration-300 hover:shadow-gold-soft hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    onClick={() => onNavigate('contact')}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contact Us
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    onClick={() => onNavigate('about')}
                  >
                    Learn More About Us
                  </Button>
                </div>
              </div>

              <div className="relative h-[300px] lg:h-[400px] rounded-lg overflow-hidden group">
                <img
                  src="/assets/generated/lookbook-2.dim_800x1000.jpg"
                  alt="Customer service"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
