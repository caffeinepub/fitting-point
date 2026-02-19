import { useState } from 'react';
import { Shield, Copy, Check, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRegisterAdmin } from '../../hooks/useQueries';
import { parseAdminAuthError } from '../../utils/adminAuthError';
import AdminAuthDiagnostics from './AdminAuthDiagnostics';

interface AdminSignupPanelProps {
  onRegistrationSuccess?: () => void;
}

export default function AdminSignupPanel({ onRegistrationSuccess }: AdminSignupPanelProps) {
  const registerAdminMutation = useRegisterAdmin();
  const [registeredPrincipal, setRegisteredPrincipal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRegister = async () => {
    try {
      const principalId = await registerAdminMutation.mutateAsync();
      setRegisteredPrincipal(principalId);
      toast.success('Admin registration successful!', {
        description: 'You are now registered as an admin. Transitioning to dashboard...',
        duration: 3000,
      });
      
      // Notify parent component of successful registration
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error('Registration failed', {
        description: parsed.message,
      });
    }
  };

  const handleCopyPrincipal = () => {
    if (registeredPrincipal) {
      navigator.clipboard.writeText(registeredPrincipal);
      setCopied(true);
      toast.success('Principal ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Success state - show registered principal
  if (registeredPrincipal) {
    return (
      <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
        <CardHeader>
          <CardTitle className="text-green-600 dark:text-green-400 font-serif flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Registration Complete
          </CardTitle>
          <CardDescription>
            Your admin account has been successfully created
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-500/30 bg-green-500/5">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription>
              You are now registered as an administrator. Redirecting to the admin dashboard...
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="principal-id" className="text-sm font-medium">
              Your Admin Principal ID
            </Label>
            <div className="flex gap-2">
              <Input
                id="principal-id"
                value={registeredPrincipal}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                onClick={handleCopyPrincipal}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Save this Principal ID for your records. You can use it to verify your admin identity.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Registration form state
  return (
    <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
      <CardHeader>
        <CardTitle className="text-gold font-serif flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Register as Administrator
        </CardTitle>
        <CardDescription>
          Click below to register your Internet Identity as the site admin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {registerAdminMutation.isError && (
          <AdminAuthDiagnostics error={registerAdminMutation.error} />
        )}

        {!registerAdminMutation.isError && (
          <Alert className="border-gold/30 bg-gold/5">
            <AlertCircle className="h-4 w-4 text-gold" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> This action can only be performed once. After registration, 
              the admin signup window will close permanently.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleRegister}
          disabled={registerAdminMutation.isPending}
          className="w-full bg-gold hover:bg-gold/90 text-white"
          size="lg"
        >
          {registerAdminMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Register as Admin
            </>
          )}
        </Button>

        {registerAdminMutation.isError && (
          <Button
            onClick={() => registerAdminMutation.reset()}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
