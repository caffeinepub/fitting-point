import { Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useGetSiteContent } from '../hooks/useSiteContent';
import { getSiteContentDefaults } from '../utils/siteContentDefaults';

export default function Contact() {
  const { data: siteContent } = useGetSiteContent();
  const defaults = getSiteContentDefaults();
  
  // Get contact details with rich text support
  const contactDetailsContent = siteContent?.contactDetails || defaults.contactDetails;

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      content: contactDetailsContent,
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 9826022251', 'Mon-Sat: 10AM - 8PM IST'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['fitting.point.official@gmail.com'],
    },
  ];

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl text-gold">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Reach out with any questions about our pilgrimage essentials.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="border-gold/20 hover:border-gold transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10">
                  <info.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl text-gold">{info.title}</h3>
                <div className="space-y-1">
                  {info.content ? (
                    <div 
                      className="text-muted-foreground text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: info.content }}
                    />
                  ) : (
                    info.details?.map((detail, i) => (
                      <p key={i} className="text-muted-foreground text-sm">
                        {detail}
                      </p>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card className="max-w-2xl mx-auto border-gold/20">
          <CardContent className="p-8">
            <h2 className="font-serif text-3xl text-gold mb-6 text-center">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" className="border-gold/30 focus:border-gold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="border-gold/30 focus:border-gold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" className="border-gold/30 focus:border-gold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  className="border-gold/30 focus:border-gold resize-none"
                />
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-white" size="lg">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* WhatsApp CTA */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="max-w-2xl mx-auto border-gold/20 bg-gold/5">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="font-serif text-2xl text-gold">Prefer WhatsApp?</h3>
            <p className="text-muted-foreground">
              Get instant support and quick responses via WhatsApp
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gold hover:bg-gold/90 text-white"
            >
              <a href="https://wa.me/+919826022251" target="_blank" rel="noopener noreferrer">
                <MessageCircleIcon className="mr-2 h-5 w-5" />
                Chat on WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
