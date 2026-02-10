import { useState } from 'react';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminLookbook from './pages/admin/AdminLookbook';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSessions from './pages/admin/AdminSessions';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'checkout' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const navigateTo = (page: Page, productId?: string, category?: string) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    if (category) setCategoryFilter(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'catalog':
        return <ProductCatalog onNavigate={navigateTo} initialCategory={categoryFilter} />;
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
