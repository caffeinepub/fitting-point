import { useState, useMemo } from 'react';
import { FolderTree, Search, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AdminLayout from '../../components/AdminLayout';
import { useGetAllProducts } from '../../hooks/useQueries';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface AdminCategoriesProps {
  onNavigate: (page: Page) => void;
}

type SortField = 'name' | 'count';
type SortOrder = 'asc' | 'desc';

export default function AdminCategories({ onNavigate }: AdminCategoriesProps) {
  const { data: products = [], isLoading } = useGetAllProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const categoryStats = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = { count: 0, products: [] };
      }
      acc[category].count++;
      acc[category].products.push(product);
      return acc;
    }, {} as Record<string, { count: number; products: any[] }>);
  }, [products]);

  const filteredAndSortedCategories = useMemo(() => {
    let categories = Object.entries(categoryStats)
      .map(([name, data]) => ({
        name,
        count: data.count,
        products: data.products,
      }))
      .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));

    categories.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'count') {
        comparison = a.count - b.count;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return categories;
  }, [categoryStats, searchTerm, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <AdminLayout currentPage="admin-categories" onNavigate={onNavigate} title="Category Management">
      <div className="space-y-6">
        {/* Search and Sort */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('name')}
                  className={sortField === 'name' ? 'border-gold text-gold' : ''}
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('count')}
                  className={sortField === 'count' ? 'border-gold text-gold' : ''}
                >
                  Product Count
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold flex items-center gap-2">
              <FolderTree className="h-6 w-6" />
              Product Categories ({filteredAndSortedCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground mt-4">Loading categories...</p>
              </div>
            ) : filteredAndSortedCategories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? 'No categories match your search.' : 'No categories found. Add products to create categories.'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedCategories.map((category) => (
                  <div
                    key={category.name}
                    className="p-6 border border-gold/20 rounded-lg hover:border-gold transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-xl text-gold">{category.name}</h3>
                      <Badge variant="secondary" className="bg-gold/10 text-gold">
                        {category.count} {category.count === 1 ? 'product' : 'products'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {category.products.slice(0, 4).map((product) => (
                        <div key={product.id} className="space-y-2">
                          <img
                            src={product.images[0]?.getDirectURL()}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-md border border-gold/20"
                          />
                          <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gold">${product.price.toString()}</p>
                        </div>
                      ))}
                    </div>
                    {category.count > 4 && (
                      <p className="text-sm text-muted-foreground mt-4">
                        +{category.count - 4} more {category.count - 4 === 1 ? 'product' : 'products'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Information */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold">Category Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Categories are automatically created based on the products you add. Each product must have a
                category assigned to it.
              </p>
              <p>
                To manage categories, add or edit products in the{' '}
                <button
                  onClick={() => onNavigate('admin-products')}
                  className="text-gold hover:underline font-medium"
                >
                  Products section
                </button>
                .
              </p>
              <div className="p-4 bg-muted/50 rounded-lg mt-4">
                <p className="font-medium text-foreground mb-2">Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Use consistent category names across products (e.g., "Dresses" not "Dress" or "dresses")</li>
                  <li>Categories help customers filter and find products easily</li>
                  <li>Consider creating broad categories that can contain multiple product types</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
