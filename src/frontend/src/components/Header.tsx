import { ShoppingCart, Heart, Search, Menu, X, Shield, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetWishlist, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGuestCart } from '../hooks/useGuestCart';
import { useGuestWishlist } from '../hooks/useGuestWishlist';
import { useThemeMode } from '../hooks/useThemeMode';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'checkout' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const { data: backendWishlist = [] } = useGetWishlist();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { cart: guestCart } = useGuestCart();
  const { wishlist: guestWishlist } = useGuestWishlist();
  const { theme, toggleTheme } = useThemeMode();

  const isAuthenticated = !!identity;

  // Use guest cart/wishlist when not authenticated
  const cartCount = isAuthenticated 
    ? 0 // Backend cart count would come from useGetCart
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

  const navItems = [
    { label: 'Home', page: 'home' as Page },
    { label: 'Shop', page: 'catalog' as Page },
    { label: 'Lookbook', page: 'lookbook' as Page },
    { label: 'About', page: 'about' as Page },
    { label: 'Contact', page: 'contact' as Page },
  ];

  // Use official static logo asset
  const logoSrc = '/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png';

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-gold/20">
      <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gold hover:text-gold/80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center flex-1 lg:flex-none transition-transform hover:scale-105 duration-300"
          >
            <img
              src={logoSrc}
              alt="Fitting Point"
              className="h-20 w-20 object-contain rounded-full"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-sm font-serif tracking-wider transition-all duration-300 ${
                  currentPage === item.page
                    ? 'text-gold border-b-2 border-gold pb-1'
                    : 'text-foreground hover:text-gold'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`text-sm font-serif tracking-wider transition-all duration-300 flex items-center gap-1 ${
                  currentPage.startsWith('admin')
                    ? 'text-gold border-b-2 border-gold pb-1'
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
          <div className="pb-4 animate-in slide-in-from-top-2">
            <Input
              type="search"
              placeholder="Search for pilgrimage essentials..."
              className="w-full border-gold/30 focus:border-gold transition-all duration-300"
            />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md font-serif tracking-wider transition-all duration-300 ${
                  currentPage === item.page
                    ? 'bg-gold/10 text-gold'
                    : 'text-foreground hover:bg-gold/5 hover:text-gold'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded-md font-serif tracking-wider transition-all duration-300 ${
                  currentPage.startsWith('admin')
                    ? 'bg-gold/10 text-gold'
                    : 'text-foreground hover:bg-gold/5 hover:text-gold'
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}
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
          </nav>
        )}
      </div>
    </header>
  );
}
