import { useState } from 'react';
import { Activity, AlertCircle, CheckCircle, Download, RefreshCw, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useBackendReadiness } from '@/hooks/useBackendReadiness';
import { useActor } from '@/hooks/useActor';
import { devLogBuffer, type LogEntry } from '@/utils/devLogBuffer';

/**
 * Developer-only diagnostics page showing backend readiness, runtime logs,
 * and system health information for debugging deployment and runtime failures.
 */
export default function Diagnostics() {
  const [logs, setLogs] = useState<LogEntry[]>(devLogBuffer.getLogs());
  const { isReady, isPolling, hasError, error, retry } = useBackendReadiness();
  const { actor, isFetching: actorFetching } = useActor();

  const refreshLogs = () => {
    setLogs(devLogBuffer.getLogs());
  };

  const clearLogs = () => {
    devLogBuffer.clear();
    setLogs([]);
  };

  const handleExportText = () => {
    devLogBuffer.downloadAsText(`diagnostics-${Date.now()}.txt`);
  };

  const handleExportJSON = () => {
    devLogBuffer.downloadAsJSON(`diagnostics-${Date.now()}.json`);
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
      case 'windowError':
      case 'unhandledRejection':
        return 'text-destructive';
      case 'warn':
        return 'text-yellow-600 dark:text-yellow-500';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getLevelBadgeVariant = (level: LogEntry['level']): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (level) {
      case 'error':
      case 'windowError':
      case 'unhandledRejection':
        return 'destructive';
      case 'warn':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">System Diagnostics</h1>
          <p className="text-muted-foreground">
            Developer tools for debugging deployment and runtime issues
          </p>
        </div>

        {/* Backend Connectivity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Backend Connectivity
            </CardTitle>
            <CardDescription>
              Real-time status of backend canister connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Actor Status */}
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                {actor ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <div>
                  <p className="font-semibold text-sm">Actor</p>
                  <p className="text-xs text-muted-foreground">
                    {actorFetching ? 'Initializing...' : actor ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Readiness Status */}
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                {isReady ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : hasError ? (
                  <XCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-semibold text-sm">Backend Ready</p>
                  <p className="text-xs text-muted-foreground">
                    {isPolling ? 'Checking...' : isReady ? 'Ready' : hasError ? 'Error' : 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                {isReady && actor ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-semibold text-sm">Connection</p>
                  <p className="text-xs text-muted-foreground">
                    {isReady && actor ? 'Connected' : 'Connecting...'}
                  </p>
                </div>
              </div>
            </div>

            {hasError && error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="font-semibold text-sm text-destructive mb-2">Connection Error</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
                <Button onClick={retry} variant="outline" size="sm" className="mt-3">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
              </div>
            )}

            {isReady && actor && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ Backend canister is ready and responding to queries
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Runtime Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Runtime Logs
                  <Badge variant="secondary">{logs.length} entries</Badge>
                </CardTitle>
                <CardDescription>
                  Captured console logs, errors, and unhandled rejections
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={refreshLogs} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={clearLogs} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button onClick={handleExportText} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export as Text
              </Button>
              <Button onClick={handleExportJSON} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
            </div>

            <ScrollArea className="h-[500px] w-full border rounded-lg">
              <div className="p-4 space-y-2">
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No logs captured yet
                  </p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-start gap-2">
                        <Badge variant={getLevelBadgeVariant(log.level)} className="text-xs shrink-0">
                          {log.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <p className={`text-sm font-mono ${getLevelColor(log.level)} break-all`}>
                          {log.message}
                        </p>
                      </div>
                      {log.stack && (
                        <details className="ml-6">
                          <summary className="text-xs text-muted-foreground cursor-pointer">
                            Stack trace
                          </summary>
                          <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                            {log.stack}
                          </pre>
                        </details>
                      )}
                      {index < logs.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Browser and environment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">User Agent</p>
                <p className="text-muted-foreground font-mono text-xs break-all">
                  {navigator.userAgent}
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Current URL</p>
                <p className="text-muted-foreground font-mono text-xs break-all">
                  {window.location.href}
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Viewport</p>
                <p className="text-muted-foreground">
                  {window.innerWidth} × {window.innerHeight}
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Timestamp</p>
                <p className="text-muted-foreground">
                  {new Date().toISOString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
