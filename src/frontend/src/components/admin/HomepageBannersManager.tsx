import { useState } from 'react';
import { Plus, Trash2, MoveUp, MoveDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MediaSlotUploader from '../MediaSlotUploader';
import { useGetAllBanners, useAddBanner, useRemoveBanner, useUpdateBannerOrder } from '../../hooks/useQueries';
import type { BannerImage } from '../../backend';
import { ExternalBlob } from '../../backend';
import { parseAdminAuthError } from '../../utils/adminAuthError';

export default function HomepageBannersManager() {
  const { data: banners = [], isLoading } = useGetAllBanners();
  const addBanner = useAddBanner();
  const removeBanner = useRemoveBanner();
  const updateBannerOrder = useUpdateBannerOrder();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [bannerImage, setBannerImage] = useState<ExternalBlob | undefined>(undefined);

  const sortedBanners = [...banners].sort((a, b) => Number(a.order) - Number(b.order));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerImage && !editingBanner) {
      toast.error('Please upload a banner image');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a banner title');
      return;
    }

    try {
      const bannerId = editingBanner?.id || `banner-${Date.now()}`;
      const order = editingBanner?.order || BigInt(banners.length);
      const image = bannerImage || editingBanner!.image;

      await addBanner.mutateAsync({
        id: bannerId,
        image,
        title: formData.title.trim(),
        description: formData.description.trim(),
        link: formData.link.trim() || null,
        order,
      });

      toast.success(editingBanner ? 'Banner updated successfully' : 'Banner added successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  const handleEdit = (banner: BannerImage) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      link: banner.link || '',
    });
    setBannerImage(banner.image);
    setDialogOpen(true);
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await removeBanner.mutateAsync(bannerId);
      toast.success('Banner deleted successfully');
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newOrder = sortedBanners.map((banner, i) => {
      if (i === index) return [banner.id, BigInt(index - 1)] as [string, bigint];
      if (i === index - 1) return [banner.id, BigInt(index)] as [string, bigint];
      return [banner.id, banner.order] as [string, bigint];
    });

    try {
      await updateBannerOrder.mutateAsync(newOrder);
      toast.success('Banner order updated');
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === sortedBanners.length - 1) return;

    const newOrder = sortedBanners.map((banner, i) => {
      if (i === index) return [banner.id, BigInt(index + 1)] as [string, bigint];
      if (i === index + 1) return [banner.id, BigInt(index)] as [string, bigint];
      return [banner.id, banner.order] as [string, bigint];
    });

    try {
      await updateBannerOrder.mutateAsync(newOrder);
      toast.success('Banner order updated');
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
    });
    setBannerImage(undefined);
    setEditingBanner(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Homepage Banners</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Banner Image *</Label>
                  <MediaSlotUploader
                    currentImage={bannerImage}
                    onImageChange={setBannerImage}
                    label="Upload Banner"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Banner title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Subtitle</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Banner subtitle or description"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link (optional)</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="e.g., /catalog or https://example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty for no link, or enter a path like /catalog
                  </p>
                </div>

                <DialogFooter>
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
                  <Button type="submit" disabled={addBanner.isPending}>
                    {addBanner.isPending ? 'Saving...' : editingBanner ? 'Update Banner' : 'Add Banner'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading banners...</div>
        ) : sortedBanners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No banners configured. Add your first banner to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBanners.map((banner, index) => (
              <Card key={banner.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  <img
                    src={banner.image.getDirectURL()}
                    alt={banner.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{banner.title}</h4>
                    {banner.description && (
                      <p className="text-sm text-muted-foreground truncate">{banner.description}</p>
                    )}
                    {banner.link && (
                      <p className="text-xs text-muted-foreground mt-1">Link: {banner.link}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sortedBanners.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
