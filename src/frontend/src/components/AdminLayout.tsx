import { Shield, Package, Image, FolderTree, Users, ArrowLeft, Settings, Copy, Check, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsCallerAdmin, useAdminEmailPasswordLogin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
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
  const { identity, isInitializing } = useInternetIdentity();
  const emailPasswordLogin = useAdminEmailPasswordLogin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Use official static logo asset
  const logoSrc = '/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png';

  const principalId = identity?.getPrincipal().toString() || '';

  const handleCopyPrincipal = () => {
    navigator.clipboard.writeText(principalId);
    setCopied(true);
    toast.success('Principal ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailPasswordLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      await emailPasswordLogin.mutateAsync({ email, password });
      toast.success('Admin access granted! Welcome back.');
      // Navigate to admin dashboard after successful login
      setTimeout(() => {
        onNavigate('admin');
      }, 500);
    } catch (error: any) {
      console.error('Email/password login error:', error);
      
      // Parse the error to show appropriate message
      const parsedError = parseAdminAuthError(error);
      
      if (parsedError.type === 'invalid_credentials') {
        toast.error(parsedError.message);
      } else {
        toast.error(parsedError.message);
      }
    }
  };

  const profileLoading = isLoading || isInitializing;

  if (profileLoading) {
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
          <p className="text-muted-foreground">
            You must log in with Internet Identity before accessing the admin panel.
          </p>
          <Button onClick={() => onNavigate('home')} className="bg-gold hover:bg-gold/90 text-white">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!isAdmin && isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="p-8 max-w-lg w-full space-y-6">
          <div className="text-center space-y-4">
            <Shield className="h-16 w-16 text-destructive mx-auto" />
            <h2 className="font-serif text-2xl text-gold">Admin Login</h2>
            <p className="text-muted-foreground">Enter your admin credentials to continue.</p>
          </div>

          {/* Email + Password Login */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Admin Login</Label>
              <p className="text-xs text-muted-foreground">
                Log in with your admin email and password.
              </p>
            </div>

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
                  disabled={emailPasswordLogin.isPending}
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
                  disabled={emailPasswordLogin.isPending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEmailPasswordLogin();
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleEmailPasswordLogin}
                disabled={emailPasswordLogin.isPending || !email.trim() || !password.trim()}
                className="w-full bg-gold hover:bg-gold/90 text-white"
              >
                {emailPasswordLogin.isPending ? (
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

          {/* Principal ID Display */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Principal ID</Label>
              <div className="flex gap-2">
                <Input
                  value={principalId}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPrincipal}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this ID with an existing admin to request access.
              </p>
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

  // Admin is authenticated - show admin layout
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
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <img src={logoSrc} alt="Fitting Point" className="h-10 w-auto" />
            <div className="hidden md:block">
              <h1 className="font-serif text-xl text-gold">{title}</h1>
            </div>
          </div>
          <Button
            onClick={() => onNavigate('home')}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Admin
          </Button>
        </div>
      </header>

      <div className="container flex gap-6 px-4 py-6">
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
