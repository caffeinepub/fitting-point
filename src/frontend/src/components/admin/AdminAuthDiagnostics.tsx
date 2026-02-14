import { useState } from 'react';
import { Copy, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { parseAdminAuthError } from '../../utils/adminAuthError';

interface AdminAuthDiagnosticsProps {
  error: unknown;
}

export default function AdminAuthDiagnostics({ error }: AdminAuthDiagnosticsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const parsedError = parseAdminAuthError(error);
  const technicalDetails = error instanceof Error ? error.message : String(error);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(technicalDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-3">
      <Alert variant="destructive">
        <AlertDescription className="space-y-2">
          <p className="font-medium">{parsedError.message}</p>
          {parsedError.nextSteps && (
            <p className="text-sm">{parsedError.nextSteps}</p>
          )}
        </AlertDescription>
      </Alert>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
          >
            <span className="text-sm">Technical Details</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="rounded-md bg-muted p-3 space-y-2">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words text-muted-foreground">
              {technicalDetails}
            </pre>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="mr-2 h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Details
                </>
              )}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
