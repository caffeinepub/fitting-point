import { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import RichTextEditor from '../../components/RichTextEditor';
import { useGetSiteContent, useUpdateSiteContent, useToggleDarkMode } from '../../hooks/useSiteContent';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminSiteSettingsProps {
  onNavigate: (page: Page) => void;
}

export default function AdminSiteSettings({ onNavigate }: AdminSiteSettingsProps) {
  const { data: siteContent, isLoading: siteContentLoading } = useGetSiteContent();
  const updateSiteContentMutation = useUpdateSiteContent();
  const toggleDarkModeMutation = useToggleDarkMode();

  const [heroText, setHeroText] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [hasUnsavedContentChanges, setHasUnsavedContentChanges] = useState(false);

  // Initialize form when site content loads
  useEffect(() => {
    if (siteContent) {
      setHeroText(siteContent.heroText);
      setContactDetails(siteContent.contactDetails);
    }
  }, [siteContent]);

  const handleSaveContent = async () => {
    if (!siteContent) return;
    
    try {
      await updateSiteContentMutation.mutateAsync({
        heroText,
        contactDetails,
        darkModeEnabled: siteContent.darkModeEnabled,
      });
      toast.success('Site content saved successfully!');
      setHasUnsavedContentChanges(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save site content');
    }
  };

  const handleToggleDarkMode = async (enabled: boolean) => {
    try {
      await toggleDarkModeMutation.mutateAsync(enabled);
      toast.success(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle dark mode');
    }
  };

  if (siteContentLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif text-gold">Site Settings</h2>
            <p className="text-muted-foreground mt-2">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-gold">Site Settings</h2>
          <p className="text-muted-foreground mt-2">Manage your site content and appearance</p>
        </div>
      </div>

      {/* Theme Settings */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-serif">Theme Settings</CardTitle>
          <CardDescription>Configure the default theme for your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable dark mode as the default theme
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={siteContent?.darkModeEnabled || false}
              onCheckedChange={handleToggleDarkMode}
              disabled={toggleDarkModeMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo Notice */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-serif">Logo & Branding</CardTitle>
          <CardDescription>Your site logo and brand assets</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Logo is managed through static assets. To update your logo, replace the image file in your assets folder.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Hero Text Editor */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-serif">Homepage Hero Text</CardTitle>
          <CardDescription>Edit the main hero section text on your homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextEditor
            value={heroText}
            onChange={(value) => {
              setHeroText(value);
              setHasUnsavedContentChanges(true);
            }}
            placeholder="Enter your hero text..."
          />
        </CardContent>
      </Card>

      {/* Contact Details Editor */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-serif">Contact Details</CardTitle>
          <CardDescription>Edit the contact information displayed on your contact page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextEditor
            value={contactDetails}
            onChange={(value) => {
              setContactDetails(value);
              setHasUnsavedContentChanges(true);
            }}
            placeholder="Enter your contact details..."
          />
        </CardContent>
      </Card>

      {hasUnsavedContentChanges && (
        <Alert className="border-gold/50 bg-gold/5">
          <AlertCircle className="h-4 w-4 text-gold" />
          <AlertDescription className="text-gold">
            You have unsaved changes to site content.
          </AlertDescription>
        </Alert>
      )}

      <Separator className="bg-gold/20" />

      {/* Save Content Section */}
      <Card className="border-gold/20 bg-gold/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-serif text-xl text-gold">Save Site Content</h3>
              <p className="text-sm text-muted-foreground">
                Save your hero text and contact details changes.
              </p>
            </div>
            <Button
              onClick={handleSaveContent}
              disabled={updateSiteContentMutation.isPending || !hasUnsavedContentChanges}
              className="bg-gold hover:bg-gold/90 text-white"
            >
              {updateSiteContentMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
