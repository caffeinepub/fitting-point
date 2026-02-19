import { ReactNode, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useIsAdminSignupEnabled } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import AdminSetupScreen from './admin/AdminSetupScreen';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  title?: string;
}

export default function AdminLayout({ children, currentPage, onNavigate, title }: AdminLayoutProps) {
  const { identity, loginStatus, login } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: signupEnabled, isLoading: signupLoading } = useIsAdminSignupEnabled();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isLoginError = loginStatus === 'loginError';

  // Show loading state while checking authentication or admin status
  if (isLoggingIn || isAdminLoading || signupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-auto p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Please log in with Internet Identity to access the admin panel
            </p>
          </div>
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full px-6 py-3 bg-gold hover:bg-gold-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
          </button>
          {isLoginError && (
            <p className="text-sm text-destructive">
              Login failed. Please try again.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Authenticated but not admin
  if (!isAdmin) {
    // Show setup screen if signup is enabled
    if (signupEnabled) {
      return <AdminSetupScreen />;
    }

    // Access denied if signup is closed
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-auto p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground">
              Your Internet Identity does not have admin privileges.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Admin registration is currently closed. Please contact the site administrator for access.
            </p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="w-full px-6 py-3 bg-gold hover:bg-gold-dark text-white rounded-lg font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Admin verified - render admin content
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('admin')}
                className="text-xl font-bold text-gold hover:text-gold-dark transition-colors"
              >
                Admin Panel
              </button>
              {title && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground font-medium">{title}</span>
                </>
              )}
            </div>
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => onNavigate('admin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'admin'
                    ? 'bg-gold text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('admin-products')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'admin-products'
                    ? 'bg-gold text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => onNavigate('admin-categories')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'admin-categories'
                    ? 'bg-gold text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => onNavigate('admin-lookbook')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'admin-lookbook'
                    ? 'bg-gold text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Lookbook
              </button>
              <button
                onClick={() => onNavigate('admin-site-settings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'admin-site-settings'
                    ? 'bg-gold text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                View Site
              </button>
            </nav>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
