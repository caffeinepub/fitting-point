import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { SiteContentBlock } from '../../backend';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface HomepageSectionRendererProps {
  sections: SiteContentBlock[];
  onNavigate: (page: Page) => void;
}

export default function HomepageSectionRenderer({ sections, onNavigate }: HomepageSectionRendererProps) {
  const validSections = sections.filter(s => s.content && s.content.trim().length > 0);

  if (validSections.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {validSections.map((section, index) => (
            <div key={index} className="space-y-6">
              {section.title && section.title !== 'hero-banner' && (
                <h2 className="font-serif text-3xl md:text-4xl text-gold text-center">
                  {section.title}
                </h2>
              )}
              {section.image && (
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={section.image.getDirectURL()}
                    alt={section.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              )}
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
          <div className="text-center pt-6">
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white font-serif"
              onClick={() => onNavigate('about')}
            >
              Learn More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
