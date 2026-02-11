import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminLookbook from './pages/admin/AdminLookbook';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSessions from './pages/admin/AdminSessions';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';

export type CatalogFilter = {
  category?: string | null;
  subcategory?: string | null;
  productType?: string | null;
  usageCategory?: string | null;
  isNew?: boolean;
  isBestseller?: boolean;
};

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'checkout' | 'shipping' | 'returns' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>({});

  // Parse URL on mount and popstate
  useEffect(() => {
    const parseURL = () => {
      const path = window.location.pathname;
      
      if (path === '/' || path === '') {
        setCurrentPage('home');
      } else if (path === '/catalog') {
        setCurrentPage('catalog');
      } else if (path.startsWith('/product/')) {
        const productId = path.replace('/product/', '');
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
      } else if (path === '/admin' || path.startsWith('/admin')) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    parseURL();

    const handlePopState = () => {
      parseURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: Page, productId?: string, filter?: CatalogFilter) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    if (filter) setCatalogFilter(filter);

    // Update URL
    let path = '/';
    switch (page) {
      case 'home':
        path = '/';
        break;
      case 'catalog':
        path = '/catalog';
        break;
      case 'product':
        path = productId ? `/product/${productId}` : '/catalog';
        break;
      case 'cart':
        path = '/cart';
        break;
      case 'wishlist':
        path = '/wishlist';
        break;
      case 'lookbook':
        path = '/lookbook';
        break;
      case 'about':
        path = '/about';
        break;
      case 'contact':
        path = '/contact';
        break;
      case 'checkout':
        path = '/checkout';
        break;
      case 'shipping':
        path = '/shipping';
        break;
      case 'returns':
        path = '/returns';
        break;
      case 'admin':
        path = '/admin';
        break;
      case 'admin-products':
        path = '/admin/products';
        break;
      case 'admin-lookbook':
        path = '/admin/lookbook';
        break;
      case 'admin-categories':
        path = '/admin/categories';
        break;
      case 'admin-sessions':
        path = '/admin/sessions';
        break;
      case 'admin-site-settings':
        path = '/admin/site-settings';
        break;
    }

    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'catalog':
        return <ProductCatalog onNavigate={navigateTo} initialFilter={catalogFilter} />;
      case 'product':
        return selectedProductId ? (
          <ProductDetail productId={selectedProductId} onNavigate={navigateTo} />
        ) : (
          <HomePage onNavigate={navigateTo} />
        );
      case 'cart':
        return <Cart onNavigate={navigateTo} />;
      case 'wishlist':
        return <Wishlist onNavigate={navigateTo} />;
      case 'lookbook':
        return <Lookbook onNavigate={navigateTo} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'checkout':
        return <Checkout onNavigate={navigateTo} />;
      case 'shipping':
        return <Shipping />;
      case 'returns':
        return <Returns />;
      case 'admin':
        return <AdminDashboard onNavigate={navigateTo} />;
      case 'admin-products':
        return <AdminProducts onNavigate={navigateTo} />;
      case 'admin-lookbook':
        return <AdminLookbook onNavigate={navigateTo} />;
      case 'admin-categories':
        return <AdminCategories onNavigate={navigateTo} />;
      case 'admin-sessions':
        return <AdminSessions onNavigate={navigateTo} />;
      case 'admin-site-settings':
        return <AdminSiteSettings onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage={currentPage} onNavigate={navigateTo} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={navigateTo} />
      <Toaster />
    </div>
  );
}

export default App;
