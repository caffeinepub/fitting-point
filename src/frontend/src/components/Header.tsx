import { ShoppingCart, Heart, Search, Menu, X, Shield, Moon, Sun, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useGetWishlist, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGuestCart } from '../hooks/useGuestCart';
import { useGuestWishlist } from '../hooks/useGuestWishlist';
import { useThemeMode } from '../hooks/useThemeMode';
import { navigationStructure } from '../utils/storefrontNav';
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
  
  const { data: backendWishlist = [] } = useGetWishlist();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { cart: guestCart } = useGuestCart();
  const { wishlist: guestWishlist } = useGuestWishlist();
  const { theme, toggleTheme } = useThemeMode();

  const isAuthenticated = !!identity;

  const cartCount = isAuthenticated 
    ? 0
    : guestCart.reduce((sum, item) => sum + Number(item.quantity), 0);
  
  const wishlistCount = isAuthenticated ? backendWishlist.length : guestWishlist.length;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleNavClick = (label: string, filter?: CatalogFilter) => {
    if (label === 'Home') {
      onNavigate('home');
    } else {
      onNavigate('catalog', undefined, filter || {});
    }
  };

  const logoSrc = '/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png';

  return (
    <header className="sticky top-0 z-50 bg-background/98 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 border-b border-gold/20 shadow-sm">
      <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between py-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gold hover:text-gold/80"
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
              <div className="mt-6">
                <Button
                  onClick={handleAuth}
                  disabled={loginStatus === 'logging-in'}
                  className={`w-full ${
                    isAuthenticated
                      ? 'bg-muted hover:bg-muted/80 text-foreground'
                      : 'bg-gold hover:bg-gold/90 text-white'
                  }`}
                >
                  {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center flex-1 lg:flex-none transition-transform hover:scale-105 duration-300"
          >
            <img
              src={logoSrc}
              alt="Fitting Point"
              className="h-16 w-16 object-contain"
            />
            <span className="ml-3 font-serif text-xl font-bold text-gold hidden sm:block">Fitting Point</span>
          </button>

          {/* Desktop Navigation */}
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
                  className={`px-4 py-2 text-sm font-serif tracking-wider transition-all duration-300 flex items-center gap-1 ${
                    currentPage === 'catalog' || currentPage === 'home'
                      ? 'text-gold'
                      : 'text-foreground hover:text-gold'
                  }`}
                >
                  {item.label}
                  {item.subcategories && <ChevronDown className="h-3 w-3" />}
                </button>

                {/* Mega Menu Dropdown */}
                {item.subcategories && hoveredNav === item.label && (
                  <div className="absolute top-full left-0 mt-2 bg-background border border-gold/20 rounded-lg shadow-gold-soft min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-4 space-y-2">
                      {item.subcategories.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => {
                            handleNavClick(item.label, sub.filter);
                            setHoveredNav(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-gold hover:bg-gold/5 rounded transition-all duration-300"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-4 py-2 text-sm font-serif tracking-wider transition-all duration-300 flex items-center gap-1 ${
                  currentPage.startsWith('admin')
                    ? 'text-gold'
                    : 'text-foreground hover:text-gold'
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-300"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-300"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-300"
              onClick={() => onNavigate('wishlist')}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gold hover:text-gold/80 hover:bg-gold/10 transition-all duration-300"
              onClick={() => onNavigate('cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              onClick={handleAuth}
              disabled={loginStatus === 'logging-in'}
              className={`hidden lg:flex transition-all duration-300 ${
                isAuthenticated
                  ? 'bg-muted hover:bg-muted/80 text-foreground'
                  : 'bg-gold hover:bg-gold/90 text-white'
              }`}
            >
              {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-in slide-in-from-top-2 duration-300">
            <Input
              type="search"
              placeholder="Search for pilgrimage essentials..."
              className="w-full border-gold/30 focus:border-gold transition-all duration-300"
            />
          </div>
        )}
      </div>
    </header>
  );
}
