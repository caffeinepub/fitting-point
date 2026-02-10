import { Users, ShoppingCart, Heart, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '../../components/AdminLayout';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings';

interface AdminSessionsProps {
  onNavigate: (page: Page) => void;
}

export default function AdminSessions({ onNavigate }: AdminSessionsProps) {
  return (
    <AdminLayout currentPage="admin-sessions" onNavigate={onNavigate} title="User Sessions & Insights">
      <div className="space-y-6">
        <h2 className="font-serif text-3xl text-gold">User Session Insights</h2>

        {/* Privacy Notice */}
        <Card className="border-gold/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold flex items-center gap-2">
              <Info className="h-6 w-6" />
              Privacy & Data Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              This section provides insights into user sessions and activity on your e-commerce platform. All data is
              stored securely on the Internet Computer blockchain and is only accessible to authorized administrators.
            </p>
            <div className="p-4 bg-background rounded-lg border border-gold/20">
              <p className="font-medium text-foreground mb-2">What We Track:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>User cart contents (products, quantities, sizes, colors)</li>
                <li>User wishlist items (product IDs)</li>
                <li>User profiles (names for authenticated users)</li>
                <li>Session activity (authenticated vs. guest users)</li>
              </ul>
            </div>
            <div className="p-4 bg-background rounded-lg border border-gold/20">
              <p className="font-medium text-foreground mb-2">Privacy Commitment:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>No personal data is shared with third parties</li>
                <li>All data is encrypted and stored on-chain</li>
                <li>Users can clear their data by logging out</li>
                <li>Guest sessions are stored locally on user devices</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Session Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
              <Users className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Real-time tracking coming soon</p>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Carts</CardTitle>
              <ShoppingCart className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Cart analytics coming soon</p>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wishlist Items</CardTitle>
              <Heart className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Wishlist analytics coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Session Management Info */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold">Session Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              User sessions are managed automatically by the Internet Computer's authentication system. Each
              authenticated user has a unique principal ID that is used to store their cart and wishlist data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-gold/20">
                <p className="font-medium text-foreground mb-2">Authenticated Users:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Persistent cart and wishlist across devices</li>
                  <li>Secure authentication via Internet Identity</li>
                  <li>Profile information stored on-chain</li>
                  <li>Session data persists until logout</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-gold/20">
                <p className="font-medium text-foreground mb-2">Guest Users:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Cart and wishlist stored in browser localStorage</li>
                  <li>Data persists across page reloads</li>
                  <li>Can merge data after login</li>
                  <li>No server-side storage for guests</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Features */}
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-gold">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-gold mt-2" />
                <div>
                  <p className="font-medium text-foreground">Real-time Session Analytics</p>
                  <p className="text-xs">Track active users, cart abandonment rates, and conversion metrics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-gold mt-2" />
                <div>
                  <p className="font-medium text-foreground">User Behavior Insights</p>
                  <p className="text-xs">Understand browsing patterns, popular products, and user preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-gold mt-2" />
                <div>
                  <p className="font-medium text-foreground">Cart Recovery Tools</p>
                  <p className="text-xs">Automated reminders and incentives for abandoned carts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
