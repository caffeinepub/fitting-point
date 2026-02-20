import { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
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
                placeholder="e.g., Fitting Point Logo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoLink">Logo Link (optional)</Label>
              <Input
                id="logoLink"
                value={logoLink}
                onChange={(e) => setLogoLink(e.target.value)}
                placeholder="e.g., / or /home"
              />
              <p className="text-xs text-muted-foreground">
                Where should the logo link to? Leave empty to link to homepage.
              </p>
            </div>

            <Button
              onClick={handleSaveLogo}
              disabled={updateLogo.isPending}
              className="w-full"
            >
              {updateLogo.isPending ? 'Saving...' : 'Save Logo'}
            </Button>
          </CardContent>
        </Card>

        {/* Homepage Banners */}
        <HomepageBannersManager />

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode as the default theme
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={darkModeEnabled}
                onCheckedChange={setDarkModeEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Hero Text */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Edit the main hero text displayed on your homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={heroText}
              onChange={setHeroText}
              placeholder="Enter hero text..."
            />
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
            <CardDescription>
              Edit contact information displayed on your site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={contactDetails}
              onChange={setContactDetails}
              placeholder="Enter contact details..."
            />
          </CardContent>
        </Card>

        {/* Company Name */}
        <Card>
          <CardHeader>
            <CardTitle>Company Name</CardTitle>
            <CardDescription>
              Your company or brand name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </CardContent>
        </Card>

        {/* Save Content Button */}
        <Button
          onClick={handleSaveContent}
          disabled={updateSiteContent.isPending}
          size="lg"
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateSiteContent.isPending ? 'Saving...' : 'Save Site Content'}
        </Button>

        {/* Admin Signup Control */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Signup Window</CardTitle>
            <CardDescription>
              Control whether new users can register as admins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Current Status</Label>
                <p className="text-sm text-muted-foreground">
                  {signupEnabled ? 'Open - New users can register as admins' : 'Closed - Only existing admins can access'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                signupEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {signupEnabled ? 'Open' : 'Closed'}
              </div>
            </div>

            {signupEnabled && (
              <>
                <Alert>
                  <AlertDescription>
                    The admin signup window is currently open. Any authenticated user can register as an admin.
                    Once you close it, only existing admins will have access.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleCloseSignup}
                  disabled={closeSignupWindow.isPending}
                  variant="destructive"
                  className="w-full"
                >
                  {closeSignupWindow.isPending ? 'Closing...' : 'Close Admin Signup Window Permanently'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
