import React, { Component, ReactNode } from 'react';
import { AlertTriangle, Copy, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { devLogBuffer } from '@/utils/devLogBuffer';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Lightweight React error boundary that prevents blank screens
 * and provides developer-friendly error information with export capabilities.
 */
export class RuntimeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleCopyError = () => {
    const { error, errorInfo } = this.state;
    const errorText = `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorText).then(() => {
      alert('Error details copied to clipboard');
    });
  };

  handleExportLogs = () => {
    devLogBuffer.downloadAsText(`error-logs-${Date.now()}.txt`);
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full border-destructive">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle className="text-2xl">Application Error</CardTitle>
                  <CardDescription>
                    The application encountered an unexpected error
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono text-sm text-destructive font-semibold mb-2">
                  {error?.name || 'Error'}
                </p>
                <p className="font-mono text-sm">
                  {error?.message || 'An unknown error occurred'}
                </p>
              </div>

              {error?.stack && (
                <details className="bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-semibold text-sm mb-2">
                    Stack Trace
                  </summary>
                  <pre className="text-xs overflow-auto max-h-48 mt-2">
                    {error.stack}
                  </pre>
                </details>
              )}

              {errorInfo?.componentStack && (
                <details className="bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-semibold text-sm mb-2">
                    Component Stack
                  </summary>
                  <pre className="text-xs overflow-auto max-h-48 mt-2">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex flex-wrap gap-2 pt-4">
                <Button onClick={this.handleReload} variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Application
                </Button>
                <Button onClick={this.handleCopyError} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Error
                </Button>
                <Button onClick={this.handleExportLogs} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>

              <div className="text-sm text-muted-foreground pt-4 border-t">
                <p className="font-semibold mb-1">For Developers:</p>
                <p>
                  Visit <code className="bg-muted px-1 py-0.5 rounded">/__diagnostics</code> for detailed system diagnostics.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
