import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RuntimeErrorBoundary } from './components/RuntimeErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Lookbook from './pages/Lookbook';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import Diagnostics from './pages/Diagnostics';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminLookbook from './pages/admin/AdminLookbook';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSessions from './pages/admin/AdminSessions';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export type CatalogFilter = {
  category?: string;
  productType?: string;
  usageCategory?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isMostLoved?: boolean;
};

type Page = 
  | 'home' 
  | 'catalog' 
  | 'product' 
  | 'cart' 
  | 'wishlist' 
  | 'lookbook' 
  | 'about' 
  | 'contact' 
  | 'checkout' 
  | 'shipping' 
  | 'returns' 
  | 'diagnostics'
  | 'admin' 
  | 'admin-products' 
  | 'admin-lookbook' 
  | 'admin-categories' 
  | 'admin-sessions'
  | 'admin-site-settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>({});

  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path === '/' || path === '/home') {
      setCurrentPage('home');
    } else if (path === '/catalog') {
      setCurrentPage('catalog');
      const filter: CatalogFilter = {};
      if (params.get('category')) filter.category = params.get('category')!;
      if (params.get('productType')) filter.productType = params.get('productType')!;
      if (params.get('usageCategory')) filter.usageCategory = params.get('usageCategory')!;
      if (params.get('isNew')) filter.isNew = params.get('isNew') === 'true';
      if (params.get('isBestseller')) filter.isBestseller = params.get('isBestseller') === 'true';
      if (params.get('isMostLoved')) filter.isMostLoved = params.get('isMostLoved') === 'true';
      setCatalogFilter(filter);
    } else if (path.startsWith('/product/')) {
      const productId = path.split('/product/')[1];
      setCurrentPage('product');
      setSelectedProductId(productId);
    } else if (path === '/cart') {
      setCurrentPage('cart');
    } else if (path === '/wishlist') {
      setCurrentPage('wishlist');
    } else if (path === '/lookbook') {
      setCurrentPage('lookbook');
    } else if (path === '/about') {
      setCurrentPage('about');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else if (path === '/checkout') {
      setCurrentPage('checkout');
    } else if (path === '/shipping') {
      setCurrentPage('shipping');
    } else if (path === '/returns') {
      setCurrentPage('returns');
    } else if (path === '/__diagnostics') {
      setCurrentPage('diagnostics');
    } else if (path === '/admin/products') {
      setCurrentPage('admin-products');
    } else if (path === '/admin/lookbook') {
      setCurrentPage('admin-lookbook');
    } else if (path === '/admin/categories') {
      setCurrentPage('admin-categories');
    } else if (path === '/admin/sessions') {
      setCurrentPage('admin-sessions');
    } else if (path === '/admin/site-settings') {
      setCurrentPage('admin-site-settings');
    } else if (path === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  const handleNavigate = (page: Page, productId?: string, filter?: CatalogFilter) => {
    setCurrentPage(page);
    
    if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else if (page === 'catalog') {
      const params = new URLSearchParams();
      if (filter?.category) params.set('category', filter.category);
      if (filter?.productType) params.set('productType', filter.productType);
      if (filter?.usageCategory) params.set('usageCategory', filter.usageCategory);
      if (filter?.isNew) params.set('isNew', 'true');
      if (filter?.isBestseller) params.set('isBestseller', 'true');
      if (filter?.isMostLoved) params.set('isMostLoved', 'true');
      const queryString = params.toString();
      window.history.pushState({}, '', `/catalog${queryString ? `?${queryString}` : ''}`);
      setCatalogFilter(filter || {});
    } else if (page === 'product' && productId) {
      window.history.pushState({}, '', `/product/${productId}`);
      setSelectedProductId(productId);
    } else if (page === 'diagnostics') {
      window.history.pushState({}, '', '/__diagnostics');
    } else if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'admin-products') {
      window.history.pushState({}, '', '/admin/products');
    } else if (page === 'admin-lookbook') {
      window.history.pushState({}, '', '/admin/lookbook');
    } else if (page === 'admin-categories') {
      window.history.pushState({}, '', '/admin/categories');
    } else if (page === 'admin-sessions') {
      window.history.pushState({}, '', '/admin/sessions');
    } else if (page === 'admin-site-settings') {
      window.history.pushState({}, '', '/admin/site-settings');
    } else {
      window.history.pushState({}, '', `/${page}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);

      if (path === '/' || path === '/home') {
        setCurrentPage('home');
      } else if (path === '/catalog') {
        setCurrentPage('catalog');
        const filter: CatalogFilter = {};
        if (params.get('category')) filter.category = params.get('category')!;
        if (params.get('productType')) filter.productType = params.get('productType')!;
        if (params.get('usageCategory')) filter.usageCategory = params.get('usageCategory')!;
        if (params.get('isNew')) filter.isNew = params.get('isNew') === 'true';
        if (params.get('isBestseller')) filter.isBestseller = params.get('isBestseller') === 'true';
        if (params.get('isMostLoved')) filter.isMostLoved = params.get('isMostLoved') === 'true';
        setCatalogFilter(filter);
      } else if (path.startsWith('/product/')) {
        const productId = path.split('/product/')[1];
        setCurrentPage('product');
        setSelectedProductId(productId);
      } else if (path === '/cart') {
        setCurrentPage('cart');
      } else if (path === '/wishlist') {
        setCurrentPage('wishlist');
      } else if (path === '/lookbook') {
        setCurrentPage('lookbook');
      } else if (path === '/about') {
        setCurrentPage('about');
      } else if (path === '/contact') {
        setCurrentPage('contact');
      } else if (path === '/checkout') {
        setCurrentPage('checkout');
      } else if (path === '/shipping') {
        setCurrentPage('shipping');
      } else if (path === '/returns') {
        setCurrentPage('returns');
      } else if (path === '/__diagnostics') {
        setCurrentPage('diagnostics');
      } else if (path === '/admin/products') {
        setCurrentPage('admin-products');
      } else if (path === '/admin/lookbook') {
        setCurrentPage('admin-lookbook');
      } else if (path === '/admin/categories') {
        setCurrentPage('admin-categories');
      } else if (path === '/admin/sessions') {
        setCurrentPage('admin-sessions');
      } else if (path === '/admin/site-settings') {
        setCurrentPage('admin-site-settings');
      } else if (path === '/admin') {
        setCurrentPage('admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminPage = currentPage.startsWith('admin');
  const isDiagnosticsPage = currentPage === 'diagnostics';

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'catalog':
        return <ProductCatalog onNavigate={handleNavigate} initialFilter={catalogFilter} />;
      case 'product':
        return selectedProductId ? (
          <ProductDetail productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'wishlist':
        return <Wishlist onNavigate={handleNavigate} />;
      case 'lookbook':
        return <Lookbook onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'shipping':
        return <Shipping />;
      case 'returns':
        return <Returns />;
      case 'diagnostics':
        return <Diagnostics />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'admin-products':
        return <AdminProducts onNavigate={handleNavigate} />;
      case 'admin-lookbook':
        return <AdminLookbook onNavigate={handleNavigate} />;
      case 'admin-categories':
        return <AdminCategories onNavigate={handleNavigate} />;
      case 'admin-sessions':
        return <AdminSessions onNavigate={handleNavigate} />;
      case 'admin-site-settings':
        return <AdminSiteSettings onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RuntimeErrorBoundary>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            {!isAdminPage && !isDiagnosticsPage && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
            <main className="flex-1">
              {renderPage()}
            </main>
            {!isAdminPage && !isDiagnosticsPage && <Footer onNavigate={handleNavigate} />}
            <Toaster />
          </div>
        </RuntimeErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
