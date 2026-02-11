import { Shield, Package, Image, FolderTree, Users, ArrowLeft, Settings, Mail, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useAdminSession } from '../hooks/useAdminSession';
import { useState } from 'react';
import { toast } from 'sonner';
import { parseAdminAuthError } from '../utils/adminAuthError';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  title: string;
}

export default function AdminLayout({ children, currentPage, onNavigate, title }: AdminLayoutProps) {
  const { data: isAdmin = false, isLoading, isFetched } = useIsCallerAdmin();
  const { login, logout, isLoggingIn } = useAdminSession();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logoSrc = '/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png';

  const handleEmailPasswordLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      await login({ email: trimmedEmail, password: trimmedPassword });
      toast.success('Admin access granted! Welcome back.');
      // No need to navigate - query invalidation will trigger re-render
    } catch (error: any) {
      console.error('Email/password login error:', error);
      
      const parsedError = parseAdminAuthError(error);
      toast.error(parsedError.message);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    onNavigate('home');
  };

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

  if (!isAdmin && isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="p-8 max-w-lg w-full space-y-6">
          <div className="text-center space-y-4">
            <Shield className="h-16 w-16 text-gold mx-auto" />
            <h2 className="font-serif text-2xl text-gold">Admin Login</h2>
            <p className="text-muted-foreground">Enter your admin credentials to continue.</p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoggingIn}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEmailPasswordLogin();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEmailPasswordLogin();
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleEmailPasswordLogin}
                disabled={isLoggingIn || !email.trim() || !password.trim()}
                className="w-full bg-gold hover:bg-gold/90 text-white"
              >
                {isLoggingIn ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={() => onNavigate('home')}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const navItems = [
    { page: 'admin' as Page, icon: Shield, label: 'Dashboard' },
    { page: 'admin-products' as Page, icon: Package, label: 'Products' },
    { page: 'admin-lookbook' as Page, icon: Image, label: 'Lookbook' },
    { page: 'admin-categories' as Page, icon: FolderTree, label: 'Categories' },
    { page: 'admin-sessions' as Page, icon: Users, label: 'Sessions' },
    { page: 'admin-site-settings' as Page, icon: Settings, label: 'Site Settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <img src={logoSrc} alt="Fitting Point" className="h-10 w-auto" />
            <div className="hidden md:block">
              <h1 className="font-serif text-xl text-gold">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button
              onClick={() => onNavigate('home')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Admin
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex gap-6 px-4 py-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="space-y-2 sticky top-24">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gold text-white'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
