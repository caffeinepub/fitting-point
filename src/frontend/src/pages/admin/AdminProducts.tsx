import { useState, useMemo } from 'react';
import { Plus, Edit, Search, ArrowUpDown, Image as ImageIcon } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import MultiImageUploader from '../../components/admin/MultiImageUploader';
import DraggableImageList from '../../components/admin/DraggableImageList';
import {
  useGetAllProducts,
  useAddProduct,
  useUpdateProduct,
  useGetAllCategories,
} from '../../hooks/useQueries';
import type { Product, ProductType } from '../../backend';
import { ExternalBlob, UsageCategory } from '../../backend';
import { parseAdminAuthError } from '../../utils/adminAuthError';
import { formatINR } from '../../utils/currency';
import { getProductThumbnail } from '../../utils/productImageFallback';
import { SELECT_ALL_SENTINEL, fromSelectValue, toSelectValue, sanitizeSelectOptions } from '../../utils/selectSentinels';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminProductsProps {
  onNavigate: (page: Page) => void;
}

type SortField = 'name' | 'price' | 'category';
type SortOrder = 'asc' | 'desc';

export default function AdminProducts({ onNavigate }: AdminProductsProps) {
  const { data: products = [], isLoading } = useGetAllProducts();
  const { data: categories = [] } = useGetAllCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

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
    productType: '' as '' | 'clothing' | 'accessory' | 'footwear' | 'electronics' | 'other',
    productTypeOther: '',
    usageCategory: '' as '' | 'hajj' | 'umrah' | 'both',
    isBestseller: false,
    isMostLoved: false,
    isNewProduct: false,
  });
  const [productImages, setProductImages] = useState<ExternalBlob[]>([]);
  const [uploading, setUploading] = useState(false);

  const allCategoryNames = useMemo(() => {
    const managedCategories = categories.map((c) => c.name);
    const productCategories = [...new Set(products.map((p) => p.category))];
    const combined = [...new Set([...managedCategories, ...productCategories])];
    return sanitizeSelectOptions(combined).sort();
  }, [categories, products]);

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

    if (productImages.length === 0 && !editingProduct) {
      toast.error('Please add at least one image');
      return;
    }

    if (!formData.name.trim() || !formData.shortDescriptor.trim() || !formData.price || !formData.category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);

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
        images: productImages,
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
    setProductImages(product.images);
    setDialogOpen(true);
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
    setProductImages([]);
    setEditingProduct(null);
  };

  const imageItems = productImages.map((img, idx) => ({
    id: `img-${idx}`,
    image: img,
    order: idx,
  }));

  const handleImageReorder = (reorderedItems: typeof imageItems) => {
    const reorderedImages = reorderedItems.map((item) => item.image);
    setProductImages(reorderedImages);
  };

  return (
    <AdminLayout currentPage="admin-products" onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Images Section */}
                <div className="space-y-4">
                  <Label>Product Images *</Label>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload Images</TabsTrigger>
                      <TabsTrigger value="reorder">Reorder Images</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-4">
                      <MultiImageUploader
                        images={productImages}
                        onImagesChange={setProductImages}
                        maxImages={10}
                      />
                    </TabsContent>
                    <TabsContent value="reorder" className="space-y-4">
                      <DraggableImageList
                        images={imageItems}
                        onChange={handleImageReorder}
                        showNumberedControls={true}
                        onRemove={(id) => {
                          const index = imageItems.findIndex((item) => item.id === id);
                          if (index !== -1) {
                            const newImages = productImages.filter((_, i) => i !== index);
                            setProductImages(newImages);
                          }
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortDescriptor">Short Descriptor *</Label>
                    <Input
                      id="shortDescriptor"
                      value={formData.shortDescriptor}
                      onChange={(e) => setFormData({ ...formData, shortDescriptor: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category || SELECT_ALL_SENTINEL}
                      onValueChange={(val) => setFormData({ ...formData, category: fromSelectValue(val) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SELECT_ALL_SENTINEL}>Select category</SelectItem>
                        {allCategoryNames.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <Select
                      value={formData.productType || SELECT_ALL_SENTINEL}
                      onValueChange={(val) => {
                        const actualValue = fromSelectValue(val);
                        setFormData({ 
                          ...formData, 
                          productType: actualValue as '' | 'clothing' | 'accessory' | 'footwear' | 'electronics' | 'other'
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SELECT_ALL_SENTINEL}>Select type</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                        <SelectItem value="footwear">Footwear</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.productType === 'other' && (
                    <div className="space-y-2">
                      <Label htmlFor="productTypeOther">Specify Type</Label>
                      <Input
                        id="productTypeOther"
                        value={formData.productTypeOther}
                        onChange={(e) => setFormData({ ...formData, productTypeOther: e.target.value })}
                        placeholder="Enter product type"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="usageCategory">Usage Category</Label>
                    <Select
                      value={formData.usageCategory || SELECT_ALL_SENTINEL}
                      onValueChange={(val) => {
                        const actualValue = fromSelectValue(val);
                        setFormData({ 
                          ...formData, 
                          usageCategory: actualValue as '' | 'hajj' | 'umrah' | 'both'
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select usage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SELECT_ALL_SENTINEL}>Select usage</SelectItem>
                        <SelectItem value="hajj">Hajj</SelectItem>
                        <SelectItem value="umrah">Umrah</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                      placeholder="Red, Blue, Green"
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
                          setFormData({ ...formData, isBestseller: checked as boolean })
                        }
                      />
                      <Label htmlFor="isBestseller" className="font-normal cursor-pointer">
                        Bestseller
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isMostLoved"
                        checked={formData.isMostLoved}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isMostLoved: checked as boolean })
                        }
                      />
                      <Label htmlFor="isMostLoved" className="font-normal cursor-pointer">
                        Most Loved
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isNewProduct"
                        checked={formData.isNewProduct}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isNewProduct: checked as boolean })
                        }
                      />
                      <Label htmlFor="isNewProduct" className="font-normal cursor-pointer">
                        New Product
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                    disabled={uploading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading || addProduct.isPending || updateProduct.isPending}
                    className="flex-1"
                  >
                    {uploading || addProduct.isPending || updateProduct.isPending
                      ? 'Saving...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Add Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter || SELECT_ALL_SENTINEL} onValueChange={(val) => setCategoryFilter(fromSelectValue(val))}>
                <SelectTrigger className="w-full md:w-[200px]">
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
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredAndSortedProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading products...</p>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => toggleSort('name')} className="h-8 px-2">
                          Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => toggleSort('category')} className="h-8 px-2">
                          Category
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => toggleSort('price')} className="h-8 px-2">
                          Price
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={getProductThumbnail(product)}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{formatINR(Number(product.price) / 100)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {product.isBestseller && <Badge variant="secondary">Bestseller</Badge>}
                            {product.isMostLoved && <Badge variant="secondary">Most Loved</Badge>}
                            {product.isNewProduct && <Badge variant="secondary">New</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
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
    </AdminLayout>
  );
}
