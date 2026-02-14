import { Package, Image, FolderTree, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetAllProducts, useGetAllLookbookImages } from '../../hooks/useQueries';
import AdminLayout from '../../components/AdminLayout';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { data: products = [] } = useGetAllProducts();
  const { data: lookbookImages = [] } = useGetAllLookbookImages();

  const categories = [...new Set(products.map((p) => p.category))];
  const totalValue = products.reduce((sum, p) => sum + Number(p.price), 0);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: FolderTree,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Lookbook Images',
      value: lookbookImages.length,
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Catalog Value',
      value: `$${(totalValue / 100).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
  ];

  const quickActions = [
    { label: 'Add Product', page: 'admin-products' as Page, icon: Package },
    { label: 'Manage Lookbook', page: 'admin-lookbook' as Page, icon: Image },
    { label: 'View Categories', page: 'admin-categories' as Page, icon: FolderTree },
    { label: 'Site Settings', page: 'admin-site-settings' as Page, icon: Users },
  ];

  return (
    <AdminLayout currentPage="admin" onNavigate={onNavigate} title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-24 flex-col gap-2 border-gold/30 hover:border-gold hover:bg-gold/5"
                  onClick={() => onNavigate(action.page)}
                >
                  <action.icon className="h-6 w-6 text-gold" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Backend Connection</span>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Product Catalog</span>
                <Badge variant="default" className="bg-green-600">
                  {products.length} items
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lookbook Gallery</span>
                <Badge variant="default" className="bg-green-600">
                  {lookbookImages.length} images
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Catalog Summary */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold">Catalog Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.length > 0 ? (
                categories.map((category) => {
                  const categoryProducts = products.filter((p) => p.category === category);
                  return (
                    <div key={category} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm font-medium">{category}</span>
                      <Badge variant="outline" className="border-gold/30 text-gold">
                        {categoryProducts.length} products
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No categories yet. Add your first product to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
