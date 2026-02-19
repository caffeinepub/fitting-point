import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import RichTextEditor from '../../components/RichTextEditor';
import MediaSlotUploader from '../../components/MediaSlotUploader';
import HomepageBannersManager from '../../components/admin/HomepageBannersManager';
import { useGetSiteContent, useUpdateSiteContent } from '../../hooks/useSiteContent';
import { useGetLogo, useUpdateLogo } from '../../hooks/useQueries';
import { useCloseAdminSignupWindow, useIsAdminSignupEnabled } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { parseAdminAuthError } from '../../utils/adminAuthError';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminSiteSettingsProps {
  onNavigate: (page: Page) => void;
}

export default function AdminSiteSettings({ onNavigate }: AdminSiteSettingsProps) {
  const { data: siteContent, isLoading: contentLoading } = useGetSiteContent();
  const { data: logo, isLoading: logoLoading } = useGetLogo();
  const { data: signupEnabled, isLoading: signupLoading } = useIsAdminSignupEnabled();
  const updateSiteContent = useUpdateSiteContent();
  const updateLogo = useUpdateLogo();
  const closeSignupWindow = useCloseAdminSignupWindow();

  const [heroText, setHeroText] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [logoImage, setLogoImage] = useState<ExternalBlob | undefined>(undefined);
  const [logoAltText, setLogoAltText] = useState('');
  const [logoLink, setLogoLink] = useState('');

  useEffect(() => {
    if (siteContent) {
      setHeroText(siteContent.heroText);
      setContactDetails(siteContent.contactDetails);
      setDarkModeEnabled(siteContent.darkModeEnabled);
      setCompanyName(siteContent.companyName);
    }
  }, [siteContent]);

  useEffect(() => {
    if (logo) {
      setLogoImage(logo.image);
      setLogoAltText(logo.altText);
      setLogoLink(logo.link || '');
    }
  }, [logo]);

  const handleSaveContent = async () => {
    try {
      await updateSiteContent.mutateAsync({
        heroText,
        contactDetails,
        darkModeEnabled,
        companyName,
      });
      toast.success('Site content updated successfully');
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  const handleSaveLogo = async () => {
    if (!logoImage) {
      toast.error('Please upload a logo image');
      return;
    }

    if (!logoAltText.trim()) {
      toast.error('Please enter alt text for the logo');
      return;
    }

    try {
      await updateLogo.mutateAsync({
        image: logoImage,
        altText: logoAltText.trim(),
        link: logoLink.trim() || null,
      });
      toast.success('Logo updated successfully');
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  const handleCloseSignup = async () => {
    if (!confirm('Are you sure you want to permanently close the admin signup window? This action cannot be undone.')) {
      return;
    }

    try {
      await closeSignupWindow.mutateAsync();
      toast.success('Admin signup window closed permanently');
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  if (contentLoading || logoLoading || signupLoading) {
    return (
      <AdminLayout currentPage="admin-site-settings" onNavigate={onNavigate} title="Site Settings">
        <div className="text-center py-8 text-muted-foreground">Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="admin-site-settings" onNavigate={onNavigate} title="Site Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your site appearance and content
          </p>
        </div>

        {/* Logo Management */}
        <Card>
          <CardHeader>
            <CardTitle>Site Logo</CardTitle>
            <CardDescription>
              Upload and manage your site logo. This will appear in the header and footer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo Image</Label>
              <MediaSlotUploader
                currentImage={logoImage}
                onImageChange={setLogoImage}
                label="Upload Logo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoAltText">Alt Text *</Label>
              <Input
                id="logoAltText"
                value={logoAltText}
                onChange={(e) => setLogoAltText(e.target.value)}
                placeholder="Company logo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoLink">Link (optional)</Label>
              <Input
                id="logoLink"
                value={logoLink}
                onChange={(e) => setLogoLink(e.target.value)}
                placeholder="/"
              />
              <p className="text-xs text-muted-foreground">
                Where should the logo link to? Leave empty for homepage.
              </p>
            </div>

            <Button onClick={handleSaveLogo} disabled={updateLogo.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateLogo.isPending ? 'Saving...' : 'Save Logo'}
            </Button>
          </CardContent>
        </Card>

        {/* Homepage Banners */}
        <HomepageBannersManager />

        {/* Site Content */}
        <Card>
          <CardHeader>
            <CardTitle>Site Content</CardTitle>
            <CardDescription>
              Manage your site's text content and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Name"
              />
            </div>

            <div className="space-y-2">
              <Label>Hero Text</Label>
              <RichTextEditor value={heroText} onChange={setHeroText} />
            </div>

            <div className="space-y-2">
              <Label>Contact Details</Label>
              <RichTextEditor value={contactDetails} onChange={setContactDetails} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode by default for all users
                </p>
              </div>
              <Switch checked={darkModeEnabled} onCheckedChange={setDarkModeEnabled} />
            </div>

            <Button onClick={handleSaveContent} disabled={updateSiteContent.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateSiteContent.isPending ? 'Saving...' : 'Save Content'}
            </Button>
          </CardContent>
        </Card>

        {/* Admin Signup Control */}
        {signupEnabled && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Admin Signup Window</CardTitle>
              <CardDescription>
                The admin signup window is currently open. Close it to prevent new admin registrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Once closed, this action cannot be undone. Only existing admins will be able to access the admin panel.
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                onClick={handleCloseSignup}
                disabled={closeSignupWindow.isPending}
                className="mt-4"
              >
                {closeSignupWindow.isPending ? 'Closing...' : 'Close Admin Signup Window'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
