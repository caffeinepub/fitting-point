import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import type { Product } from '../backend';
import type { CatalogFilter } from '../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface ProductCatalogProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
  initialFilter?: CatalogFilter;
}

export default function ProductCatalog({ onNavigate, initialFilter = {} }: ProductCatalogProps) {
  const { data: allProducts = [], isLoading } = useGetAllProducts();
  const [filters, setFilters] = useState<CatalogFilter>(initialFilter);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    setFilters(initialFilter);
  }, [initialFilter]);

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));
  const productTypes = ['clothing', 'accessory', 'footwear', 'electronics'];
  const usageCategories = ['hajj', 'umrah', 'both'];

  const filteredProducts = allProducts.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    
    // Compare productType strings
    if (filters.productType) {
      const productTypeStr = product.productType || '';
      if (productTypeStr !== filters.productType) return false;
    }
    
    // Compare usageCategory strings
    if (filters.usageCategory) {
      const usageCategoryStr = product.usageCategory || '';
      if (usageCategoryStr !== filters.usageCategory) return false;
    }
    
    if (filters.isNew && !product.isNewProduct) return false;
    if (filters.isBestseller && !product.isBestseller) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return Number(a.price) - Number(b.price);
      case 'price-desc':
        return Number(b.price) - Number(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const toggleFilter = (key: keyof CatalogFilter, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== null && v !== undefined).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-gold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={filters.category === category}
                onCheckedChange={() => toggleFilter('category', category)}
              />
              <Label htmlFor={`cat-${category}`} className="cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Product Type */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-gold mb-3">Product Type</h3>
        <div className="space-y-2">
          {productTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.productType === type}
                onCheckedChange={() => toggleFilter('productType', type)}
              />
              <Label htmlFor={`type-${type}`} className="cursor-pointer capitalize">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Usage Category */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-gold mb-3">Usage</h3>
        <div className="space-y-2">
          {usageCategories.map((usage) => (
            <div key={usage} className="flex items-center space-x-2">
              <Checkbox
                id={`usage-${usage}`}
                checked={filters.usageCategory === usage}
                onCheckedChange={() => toggleFilter('usageCategory', usage)}
              />
              <Label htmlFor={`usage-${usage}`} className="cursor-pointer capitalize">
                {usage}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Special */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-gold mb-3">Special</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new"
              checked={filters.isNew || false}
              onCheckedChange={() => toggleFilter('isNew', true)}
            />
            <Label htmlFor="new" className="cursor-pointer">
              New Arrivals
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bestseller"
              checked={filters.isBestseller || false}
              onCheckedChange={() => toggleFilter('isBestseller', true)}
            />
            <Label htmlFor="bestseller" className="cursor-pointer">
              Bestsellers
            </Label>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          className="w-full border-gold text-gold hover:bg-gold hover:text-white"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8 xl:px-12 2xl:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gold mb-2">Our Collection</h1>
          <p className="text-muted-foreground font-body">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-gold/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-semibold text-gold">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-gold text-white px-2 py-1 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-gold text-gold">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-2 bg-gold text-white text-xs px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-gold">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-gold/30">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
                <Button
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-white"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
