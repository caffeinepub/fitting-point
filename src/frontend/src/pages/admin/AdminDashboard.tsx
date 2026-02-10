import { Package, Image, FolderTree, Users, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminLayout from '../../components/AdminLayout';
import { useGetAllProducts, useGetAllLookbookImages } from '../../hooks/useQueries';
import { useMemo } from 'react';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
  const { data: lookbookImages = [], isLoading: lookbookLoading } = useGetAllLookbookImages();

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, product) => sum + Number(product.price), 0);
  }, [products]);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      page: 'admin-products' as Page,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Active products in catalog',
    },
    {
      title: 'Lookbook Images',
      value: lookbookImages.length,
      icon: Image,
      page: 'admin-lookbook' as Page,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Styled photo shoots',
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: FolderTree,
      page: 'admin-categories' as Page,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Product categories',
    },
    {
      title: 'Inventory Value',
      value: `$${totalInventoryValue.toLocaleString()}`,
      icon: TrendingUp,
      page: 'admin-products' as Page,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      description: 'Total catalog value',
    },
  ];

  const isLoading = productsLoading || lookbookLoading;

  return (
    <AdminLayout currentPage="admin" onNavigate={onNavigate} title="Overview & Statistics">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="cursor-pointer hover:shadow-lg transition-all border-gold/20 hover:border-gold hover:scale-105"
                onClick={() => onNavigate(stat.page)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-gold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => onNavigate('admin-products')}
              className="bg-gold hover:bg-gold/90 text-primary h-auto py-6 flex flex-col items-center gap-2"
            >
              <Package className="h-8 w-8" />
              <span className="font-serif text-lg">Manage Products</span>
            </Button>
            <Button
              onClick={() => onNavigate('admin-lookbook')}
              className="bg-gold hover:bg-gold/90 text-primary h-auto py-6 flex flex-col items-center gap-2"
            >
              <Image className="h-8 w-8" />
              <span className="font-serif text-lg">Manage Lookbook</span>
            </Button>
            <Button
              onClick={() => onNavigate('admin-categories')}
              className="bg-gold hover:bg-gold/90 text-primary h-auto py-6 flex flex-col items-center gap-2"
            >
              <FolderTree className="h-8 w-8" />
              <span className="font-serif text-lg">View Categories</span>
            </Button>
            <Button
              onClick={() => onNavigate('admin-sessions')}
              className="bg-gold hover:bg-gold/90 text-primary h-auto py-6 flex flex-col items-center gap-2"
            >
              <Users className="h-8 w-8" />
              <span className="font-serif text-lg">User Sessions</span>
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold flex items-center gap-2">
              <Activity className="h-6 w-6" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-gold/20">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Product Catalog</span>
                </div>
                <span className="text-sm text-green-600 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-gold/20">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Lookbook Gallery</span>
                </div>
                <span className="text-sm text-green-600 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-gold/20">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">User Sessions</span>
                </div>
                <span className="text-sm text-green-600 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-gold/20">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Backend Canister</span>
                </div>
                <span className="text-sm text-green-600 font-semibold">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        {!isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-gold">Catalog Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Most Popular Category</p>
                  <p className="text-xl font-serif text-gold">
                    {categories.length > 0
                      ? categories.reduce((a, b) =>
                          products.filter((p) => p.category === a).length >
                          products.filter((p) => p.category === b).length
                            ? a
                            : b
                        )
                      : 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Average Product Price</p>
                  <p className="text-xl font-serif text-gold">
                    ${products.length > 0 ? Math.round(totalInventoryValue / products.length) : 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Lookbook Coverage</p>
                  <p className="text-xl font-serif text-gold">
                    {lookbookImages.reduce((sum, img) => sum + img.taggedProducts.length, 0)} products tagged
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
