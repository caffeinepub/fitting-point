import { useState, useMemo } from 'react';
import { useGetAllProducts, useGetAllCategories } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SELECT_ALL_SENTINEL, fromSelectValue, toSelectValue, sanitizeSelectOptions } from '../utils/selectSentinels';
import type { CatalogFilter } from '../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface ProductCatalogProps {
  onNavigate: (page: Page, productId?: string) => void;
  initialFilter?: CatalogFilter;
}

export default function ProductCatalog({ onNavigate, initialFilter }: ProductCatalogProps) {
  const { data: products = [], isLoading } = useGetAllProducts();
  const { data: categories = [] } = useGetAllCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter?.category || '');
  const [selectedUsageCategory, setSelectedUsageCategory] = useState<string>(initialFilter?.usageCategory || '');
  const [showBestsellers, setShowBestsellers] = useState(initialFilter?.isBestseller || false);
  const [showMostLoved, setShowMostLoved] = useState(initialFilter?.isMostLoved || false);
  const [showNew, setShowNew] = useState(initialFilter?.isNew || false);
  const [sortBy, setSortBy] = useState<string>('name');

  // Combine managed categories with product-derived categories for backward compatibility
  // Filter out empty/whitespace category names to prevent SelectItem errors
  const allCategoryNames = useMemo(() => {
    const managedCategories = categories.map((c) => c.name);
    const productCategories = [...new Set(products.map((p) => p.category))];
    const combined = [...new Set([...managedCategories, ...productCategories])];
    return sanitizeSelectOptions(combined).sort();
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (selectedUsageCategory && product.usageCategory !== selectedUsageCategory) return false;
      if (showBestsellers && !product.isBestseller) return false;
      if (showMostLoved && !product.isMostLoved) return false;
      if (showNew && !product.isNewProduct) return false;
      return true;
    });

    // Sort
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, selectedCategory, selectedUsageCategory, showBestsellers, showMostLoved, showNew, sortBy]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-gold mb-2">Product Catalog</h1>
          <p className="font-body text-lg text-muted-foreground">
            Browse our complete collection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={toSelectValue(selectedCategory)} 
                    onValueChange={(val) => setSelectedCategory(fromSelectValue(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SELECT_ALL_SENTINEL}>All Categories</SelectItem>
                      {allCategoryNames.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Usage Category Filter */}
                <div className="space-y-2">
                  <Label>Usage</Label>
                  <Select 
                    value={toSelectValue(selectedUsageCategory)} 
                    onValueChange={(val) => setSelectedUsageCategory(fromSelectValue(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SELECT_ALL_SENTINEL}>All</SelectItem>
                      <SelectItem value="hajj">Hajj</SelectItem>
                      <SelectItem value="umrah">Umrah</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Filters */}
                <div className="space-y-3">
                  <Label>Special Collections</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bestsellers"
                      checked={showBestsellers}
                      onCheckedChange={(checked) => setShowBestsellers(checked as boolean)}
                    />
                    <Label htmlFor="bestsellers" className="font-normal cursor-pointer">
                      Best Sellers
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mostLoved"
                      checked={showMostLoved}
                      onCheckedChange={(checked) => setShowMostLoved(checked as boolean)}
                    />
                    <Label htmlFor="mostLoved" className="font-normal cursor-pointer">
                      Most Loved
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new"
                      checked={showNew}
                      onCheckedChange={(checked) => setShowNew(checked as boolean)}
                    />
                    <Label htmlFor="new" className="font-normal cursor-pointer">
                      New Arrivals
                    </Label>
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No products found matching your filters
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
