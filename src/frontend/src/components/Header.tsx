import { ShoppingCart, Heart, Search, Menu, X, Shield, Moon, Sun, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useGuestCart } from '../hooks/useGuestCart';
import { useGuestWishlist } from '../hooks/useGuestWishlist';
import { useThemeMode } from '../hooks/useThemeMode';
import { navigationStructure } from '../utils/storefrontNav';
import Logo from './Logo';
import type { CatalogFilter } from '../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'checkout' | 'shipping' | 'returns' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { cart: guestCart } = useGuestCart();
  const { wishlist: guestWishlist } = useGuestWishlist();
  const { theme, toggleTheme } = useThemeMode();

  const cartCount = guestCart.reduce((sum, item) => sum + Number(item.quantity), 0);
  const wishlistCount = guestWishlist.length;

  const handleNavClick = (label: string, filter?: CatalogFilter) => {
    if (label === 'Home') {
      onNavigate('home');
    } else {
      onNavigate('catalog', undefined, filter || {});
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/98 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 border-b border-gold/20 shadow-sm">
      <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between py-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-300"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="font-serif text-gold">Menu</SheetTitle>
              </SheetHeader>
              <Accordion type="single" collapsible className="mt-6">
                {navigationStructure.map((item, idx) => (
                  item.subcategories ? (
                    <AccordionItem key={item.label} value={`item-${idx}`}>
                      <AccordionTrigger className="font-serif text-foreground hover:text-gold transition-colors duration-300">
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {item.subcategories.map((sub) => (
                            <button
                              key={sub.label}
                              onClick={() => {
                                handleNavClick(item.label, sub.filter);
                                setMobileMenuOpen(false);
                              }}
                              className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-gold transition-colors duration-300"
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleNavClick(item.label, item.filter);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-3 font-serif text-foreground hover:text-gold transition-colors duration-300 border-b border-border"
                    >
                      {item.label}
                    </button>
                  )
                ))}
                {isAdmin && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left py-3 font-serif text-foreground hover:text-gold transition-colors duration-300 border-b border-border"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </button>
                )}
              </Accordion>
            </SheetContent>
          </Sheet>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center flex-1 lg:flex-none transition-transform hover:scale-105 duration-300"
          >
            <Logo size="md" />
            <span className="ml-3 font-serif text-xl font-bold text-gold hidden sm:block">Fitting Point</span>
          </button>

          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navigationStructure.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.subcategories && setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <button
                  onClick={() => handleNavClick(item.label, item.filter)}
                  className={`px-4 py-2 text-sm font-serif transition-all duration-300 flex items-center gap-1 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-md ${
                    currentPage === 'catalog' || currentPage === 'home'
                      ? 'text-gold font-semibold'
                      : 'text-foreground'
                  }`}
                >
                  {item.label}
                  {item.subcategories && <ChevronDown className="h-3 w-3 transition-transform duration-300" />}
                </button>

                {item.subcategories && hoveredNav === item.label && (
                  <div className="absolute top-full left-0 mt-2 bg-background border border-gold/30 rounded-xl shadow-premium-lg min-w-[280px] py-3 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gold/20 mb-2">
                      <p className="font-heading text-sm font-bold text-gold">{item.label}</p>
                    </div>
                    {item.subcategories.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => {
                          handleNavClick(item.label, sub.filter);
                          setHoveredNav(null);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-gold/10 hover:text-gold transition-all duration-300 hover:translate-x-1 focus-visible:outline-none focus-visible:bg-gold/10 focus-visible:text-gold"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 text-sm font-serif text-foreground hover:text-gold transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-md"
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('wishlist')}
              className="relative text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('cart')}
              className="relative text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
