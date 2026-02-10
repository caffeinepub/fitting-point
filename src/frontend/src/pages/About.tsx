import { Award, Heart, Sparkles, Users, Package, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const values = [
    {
      icon: Package,
      title: 'Quality Products',
      description: 'Carefully selected items with quality fabrics and proper fit for real pilgrim needs.',
    },
    {
      icon: Heart,
      title: 'Sharia Compliant',
      description: 'All our products meet Islamic guidelines and are suitable for sacred journeys.',
    },
    {
      icon: Users,
      title: 'Pilgrim Focused',
      description: 'Designed with the comfort, hygiene, and ease of pilgrims in mind.',
    },
    {
      icon: Shield,
      title: 'Trustworthy',
      description: 'Honest presentation and reliable service for your pilgrimage preparation.',
    },
  ];

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl text-gold">About Fitting Point</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your trusted companion for the sacred journey. Specialized Hajj-Umrah essentials for pilgrims since 2025.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-serif text-4xl text-gold">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Fitting Point is a specialized Hajj-Umrah essentials brand and retail shop focused on serving pilgrims with practical, Sharia-compliant products.
              </p>
              <p>
                We offer carefully selected items like Ihram for men, Ihram belts, shoe bags, ihram soap, and other travel necessities designed for comfort, hygiene, and ease during pilgrimage.
              </p>
              <p>
                Our mission is to be your one-stop, trustworthy destination for pilgrims preparing for sacred journeys, providing products chosen and presented with clarity, honesty, and usability in mind.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/assets/hero1.png"
              alt="Men Ihram"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <img
              src="/assets/short belt hero 1.png"
              alt="Ihram Belt"
              className="w-full h-64 object-cover rounded-lg shadow-lg mt-8"
            />
          </div>
        </div>
      </section>

      {/* Our Difference */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-gold mb-4">Our Difference</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              What sets Fitting Point apart is our focus on quality fabrics, proper fit, and real pilgrim needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-gold/20 hover:border-gold transition-colors">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10">
                    <value.icon className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl text-gold">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-gold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-gold/20">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-2xl text-gold">Men's Ihram</h3>
                <p className="text-muted-foreground">
                  High-quality, comfortable Ihram garments made from premium fabrics for your sacred journey.
                </p>
              </CardContent>
            </Card>
            <Card className="border-gold/20">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-2xl text-gold">Ihram Belts</h3>
                <p className="text-muted-foreground">
                  Secure, practical belts with multiple compartments for valuables during Hajj and Umrah.
                </p>
              </CardContent>
            </Card>
            <Card className="border-gold/20">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-2xl text-gold">Shoe Bags</h3>
                <p className="text-muted-foreground">
                  Convenient storage solutions for footwear, keeping your belongings organized during travel.
                </p>
              </CardContent>
            </Card>
            <Card className="border-gold/20">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-2xl text-gold">Ihram Soap</h3>
                <p className="text-muted-foreground">
                  Specially formulated, fragrance-free soap suitable for use during the state of Ihram.
                </p>
              </CardContent>
            </Card>
            <Card className="border-gold/20">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-2xl text-gold">Abayas</h3>
                <p className="text-muted-foreground">
                  Modest, comfortable abayas designed for women pilgrims seeking quality and proper coverage.
                </p>
              </CardContent>
            </Card>
            <Card className="border-gold/20">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-2xl text-gold">Travel Necessities</h3>
                <p className="text-muted-foreground">
                  Additional essentials and accessories to make your pilgrimage journey more comfortable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Sparkles className="h-12 w-12 text-gold mx-auto" />
            <h2 className="font-serif text-4xl text-gold">Our Commitment</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you shop in-store or online, Fitting Point is committed to providing products chosen and presented with clarity, honesty, and usability in mind. We understand the importance of your sacred journey and strive to support you with the best quality essentials.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

