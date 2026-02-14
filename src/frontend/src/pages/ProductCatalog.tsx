import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import type { CatalogFilter } from '../App';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'shipping' | 'returns';

interface ProductCatalogProps {
  onNavigate: (page: Page, productId?: string, filter?: CatalogFilter) => void;
  initialFilter?: CatalogFilter;
}

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export default function ProductCatalog({ onNavigate, initialFilter }: ProductCatalogProps) {
  const { data: allProducts = [], isLoading } = useGetAllProducts();
  const [filters, setFilters] = useState<CatalogFilter>(initialFilter || {});
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [allProducts]);

  const productTypes = useMemo(() => {
    const types = new Set<string>();
    allProducts.forEach((p) => {
      if (p.productType) {
        if (p.productType.__kind__ === 'other') {
          types.add(p.productType.other);
        } else {
          types.add(p.productType.__kind__);
        }
      }
    });
    return Array.from(types).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.productType) {
        const productTypeStr = product.productType?.__kind__ === 'other' 
          ? product.productType.other 
          : product.productType?.__kind__;
        if (productTypeStr !== filters.productType) return false;
      }
      if (filters.usageCategory && product.usageCategory !== filters.usageCategory) return false;
      if (filters.isNew && !product.isNewProduct) return false;
      if (filters.isBestseller && !product.isBestseller) return false;
      if (filters.isMostLoved && !product.isMostLoved) return false;
      return true;
    });
  }, [allProducts, filters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc':
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const handleFilterChange = (key: keyof CatalogFilter, value: string | boolean | undefined) => {
    setFilters((prev) => {
      if (value === undefined || value === '') {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.keys(filters).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gold">Category</Label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={filters.category === cat}
                onCheckedChange={(checked) =>
                  handleFilterChange('category', checked ? cat : undefined)
                }
              />
              <label
                htmlFor={`cat-${cat}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Product Type Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gold">Product Type</Label>
        <div className="space-y-2">
          {productTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.productType === type}
                onCheckedChange={(checked) =>
                  handleFilterChange('productType', checked ? type : undefined)
                }
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Usage Category Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gold">Usage</Label>
        <div className="space-y-2">
          {['hajj', 'umrah', 'both'].map((usage) => (
            <div key={usage} className="flex items-center space-x-2">
              <Checkbox
                id={`usage-${usage}`}
                checked={filters.usageCategory === usage}
                onCheckedChange={(checked) =>
                  handleFilterChange('usageCategory', checked ? usage : undefined)
                }
              />
              <label
                htmlFor={`usage-${usage}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
              >
                {usage}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Special Filters */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gold">Special</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-bestseller"
              checked={filters.isBestseller || false}
              onCheckedChange={(checked) =>
                handleFilterChange('isBestseller', checked ? true : undefined)
              }
            />
            <label
              htmlFor="filter-bestseller"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Best Sellers
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-mostloved"
              checked={filters.isMostLoved || false}
              onCheckedChange={(checked) =>
                handleFilterChange('isMostLoved', checked ? true : undefined)
              }
            />
            <label
              htmlFor="filter-mostloved"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Most Loved
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-new"
              checked={filters.isNew || false}
              onCheckedChange={(checked) =>
                handleFilterChange('isNew', checked ? true : undefined)
              }
            />
            <label
              htmlFor="filter-new"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              New Arrivals
            </label>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <>
          <Separator className="bg-gold/20" />
          <Button
            variant="outline"
            className="w-full border-gold text-gold hover:bg-gold hover:text-white"
            onClick={clearFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gold mb-2">
            Product Catalog
          </h1>
          <p className="text-muted-foreground font-body">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6 p-6 border border-gold/10 rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-gold">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-gold text-white px-2 py-1 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <Separator className="bg-gold/20" />
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter & Sort Bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-gold text-gold">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-2 bg-gold text-white px-2 py-0.5 rounded-full text-xs">
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

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[200px] border-gold/30">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">No products found</p>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-white"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
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
