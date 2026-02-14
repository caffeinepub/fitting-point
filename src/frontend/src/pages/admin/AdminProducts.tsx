import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, ArrowUpDown, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import {
  useGetAllProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks/useQueries';
import type { Product, ProductType } from '../../backend';
import { ExternalBlob, UsageCategory } from '../../backend';
import { parseAdminAuthError } from '../../utils/adminAuthError';
import { formatINR } from '../../utils/currency';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    shortDescriptor: '',
    description: '',
    price: '',
    category: '',
    sizes: '',
    colors: '',
    productType: '' as '' | 'clothing' | 'accessory' | 'footwear' | 'electronics' | 'other',
    productTypeOther: '',
    usageCategory: '' as '' | 'hajj' | 'umrah' | 'both',
    isBestseller: false,
    isMostLoved: false,
    isNewProduct: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
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
        id: editingProduct?.id || `product-${Date.now()}`,
        name: formData.name.trim(),
        shortDescriptor: formData.shortDescriptor.trim(),
        description: formData.description.trim(),
        price: BigInt(Math.round(parseFloat(formData.price) * 100)),
        category: formData.category.trim(),
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images: imageBlobs,
        productType,
        usageCategory,
        isBestseller: formData.isBestseller,
        isMostLoved: formData.isMostLoved,
        isNewProduct: formData.isNewProduct,
      };

      if (editingProduct) {
        await updateProduct.mutateAsync({ productId: editingProduct.id, product: productData });
        toast.success('Product updated successfully');
      } else {
        await addProduct.mutateAsync(productData);
        toast.success('Product added successfully');
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    let productTypeValue: '' | 'clothing' | 'accessory' | 'footwear' | 'electronics' | 'other' = '';
    let productTypeOther = '';
    if (product.productType) {
      if (product.productType.__kind__ === 'other') {
        productTypeValue = 'other';
        productTypeOther = product.productType.other;
      } else {
        productTypeValue = product.productType.__kind__ as 'clothing' | 'accessory' | 'footwear' | 'electronics';
      }
    }

    let usageCategoryValue: '' | 'hajj' | 'umrah' | 'both' = '';
    if (product.usageCategory) {
      usageCategoryValue = product.usageCategory as 'hajj' | 'umrah' | 'both';
    }

    setFormData({
      name: product.name,
      shortDescriptor: product.shortDescriptor,
      description: product.description,
      price: (Number(product.price) / 100).toFixed(2),
      category: product.category,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      productType: productTypeValue,
      productTypeOther,
      usageCategory: usageCategoryValue,
      isBestseller: product.isBestseller,
      isMostLoved: product.isMostLoved,
      isNewProduct: product.isNewProduct,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete);
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
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
      productType: '',
      productTypeOther: '',
      usageCategory: '',
      isBestseller: false,
      isMostLoved: false,
      isNewProduct: false,
    });
    setImageFiles([]);
    setEditingProduct(null);
  };

  const getThumbnailUrl = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0].getDirectURL();
    }
    return '/assets/generated/handbag-luxury.dim_800x800.jpg';
  };

  return (
    <AdminLayout currentPage="admin-products" onNavigate={onNavigate} title="Product Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product catalog
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (INR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescriptor">Short Description *</Label>
                  <Input
                    id="shortDescriptor"
                    value={formData.shortDescriptor}
                    onChange={(e) => setFormData({ ...formData, shortDescriptor: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <Select
                      value={formData.productType}
                      onValueChange={(value) => setFormData({ ...formData, productType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Label htmlFor="productTypeOther">Specify Product Type</Label>
                    <Input
                      id="productTypeOther"
                      value={formData.productTypeOther}
                      onChange={(e) => setFormData({ ...formData, productTypeOther: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="usageCategory">Usage Category</Label>
                  <Select
                    value={formData.usageCategory}
                    onValueChange={(value) => setFormData({ ...formData, usageCategory: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select usage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hajj">Hajj</SelectItem>
                      <SelectItem value="umrah">Umrah</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                    <Input
                      id="sizes"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="S, M, L, XL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colors">Colors (comma-separated)</Label>
                    <Input
                      id="colors"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="White, Black, Beige"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Product Flags</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isBestseller"
                        checked={formData.isBestseller}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isBestseller: checked === true })
                        }
                      />
                      <label
                        htmlFor="isBestseller"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Best Seller
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isMostLoved"
                        checked={formData.isMostLoved}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isMostLoved: checked === true })
                        }
                      />
                      <label
                        htmlFor="isMostLoved"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Most Loved
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isNewProduct"
                        checked={formData.isNewProduct}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isNewProduct: checked === true })
                        }
                      />
                      <label
                        htmlFor="isNewProduct"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        New Arrival
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Product Images {!editingProduct && '*'}</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles(files);
                    }}
                  />
                  {imageFiles.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {imageFiles.length} file(s) selected
                    </p>
                  )}
                  {editingProduct && imageFiles.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Current: {editingProduct.images.length} image(s) - Upload new files to replace
                    </p>
                  )}
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryFilter">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="categoryFilter">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sort By</Label>
                <div className="flex gap-2">
                  <Button
                    variant={sortField === 'name' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleSort('name')}
                    className="flex-1"
                  >
                    Name
                    {sortField === 'name' && (
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant={sortField === 'price' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleSort('price')}
                    className="flex-1"
                  >
                    Price
                    {sortField === 'price' && (
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant={sortField === 'category' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleSort('category')}
                    className="flex-1"
                  >
                    Category
                    {sortField === 'category' && (
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Products ({filteredAndSortedProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading products...
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm || categoryFilter ? 'No products match your filters' : 'No products yet. Add your first product to get started.'}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={getThumbnailUrl(product)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {product.shortDescriptor}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatINR(Number(product.price) / 100)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.isBestseller && (
                              <Badge variant="secondary" className="text-xs">
                                Best Seller
                              </Badge>
                            )}
                            {product.isMostLoved && (
                              <Badge variant="secondary" className="text-xs">
                                Most Loved
                              </Badge>
                            )}
                            {product.isNewProduct && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
