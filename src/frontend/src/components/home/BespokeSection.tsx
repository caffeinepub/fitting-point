import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, CheckCircle } from 'lucide-react';
import type { CatalogFilter } from '../../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface BespokeSectionProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function BespokeSection({ onNavigate }: BespokeSectionProps) {
  return (
    <section className="section-spacing bg-gradient-to-br from-gold/5 via-background to-gold/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-gold" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gold">
              Bespoke Services
            </h2>
            <Sparkles className="h-8 w-8 text-gold" />
          </div>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience personalized excellence with our custom tailoring and design services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Card className="border-gold/20 hover:border-gold/40 transition-all duration-500 hover:shadow-premium-lg">
            <CardContent className="p-8 space-y-6">
              <h3 className="font-heading text-2xl font-bold text-gold">
                Custom Tailoring & Design
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Create something truly unique for your sacred journey. Our expert craftsmen work with you to design and tailor garments that perfectly match your vision and requirements.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Personalized consultations with experienced designers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Premium fabrics and materials sourced for quality
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Perfect fit guaranteed with multiple fittings
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Timely delivery for your pilgrimage schedule
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="bg-gold hover:bg-gold-dark text-white transition-all duration-300 hover:shadow-gold-soft hover:scale-105"
                  onClick={() => onNavigate('contact')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Get in Touch
                </Button>
                <Button
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300"
                  onClick={() => onNavigate('catalog')}
                >
                  View Our Collection
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden group">
            <img
              src="/assets/generated/lookbook-1.dim_800x1000.jpg"
              alt="Bespoke tailoring showcase"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="font-heading text-xl md:text-2xl font-bold">
                Crafted with Precision & Care
              </p>
              <p className="font-body text-sm md:text-base opacity-90 mt-2">
                Every stitch tells a story of dedication
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
