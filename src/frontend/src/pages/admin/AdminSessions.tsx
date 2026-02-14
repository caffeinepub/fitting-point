import { Users, ShoppingCart, Heart, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminSessionsProps {
  onNavigate: (page: Page) => void;
}

export default function AdminSessions({ onNavigate }: AdminSessionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-gold mb-2">User Sessions & Insights</h2>
        <p className="text-muted-foreground">Overview of user activity and session management</p>
      </div>

      {/* Privacy Notice */}
      <Alert className="border-gold/20 bg-gold/5">
        <Info className="h-4 w-4 text-gold" />
        <AlertDescription className="text-gold">
          <strong>Privacy First:</strong> This application uses guest sessions stored locally in the browser.
          No personal data is collected or stored on the server. All cart and wishlist data remains on the user's device.
        </AlertDescription>
      </Alert>

      {/* Session Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Session Type</p>
                <p className="text-2xl font-bold text-gold">Guest</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cart Storage</p>
                <p className="text-2xl font-bold text-gold">Local</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Wishlist Storage</p>
                <p className="text-2xl font-bold text-gold">Local</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Details */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-gold">Session Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Guest Sessions</h4>
            <p className="text-sm text-muted-foreground">
              All users browse as guests. Shopping cart and wishlist data are stored locally in the browser using localStorage.
              This ensures privacy and eliminates the need for user accounts.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Data Persistence</h4>
            <p className="text-sm text-muted-foreground">
              Cart and wishlist data persist across browser sessions until the user clears their browser data or manually
              clears their cart/wishlist.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Privacy & Security</h4>
            <p className="text-sm text-muted-foreground">
              No personal information is collected. No tracking cookies are used. All shopping data remains on the user's device.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-gold">Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Cart Storage</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Key: fitting_point_guest_cart</li>
                <li>• Format: JSON with versioning</li>
                <li>• Capacity: Browser localStorage limit</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Wishlist Storage</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Key: fitting_point_guest_wishlist</li>
                <li>• Format: JSON with versioning</li>
                <li>• Capacity: Browser localStorage limit</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
