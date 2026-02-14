import { Shield, Package, Image, FolderTree, Users, ArrowLeft, Settings, LogOut, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useAdminSession } from '../hooks/useAdminSession';
import { useBackendReadiness } from '../hooks/useBackendReadiness';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useEffect } from 'react';
import { toast } from 'sonner';
import AdminAuthDiagnostics from './admin/AdminAuthDiagnostics';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  title: string;
}

export default function AdminLayout({ children, currentPage, onNavigate, title }: AdminLayoutProps) {
  const { isReady, isPolling: readinessPolling, hasError: readinessHasError, error: readinessError, retry: retryReadiness } = useBackendReadiness();
  const { identity, login, clear, loginStatus, isInitializing: iiInitializing } = useInternetIdentity();
  const { data: isAdmin = false, isLoading: adminCheckLoading, error: adminCheckError, refetch: refetchAdmin } = useIsCallerAdmin();
  const { login: verifyAdmin, logout, resetSession } = useAdminSession();

  const logoSrc = '/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png';
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Navigate to admin dashboard after successful admin verification
  useEffect(() => {
    if (isAdmin && currentPage !== 'admin') {
      onNavigate('admin');
    }
  }, [isAdmin, currentPage, onNavigate]);

  // After successful Internet Identity login, verify admin status
  useEffect(() => {
    if (isAuthenticated && !adminCheckLoading && !adminCheckError && !isAdmin) {
      // Trigger admin verification
      verifyAdmin().catch((error) => {
        console.error('Admin verification failed:', error);
      });
    }
  }, [isAuthenticated, adminCheckLoading, adminCheckError, isAdmin, verifyAdmin]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('Login failed', {
          description: error.message || 'Please try again',
        });
      }
    }
  };

  const handleLogout = async () => {
    logout();
    await clear();
    toast.success('Logged out successfully');
    onNavigate('home');
  };

  const handleResetSession = () => {
    resetSession();
    toast.info('Admin session reset. Please log in again.');
  };

  const handleRetryReadiness = () => {
    retryReadiness();
    toast.info('Retrying backend connection...');
  };

  const handleRetryVerification = () => {
    refetchAdmin();
    toast.info('Retrying admin verification...');
  };

  // STEP 1: Check backend readiness (loading)
  if (readinessPolling) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              Connecting to Backend
            </h2>
            <p className="text-muted-foreground">
              Establishing connection...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // STEP 2: Handle readiness error with retry action
  if (readinessHasError || readinessError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              Connection Error
            </h2>
          </div>
          <AdminAuthDiagnostics error={readinessError} />
          <div className="space-y-2">
            <Button 
              onClick={handleRetryReadiness}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
            <Button 
              onClick={handleResetSession}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Reset Admin Session
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // STEP 3: Backend ready confirmation
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              Initializing
            </h2>
            <p className="text-muted-foreground">
              Please wait...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // STEP 4: If not authenticated, show Internet Identity login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={logoSrc} 
              alt="Fitting Point Logo" 
              className="h-16 w-auto object-contain"
            />
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Admin Access
              </h1>
              <p className="text-muted-foreground">
                Log in with Internet Identity to access the admin panel
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full"
              size="lg"
              disabled={iiInitializing || loginStatus === 'logging-in'}
            >
              {loginStatus === 'logging-in' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Log in with Internet Identity
                </>
              )}
            </Button>

            {loginStatus === 'loginError' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Login failed. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="pt-4 border-t text-center text-sm text-muted-foreground">
            <p>First-time login? You'll be prompted to create an Internet Identity.</p>
          </div>
        </Card>
      </div>
    );
  }

  // STEP 5: Check admin status (loading)
  if (adminCheckLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              Verifying Access
            </h2>
            <p className="text-muted-foreground">
              Checking admin permissions...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // STEP 6: Handle admin check error with retry and reset actions
  if (adminCheckError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              Verification Error
            </h2>
          </div>
          <AdminAuthDiagnostics error={adminCheckError} />
          <div className="space-y-2">
            <Button 
              onClick={handleRetryVerification}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Verification
            </Button>
            <Button 
              onClick={handleResetSession}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Reset Session
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // STEP 7: If authenticated but not admin, show insufficient permissions
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              You do not have admin permissions
            </p>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your account is not authorized to access the admin panel. Please contact the site administrator or log in with an admin account.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Button 
              onClick={handleLogout}
              className="w-full"
              size="lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout and Switch Account
            </Button>
            <Button 
              onClick={handleRetryVerification}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Verification
            </Button>
            <Button 
              onClick={handleResetSession}
              variant="ghost"
              className="w-full"
              size="sm"
            >
              Reset Admin Session
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // STEP 8: Admin verified - show admin panel
  const menuItems = [
    { id: 'admin' as Page, label: 'Dashboard', icon: Shield },
    { id: 'admin-products' as Page, label: 'Products', icon: Package },
    { id: 'admin-lookbook' as Page, label: 'Lookbook', icon: Image },
    { id: 'admin-categories' as Page, label: 'Categories', icon: FolderTree },
    { id: 'admin-sessions' as Page, label: 'Sessions', icon: Users },
    { id: 'admin-site-settings' as Page, label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <img 
              src={logoSrc} 
              alt="Fitting Point Logo" 
              className="h-10 w-auto object-contain"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-serif font-semibold text-foreground">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">
                {title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex gap-6 py-6 px-4">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
