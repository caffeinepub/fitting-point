import { Shield, Package, Image, FolderTree, Users, ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  title: string;
}

export default function AdminLayout({ children, currentPage, onNavigate, title }: AdminLayoutProps) {
  const { data: isAdmin = false, isLoading } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();

  // Use official static logo asset
  const logoSrc = '/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="p-8 max-w-md text-center space-y-4">
          <Shield className="h-16 w-16 text-gold mx-auto" />
          <h2 className="font-serif text-2xl text-gold">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access the admin panel.</p>
          <Button onClick={() => onNavigate('home')} className="bg-gold hover:bg-gold/90 text-white">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="p-8 max-w-md text-center space-y-4">
          <Shield className="h-16 w-16 text-destructive mx-auto" />
          <h2 className="font-serif text-2xl text-gold">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to access the admin panel.</p>
          <Button onClick={() => onNavigate('home')} className="bg-gold hover:bg-gold/90 text-white">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', page: 'admin' as Page, icon: Shield },
    { label: 'Products', page: 'admin-products' as Page, icon: Package },
    { label: 'Lookbook', page: 'admin-lookbook' as Page, icon: Image },
    { label: 'Categories', page: 'admin-categories' as Page, icon: FolderTree },
    { label: 'User Sessions', page: 'admin-sessions' as Page, icon: Users },
    { label: 'Site Settings', page: 'admin-site-settings' as Page, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-background border-b border-gold/20 sticky top-0 z-40">
        <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={logoSrc}
                alt="Fitting Point"
                className="h-12 w-12 object-contain rounded-full"
              />
              <div>
                <h1 className="font-serif text-2xl text-gold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate('home')}
              className="border-gold text-gold hover:bg-gold hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-background border-r border-gold/20 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    currentPage === item.page
                      ? 'bg-gold/10 text-gold border border-gold/30'
                      : 'text-foreground hover:bg-gold/5 hover:text-gold'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-serif">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
