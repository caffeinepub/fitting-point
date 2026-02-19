import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminSignupPanel from './AdminSignupPanel';

interface AdminSetupScreenProps {
  onRegistrationSuccess?: () => void;
}

export default function AdminSetupScreen({ onRegistrationSuccess }: AdminSetupScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Welcome Card */}
        <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-gold/10 p-4">
                <Shield className="h-12 w-12 text-gold" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-serif text-foreground">
                Admin Setup
              </CardTitle>
              <CardDescription className="text-base">
                Complete your one-time admin registration to access the dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-gold/30 bg-gold/5">
              <CheckCircle2 className="h-4 w-4 text-gold" />
              <AlertDescription>
                <strong>You're logged in!</strong> Complete the registration below to gain full admin access.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What happens next:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span>Your Internet Identity will be registered as the site administrator</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span>You'll gain immediate access to manage products, lookbook, and site settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  <span>The admin signup window will close automatically after registration</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Registration Panel */}
        <AdminSignupPanel onRegistrationSuccess={onRegistrationSuccess} />

        {/* Help Card */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">Need help?</p>
                <p>
                  If you're not the intended administrator, please log out and contact the site owner. 
                  Admin registration is a one-time setup that cannot be undone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
