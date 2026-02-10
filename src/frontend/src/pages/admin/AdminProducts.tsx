import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import {
  useGetAllProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks/useQueries';
import type { Product } from '../../backend';
import { ExternalBlob } from '../../backend';

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
    description: '',
    price: '',
    category: '',
    sizes: '',
    colors: '',
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

    if (!formData.name.trim() || !formData.price || !formData.category.trim()) {
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

      const productData: Product = {
        id: editingProduct?.id || '',
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: BigInt(Math.round(parseFloat(formData.price) * 100)),
        category: formData.category.trim(),
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images: imageBlobs,
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
      description: '',
      price: '',
      category: '',
      sizes: '',
      colors: '',
    });
    setImageFiles([]);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: (Number(product.price) / 100).toFixed(2),
      category: product.category,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
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
                    placeholder="Premium Leather Jacket"
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
                      placeholder="Jackets"
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
                      placeholder="Black, Brown, Navy"
                      required
                    />
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
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
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
