import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function CustomerReviewsSection() {
  const reviews = [
    {
      name: 'Ahmed Al-Rashid',
      rating: 5,
      review: 'Exceptional quality and service. The Ihram set I purchased was perfect for my Hajj journey. Highly recommend Fitting Point for all pilgrimage essentials.',
    },
    {
      name: 'Fatima Hassan',
      rating: 5,
      review: 'Beautiful products with attention to detail. The customer service was outstanding, and delivery was prompt. Will definitely shop here again for my next Umrah.',
    },
    {
      name: 'Omar Abdullah',
      rating: 5,
      review: 'Premium quality at reasonable prices. Everything I needed for my pilgrimage in one place. The accessories are durable and well-made. Excellent experience!',
    },
  ];

  return (
    <section className="section-spacing bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-gold mb-4">
          Customer Reviews
        </h2>
        <p className="text-center text-muted-foreground font-body text-lg mb-12">
          Hear from our satisfied customers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="border-gold/10 hover:border-gold/30 transition-all duration-300 hover:shadow-gold-subtle"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-body text-base text-foreground leading-relaxed">
                  "{review.review}"
                </p>
                <div className="pt-4 border-t border-gold/10">
                  <p className="font-serif font-semibold text-gold">{review.name}</p>
                  <p className="text-sm text-muted-foreground font-body">Verified Customer</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
