import { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import MediaSlotUploader from '../MediaSlotUploader';
import { useGetBanners, useAddBanner, useUpdateBanner, useDeleteBanner } from '../../hooks/useHomepageBanners';
import { encodeBannerText, decodeBannerText } from '../../utils/bannerEncoding';
import { encodeBannerDestination, decodeBannerDestination, type BannerDestination } from '../../utils/bannerDestination';
import type { Banner, ExternalBlob } from '../../backend';

export default function HomepageBannersManager() {
  const { data: banners = [], isLoading } = useGetBanners();
  const addBannerMutation = useAddBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    image: undefined as ExternalBlob | undefined,
    title: '',
    subtitle: '',
    destinationType: 'none' as BannerDestination['type'],
    category: '',
    productId: '',
    externalUrl: '',
  });

  const resetForm = () => {
    setFormData({
      image: undefined,
      title: '',
      subtitle: '',
      destinationType: 'none',
      category: '',
      productId: '',
      externalUrl: '',
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const loadBannerToForm = (banner: Banner) => {
    const textData = decodeBannerText(banner.text);
    const destination = decodeBannerDestination(banner.link);

    setFormData({
      image: banner.image,
      title: textData.title,
      subtitle: textData.subtitle || '',
      destinationType: destination.type,
      category: destination.category || '',
      productId: destination.productId || '',
      externalUrl: destination.url || '',
    });
    setEditingId(banner.id);
  };

  const handleSave = async () => {
    if (!formData.image) {
      toast.error('Please upload a banner image');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a banner title');
      return;
    }

    try {
      const text = encodeBannerText({
        title: formData.title,
        subtitle: formData.subtitle || undefined,
      });

      const destination: BannerDestination = {
        type: formData.destinationType,
        category: formData.category || undefined,
        productId: formData.productId || undefined,
        url: formData.externalUrl || undefined,
      };

      const link = encodeBannerDestination(destination);

      if (editingId) {
        await updateBannerMutation.mutateAsync({
          id: editingId,
          image: formData.image,
          text,
          link: link || undefined,
        });
        toast.success('Banner updated successfully');
      } else {
        await addBannerMutation.mutateAsync({
          image: formData.image,
          text,
          link: link || undefined,
        });
        toast.success('Banner added successfully');
      }

      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await deleteBannerMutation.mutateAsync(id);
      toast.success('Banner deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete banner');
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-serif">Homepage Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-8 w-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gold font-serif">Homepage Banners</CardTitle>
          {!isAdding && !editingId && (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gold hover:bg-gold/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Banner List */}
        {!isAdding && !editingId && (
          <div className="space-y-4">
            {banners.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No banners yet. Add your first banner to get started.
              </div>
            ) : (
              banners.map((banner) => {
                const textData = decodeBannerText(banner.text);
                return (
                  <Card key={banner.id} className="border-gold/10">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={banner.image.getDirectURL()}
                          alt={textData.title}
                          className="w-32 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-serif text-lg text-gold">{textData.title}</h4>
                          {textData.subtitle && (
                            <p className="text-sm text-muted-foreground">{textData.subtitle}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gold text-gold hover:bg-gold/10"
                            onClick={() => loadBannerToForm(banner)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="space-y-6 border border-gold/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-gold">
                {editingId ? 'Edit Banner' : 'Add New Banner'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Separator className="bg-gold/20" />

            <div className="space-y-4">
              <div>
                <Label>Banner Image *</Label>
                <MediaSlotUploader
                  currentImage={formData.image}
                  onImageChange={(image) => setFormData({ ...formData, image })}
                  label="Upload Banner Image"
                />
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter banner title"
                  className="border-gold/20"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Enter banner subtitle"
                  className="border-gold/20"
                />
              </div>

              <div>
                <Label htmlFor="destination">Click Destination</Label>
                <Select
                  value={formData.destinationType}
                  onValueChange={(value: BannerDestination['type']) =>
                    setFormData({ ...formData, destinationType: value })
                  }
                >
                  <SelectTrigger className="border-gold/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Link</SelectItem>
                    <SelectItem value="catalog">Shop / Category</SelectItem>
                    <SelectItem value="product">Specific Product</SelectItem>
                    <SelectItem value="external">External URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.destinationType === 'catalog' && (
                <div>
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Men Ihram, Abaya"
                    className="border-gold/20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to show all products
                  </p>
                </div>
              )}

              {formData.destinationType === 'product' && (
                <div>
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    placeholder="Enter product ID"
                    className="border-gold/20"
                  />
                </div>
              )}

              {formData.destinationType === 'external' && (
                <div>
                  <Label htmlFor="externalUrl">External URL</Label>
                  <Input
                    id="externalUrl"
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="border-gold/20"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={addBannerMutation.isPending || updateBannerMutation.isPending}
                className="bg-gold hover:bg-gold/90 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {addBannerMutation.isPending || updateBannerMutation.isPending
                  ? 'Saving...'
                  : 'Save Banner'}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="border-gold/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
