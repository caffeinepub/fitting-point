import { useState, useEffect } from 'react';
import { Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import RichTextEditor from '../../components/RichTextEditor';
import HomepageBannersManager from '../../components/admin/HomepageBannersManager';
import { useSiteContent, usePublishSiteContent, useToggleDarkMode } from '../../hooks/useSiteContent';
import { useSaveDraft } from '../../hooks/useQueries';
import { getSiteContentDefaults } from '../../utils/siteContentDefaults';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface AdminSiteSettingsProps {
  onNavigate: (page: Page) => void;
}

export default function AdminSiteSettings({ onNavigate }: AdminSiteSettingsProps) {
  const { data: siteContent, isLoading } = useSiteContent();
  const publishMutation = usePublishSiteContent();
  const toggleDarkModeMutation = useToggleDarkMode();
  const saveDraftMutation = useSaveDraft();

  const defaults = getSiteContentDefaults();

  const [heroText, setHeroText] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (siteContent) {
      setHeroText(siteContent.heroText?.content || defaults.heroText.content);
      setContactDetails(siteContent.contactDetails?.content || defaults.contactDetails.content);
      setDarkModeEnabled(siteContent.darkModeEnabled);
    }
  }, [siteContent, defaults]);

  const handleSaveDraft = async (content: string, isHeroText: boolean) => {
    try {
      await saveDraftMutation.mutateAsync({ content, isHeroText });
      toast.success(`${isHeroText ? 'Hero text' : 'Contact details'} draft saved`);
    } catch (error: any) {
      toast.error(`Failed to save draft: ${error.message}`);
    }
  };

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync();
      toast.success('Site content published successfully');
    } catch (error: any) {
      toast.error(`Failed to publish: ${error.message}`);
    }
  };

  const handleToggleDarkMode = async (enabled: boolean) => {
    try {
      setDarkModeEnabled(enabled);
      await toggleDarkModeMutation.mutateAsync(enabled);
      toast.success(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      toast.error(`Failed to toggle dark mode: ${error.message}`);
      setDarkModeEnabled(!enabled);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="admin-site-settings" onNavigate={onNavigate} title="Site Settings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading site settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="admin-site-settings" onNavigate={onNavigate} title="Site Settings">
      <div className="space-y-6 max-w-4xl">
        {/* Homepage Banners */}
        <HomepageBannersManager />

        <Separator className="bg-gold/20" />

        {/* Theme Settings */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold font-serif">Theme Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode as the default theme for all users
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkModeEnabled}
                onCheckedChange={handleToggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Notice */}
        <Card className="border-gold/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-gold font-serif">Brand Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <img
                src="/assets/ChatGPT Image Dec 11, 2025, 10_50_00 PM-3.png"
                alt="Fitting Point Logo"
                className="h-20 w-20 object-contain rounded-full border-2 border-gold/30"
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  The official Fitting Point logo is locked and displayed across the site. 
                  This ensures consistent branding throughout the storefront and admin panel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-gold/20" />

        {/* Hero Text */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold font-serif">Homepage Hero Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              value={heroText}
              onChange={setHeroText}
              placeholder="Enter hero text..."
              className="border-gold/20"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleSaveDraft(heroText, true)}
                disabled={saveDraftMutation.isPending}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveDraftMutation.isPending ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold font-serif">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              value={contactDetails}
              onChange={setContactDetails}
              placeholder="Enter contact details..."
              className="border-gold/20"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleSaveDraft(contactDetails, false)}
                disabled={saveDraftMutation.isPending}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveDraftMutation.isPending ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-gold/20" />

        {/* Publish */}
        <Card className="border-gold/20 bg-gold/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-gold mb-1">Publish Changes</h3>
                <p className="text-sm text-muted-foreground">
                  Make all saved drafts live on the storefront
                </p>
              </div>
              <Button
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                className="bg-gold hover:bg-gold/90 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                {publishMutation.isPending ? 'Publishing...' : 'Publish Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
