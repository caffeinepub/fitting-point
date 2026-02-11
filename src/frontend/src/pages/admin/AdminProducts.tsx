import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import {
  useGetAllProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks/useQueries';
import type { Product, ProductType } from '../../backend';
import { ExternalBlob, ProductBadge, UsageCategory } from '../../backend';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface AdminProductsProps {
  onNavigate: (page: Page) => void;
}

type SortField = 'name' | 'price' | 'category';
type SortOrder = 'asc' | 'desc';

export default function AdminProducts({ onNavigate }: AdminProductsProps) {
  const { data: products = [], isLoading } = useGetAllProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    shortDescriptor: '',
    description: '',
    price: '',
    category: '',
    sizes: '',
    colors: '',
    badge: '' as '' | 'new' | 'bestseller',
    isNewProduct: false,
    isBestseller: false,
    productType: '' as '' | 'clothing' | 'accessory' | 'footwear' | 'electronics' | 'other',
    productTypeOther: '',
    usageCategory: '' as '' | 'hajj' | 'umrah' | 'both',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        comparison = Number(a.price) - Number(b.price);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFiles.length === 0 && !editingProduct) {
      toast.error('Please select at least one image');
      return;
    }

    if (!formData.name.trim() || !formData.shortDescriptor.trim() || !formData.price || !formData.category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      let imageBlobs: ExternalBlob[] = [];

      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
            setUploadProgress(Math.round(((i + percentage / 100) / imageFiles.length) * 100));
          });
          imageBlobs.push(blob);
        }
      } else if (editingProduct) {
        imageBlobs = editingProduct.images;
      }

      // Build ProductType
      let productType: ProductType | undefined = undefined;
      if (formData.productType) {
        if (formData.productType === 'clothing') {
          productType = { __kind__: 'clothing', clothing: null };
        } else if (formData.productType === 'accessory') {
          productType = { __kind__: 'accessory', accessory: null };
        } else if (formData.productType === 'footwear') {
          productType = { __kind__: 'footwear', footwear: null };
        } else if (formData.productType === 'electronics') {
          productType = { __kind__: 'electronics', electronics: null };
        } else if (formData.productType === 'other' && formData.productTypeOther) {
          productType = { __kind__: 'other', other: formData.productTypeOther };
        }
      }

      // Build UsageCategory (enum)
      let usageCategory: UsageCategory | undefined = undefined;
      if (formData.usageCategory) {
        if (formData.usageCategory === 'hajj') {
          usageCategory = UsageCategory.hajj;
        } else if (formData.usageCategory === 'umrah') {
          usageCategory = UsageCategory.umrah;
        } else if (formData.usageCategory === 'both') {
          usageCategory = UsageCategory.both;
        }
      }

      const productData: Product = {
        id: editingProduct?.id || '',
        name: formData.name.trim(),
        shortDescriptor: formData.shortDescriptor.trim(),
        description: formData.description.trim(),
        price: BigInt(Math.round(parseFloat(formData.price) * 100)),
        category: formData.category.trim(),
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images: imageBlobs,
        badge: formData.badge ? (formData.badge === 'new' ? ProductBadge.new_ : ProductBadge.bestseller) : undefined,
        isNewProduct: formData.isNewProduct,
        isBestseller: formData.isBestseller,
        productType,
        usageCategory,
      };

      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct.mutateAsync(productData);
        toast.success('Product added successfully');
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      shortDescriptor: '',
      description: '',
      price: '',
      category: '',
      sizes: '',
      colors: '',
      badge: '',
      isNewProduct: false,
      isBestseller: false,
      productType: '',
      productTypeOther: '',
      usageCategory: '',
    });
    setImageFiles([]);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    let badgeValue: '' | 'new' | 'bestseller' = '';
    if (product.badge === ProductBadge.new_) badgeValue = 'new';
    else if (product.badge === ProductBadge.bestseller) badgeValue = 'bestseller';
    
    let productTypeValue: '' | 'clothing' | 'accessory' | 'footwear' | 'electronics' | 'other' = '';
    let productTypeOther = '';
    if (product.productType) {
      if (product.productType.__kind__ === 'clothing') productTypeValue = 'clothing';
      else if (product.productType.__kind__ === 'accessory') productTypeValue = 'accessory';
      else if (product.productType.__kind__ === 'footwear') productTypeValue = 'footwear';
      else if (product.productType.__kind__ === 'electronics') productTypeValue = 'electronics';
      else if (product.productType.__kind__ === 'other') {
        productTypeValue = 'other';
        productTypeOther = product.productType.other;
      }
    }

    let usageCategoryValue: '' | 'hajj' | 'umrah' | 'both' = '';
    if (product.usageCategory) {
      if (product.usageCategory === UsageCategory.hajj) usageCategoryValue = 'hajj';
      else if (product.usageCategory === UsageCategory.umrah) usageCategoryValue = 'umrah';
      else if (product.usageCategory === UsageCategory.both) usageCategoryValue = 'both';
    }
    
    setFormData({
      name: product.name,
      shortDescriptor: product.shortDescriptor,
      description: product.description,
      price: (Number(product.price) / 100).toFixed(2),
      category: product.category,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      badge: badgeValue,
      isNewProduct: product.isNewProduct,
      isBestseller: product.isBestseller,
      productType: productTypeValue,
      productTypeOther,
      usageCategory: usageCategoryValue,
    });
    setDialogOpen(true);
  };

  return (
    <AdminLayout currentPage="admin-products" onNavigate={onNavigate} title="Product Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-3xl text-gold">Product Catalog</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold/90 text-primary" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-gold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Premium Ihram Set"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescriptor">Short Descriptor *</Label>
                  <Input
                    id="shortDescriptor"
                    value={formData.shortDescriptor}
                    onChange={(e) => setFormData({ ...formData, shortDescriptor: e.target.value })}
                    placeholder="Hajj & Umrah Essential"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the product..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="99.99"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ihram"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sizes">Sizes (comma-separated) *</Label>
                    <Input
                      id="sizes"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="S, M, L, XL"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colors">Colors (comma-separated) *</Label>
                    <Input
                      id="colors"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="White, Black, Beige"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge</Label>
                    <Select value={formData.badge} onValueChange={(value) => setFormData({ ...formData, badge: value as '' | 'new' | 'bestseller' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select badge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="bestseller">Bestseller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value as '' | 'clothing' | 'accessory' | 'footwear' | 'electronics' | 'other' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                        <SelectItem value="footwear">Footwear</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.productType === 'other' && (
                  <div className="space-y-2">
                    <Label htmlFor="productTypeOther">Other Product Type</Label>
                    <Input
                      id="productTypeOther"
                      value={formData.productTypeOther}
                      onChange={(e) => setFormData({ ...formData, productTypeOther: e.target.value })}
                      placeholder="Specify product type"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="usageCategory">Usage Category</Label>
                  <Select value={formData.usageCategory} onValueChange={(value) => setFormData({ ...formData, usageCategory: value as '' | 'hajj' | 'umrah' | 'both' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select usage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="hajj">Hajj</SelectItem>
                      <SelectItem value="umrah">Umrah</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNewProduct"
                      checked={formData.isNewProduct}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNewProduct: checked as boolean })}
                    />
                    <Label htmlFor="isNewProduct" className="cursor-pointer">New Product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isBestseller"
                      checked={formData.isBestseller}
                      onCheckedChange={(checked) => setFormData({ ...formData, isBestseller: checked as boolean })}
                    />
                    <Label htmlFor="isBestseller" className="cursor-pointer">Bestseller</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Images {!editingProduct && '*'}</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                    required={!editingProduct}
                  />
                  {uploading && (
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gold h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Uploading: {uploadProgress}%</p>
                    </div>
                  )}
                  {editingProduct && imageFiles.length === 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {editingProduct.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.getDirectURL()}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gold hover:bg-gold/90 text-primary" disabled={uploading}>
                    {uploading ? 'Uploading...' : editingProduct ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={categoryFilter === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('')}
                  className={categoryFilter === '' ? 'bg-gold hover:bg-gold/90 text-primary' : ''}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                    className={categoryFilter === category ? 'bg-gold hover:bg-gold/90 text-primary' : ''}
                  >
                    {category}
                  </Button>
                ))}
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
                  onClick={() => toggleSort('price')}
                  className={sortField === 'price' ? 'border-gold text-gold' : ''}
                >
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('category')}
                  className={sortField === 'category' ? 'border-gold text-gold' : ''}
                >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold">
              Products ({filteredAndSortedProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground mt-4">Loading products...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm || categoryFilter ? 'No products match your filters.' : 'No products yet. Add your first one!'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 border border-gold/20 rounded-lg hover:border-gold transition-colors"
                  >
                    <img
                      src={product.images[0]?.getDirectURL()}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-gold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.shortDescriptor}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-gold font-semibold">${(Number(product.price) / 100).toFixed(2)}</span>
                        <span className="text-muted-foreground">{product.category}</span>
                        <span className="text-muted-foreground">{product.sizes.length} sizes</span>
                        <span className="text-muted-foreground">{product.colors.length} colors</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="text-gold hover:text-gold/80"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive hover:text-destructive/80"
                        disabled={deleteProduct.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
