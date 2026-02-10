import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import type { Product } from '../backend';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface ProductCatalogProps {
  onNavigate: (page: Page, productId?: string) => void;
  initialCategory?: string | null;
}

export default function ProductCatalog({ onNavigate, initialCategory }: ProductCatalogProps) {
  const { data: allProducts = [], isLoading } = useGetAllProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));
  const sizes = Array.from(new Set(allProducts.flatMap((p) => p.sizes)));
  const colors = Array.from(new Set(allProducts.flatMap((p) => p.colors)));

  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, selectedCategories, selectedSizes, selectedColors, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-serif text-lg text-gold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`cat-${category}`} className="cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-serif text-lg text-gold mb-3">Size</h3>
        <div className="space-y-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={() => toggleSize(size)}
              />
              <Label htmlFor={`size-${size}`} className="cursor-pointer">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-serif text-lg text-gold mb-3">Color</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <Label htmlFor={`color-${color}`} className="cursor-pointer">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full border-gold text-gold" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl text-gold mb-4">Shop Collection</h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <h2 className="font-serif text-2xl text-gold">Filters</h2>
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter & Sort */}
          <div className="flex items-center justify-between mb-6 lg:justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden border-gold text-gold">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-gold text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {selectedCategories.length + selectedSizes.length + selectedColors.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-serif text-gold">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-gold/30">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="mt-4 border-gold text-gold"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
