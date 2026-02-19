import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, ArrowUpDown, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import MediaSlotUploader from '../../components/MediaSlotUploader';
import { useGetAllLookbookImages, useAddLookbookImage, useGetAllProducts } from '../../hooks/useQueries';
import type { LookbookImage } from '../../backend';
import { ExternalBlob } from '../../backend';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminLookbookProps {
  onNavigate: (page: Page) => void;
}

type SortField = 'description';
type SortOrder = 'asc' | 'desc';

export default function AdminLookbook({ onNavigate }: AdminLookbookProps) {
  const { data: lookbookImages = [], isLoading } = useGetAllLookbookImages();
  const { data: products = [] } = useGetAllProducts();
  const addLookbookImage = useAddLookbookImage();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('description');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<LookbookImage | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    taggedProducts: [] as string[],
  });
  const [lookbookImage, setLookbookImage] = useState<ExternalBlob | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  const filteredAndSortedImages = useMemo(() => {
    let filtered = lookbookImages.filter((image) =>
      image.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const comparison = a.description.localeCompare(b.description);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [lookbookImages, searchTerm, sortOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lookbookImage && !editingImage) {
      toast.error('Please upload an image');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    try {
      setUploading(true);

      const imageBlob = lookbookImage || editingImage!.image;

      const lookbookData: LookbookImage = {
        id: editingImage?.id || `lookbook-${Date.now()}`,
        description: formData.description.trim(),
        image: imageBlob,
        taggedProducts: formData.taggedProducts,
      };

      await addLookbookImage.mutateAsync(lookbookData);
      toast.success(editingImage ? 'Lookbook image updated successfully' : 'Lookbook image added successfully');

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save lookbook image');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      taggedProducts: [],
    });
    setLookbookImage(undefined);
    setEditingImage(null);
  };

  const handleEdit = (image: LookbookImage) => {
    setEditingImage(image);
    setFormData({
      description: image.description,
      taggedProducts: image.taggedProducts,
    });
    setLookbookImage(image.image);
    setDialogOpen(true);
  };

  const toggleProductTag = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      taggedProducts: prev.taggedProducts.includes(productId)
        ? prev.taggedProducts.filter((id) => id !== productId)
        : [...prev.taggedProducts, productId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl text-gold">Lookbook Gallery</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-primary" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
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
                <Label>Lookbook Image *</Label>
                <MediaSlotUploader
                  currentImage={lookbookImage}
                  onImageChange={setLookbookImage}
                  label="Upload Image"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this lookbook image..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tagged Products</Label>
                <div className="max-h-60 overflow-y-auto border border-gold/20 rounded-md p-4 space-y-2">
                  {products.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No products available</p>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`product-${product.id}`}
                          checked={formData.taggedProducts.includes(product.id)}
                          onCheckedChange={() => toggleProductTag(product.id)}
                        />
                        <Label
                          htmlFor={`product-${product.id}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {product.name}
                        </Label>
                      </div>
                    ))
                  )}
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
                  disabled={uploading || addLookbookImage.isPending}
                  className="flex-1 bg-gold hover:bg-gold/90 text-white"
                >
                  {uploading || addLookbookImage.isPending ? 'Saving...' : editingImage ? 'Update Image' : 'Add Image'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Sort */}
      <Card className="border-gold/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lookbook images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Sort
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lookbook Grid */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-serif">
            Images ({filteredAndSortedImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading lookbook...</p>
          ) : filteredAndSortedImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No lookbook images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedImages.map((image) => (
                <Card key={image.id} className="overflow-hidden border-gold/20 hover:border-gold transition-colors">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.image.getDirectURL()}
                      alt={image.description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{image.description}</p>
                    {image.taggedProducts.length > 0 && (
                      <p className="text-xs text-gold">
                        {image.taggedProducts.length} tagged {image.taggedProducts.length === 1 ? 'product' : 'products'}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(image)}
                        className="flex-1 border-gold/30 hover:border-gold"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
  );
}
