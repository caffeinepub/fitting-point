import { Heart } from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiYoutube } from 'react-icons/si';
import { Separator } from '@/components/ui/separator';
import Logo from './Logo';
import type { CatalogFilter } from '../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface FooterProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  const appIdentifier = encodeURIComponent(window.location.hostname || 'fitting-point');

  const quickLinks = [
    { label: 'Home', page: 'home' as Page },
    { label: 'Shop', page: 'catalog' as Page },
    { label: 'Lookbook', page: 'lookbook' as Page },
    { label: 'About Us', page: 'about' as Page },
  ];

  const customerService = [
    { label: 'Contact Us', page: 'contact' as Page },
    { label: 'Shipping', page: 'shipping' as Page },
    { label: 'Returns', page: 'returns' as Page },
    { label: 'Wishlist', page: 'wishlist' as Page },
  ];

  const socialLinks = [
    { icon: SiFacebook, label: 'Facebook', href: '#' },
    { icon: SiX, label: 'X (Twitter)', href: '#' },
    { icon: SiInstagram, label: 'Instagram', href: '#' },
    { icon: SiYoutube, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="bg-muted/30 border-t border-gold/20 mt-auto">
      <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              Your trusted companion for the sacred journey. Premium Hajj and Umrah essentials crafted with care and devotion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg text-gold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif text-lg text-gold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-serif text-lg text-gold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-gold transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="bg-gold/20 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Fitting Point. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-gold fill-gold" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
