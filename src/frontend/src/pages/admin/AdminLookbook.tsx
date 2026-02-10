import { useState, useMemo } from 'react';
import { Plus, Trash2, Search, Edit, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import { useGetAllLookbookImages, useAddLookbookImage, useGetAllProducts } from '../../hooks/useQueries';
import type { LookbookImage } from '../../backend';
import { ExternalBlob } from '../../backend';
import { Checkbox } from '@/components/ui/checkbox';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface AdminLookbookProps {
  onNavigate: (page: Page) => void;
}

type SortField = 'id' | 'taggedCount';
type SortOrder = 'asc' | 'desc';

export default function AdminLookbook({ onNavigate }: AdminLookbookProps) {
  const { data: lookbookImages = [], isLoading } = useGetAllLookbookImages();
  const { data: products = [] } = useGetAllProducts();
  const addLookbookImage = useAddLookbookImage();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<LookbookImage | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    description: '',
    taggedProducts: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const filteredAndSortedImages = useMemo(() => {
    let filtered = lookbookImages.filter(
      (img) =>
        img.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortField === 'taggedCount') {
        comparison = a.taggedProducts.length - b.taggedProducts.length;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [lookbookImages, searchTerm, sortField, sortOrder]);

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

    if (!imageFile && !editingImage) {
      toast.error('Please select an image');
      return;
    }

    if (!formData.id.trim()) {
      toast.error('Please enter an ID');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      let imageBlob: ExternalBlob;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (editingImage) {
        imageBlob = editingImage.image;
      } else {
        throw new Error('No image available');
      }

      const newImage: LookbookImage = {
        id: formData.id.trim(),
        description: formData.description.trim(),
        image: imageBlob,
        taggedProducts: formData.taggedProducts,
      };

      await addLookbookImage.mutateAsync(newImage);

      toast.success(editingImage ? 'Lookbook image updated' : 'Lookbook image added');
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save lookbook image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({ id: '', description: '', taggedProducts: [] });
    setImageFile(null);
    setEditingImage(null);
  };

  const handleEdit = (image: LookbookImage) => {
    setEditingImage(image);
    setFormData({
      id: image.id,
      description: image.description,
      taggedProducts: image.taggedProducts,
    });
    setDialogOpen(true);
  };

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      taggedProducts: prev.taggedProducts.includes(productId)
        ? prev.taggedProducts.filter((id) => id !== productId)
        : [...prev.taggedProducts, productId],
    }));
  };

  return (
    <AdminLayout currentPage="admin-lookbook" onNavigate={onNavigate} title="Lookbook Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-3xl text-gold">Lookbook Gallery</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold/90 text-primary" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Lookbook Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-gold">
                  {editingImage ? 'Edit Lookbook Image' : 'Add New Lookbook Image'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="lookbook-001"
                    required
                    disabled={!!editingImage}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this lookbook image..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image {!editingImage && '*'}</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    required={!editingImage}
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
                  {editingImage && !imageFile && (
                    <img
                      src={editingImage.image.getDirectURL()}
                      alt="Current"
                      className="mt-2 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tagged Products</Label>
                  <div className="border border-gold/20 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                    {products.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No products available</p>
                    ) : (
                      products.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`product-${product.id}`}
                            checked={formData.taggedProducts.includes(product.id)}
                            onCheckedChange={() => handleProductToggle(product.id)}
                          />
                          <label
                            htmlFor={`product-${product.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {product.name} - ${product.price.toString()}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
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
                    {uploading ? 'Uploading...' : editingImage ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Sort */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lookbook images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('id')}
                  className={sortField === 'id' ? 'border-gold text-gold' : ''}
                >
                  ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('taggedCount')}
                  className={sortField === 'taggedCount' ? 'border-gold text-gold' : ''}
                >
                  Tagged Products
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lookbook Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold">
              Images ({filteredAndSortedImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground mt-4">Loading lookbook...</p>
              </div>
            ) : filteredAndSortedImages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? 'No images match your search.' : 'No lookbook images yet. Add your first one!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden border-gold/20 hover:border-gold transition-all group">
                    <div className="relative aspect-[4/5]">
                      <img
                        src={image.image.getDirectURL()}
                        alt={image.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm font-medium">{image.id}</p>
                        {image.description && (
                          <p className="text-xs mt-1 line-clamp-2">{image.description}</p>
                        )}
                        <p className="text-xs mt-2">
                          {image.taggedProducts.length} product{image.taggedProducts.length !== 1 ? 's' : ''} tagged
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{image.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {image.taggedProducts.length} tagged
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(image)}
                          className="text-gold hover:text-gold/80"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
