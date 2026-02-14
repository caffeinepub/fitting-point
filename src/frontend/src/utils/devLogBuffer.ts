/**
 * In-memory client-side log buffer for capturing runtime logs, errors, and unhandled rejections.
 * Provides export/download functionality for debugging deployment and runtime failures.
 */

export interface LogEntry {
  timestamp: number;
  level: 'log' | 'warn' | 'error' | 'info' | 'unhandledRejection' | 'windowError';
  message: string;
  stack?: string;
  data?: any;
}

class DevLogBuffer {
  private buffer: LogEntry[] = [];
  private maxSize = 500;
  private originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
  };

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Intercept console methods
    console.log = (...args: any[]) => {
      this.add('log', args);
      this.originalConsole.log(...args);
    };

    console.warn = (...args: any[]) => {
      this.add('warn', args);
      this.originalConsole.warn(...args);
    };

    console.error = (...args: any[]) => {
      this.add('error', args);
      this.originalConsole.error(...args);
    };

    console.info = (...args: any[]) => {
      this.add('info', args);
      this.originalConsole.info(...args);
    };

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.add('unhandledRejection', [event.reason], event.reason?.stack);
    });

    // Capture window errors
    window.addEventListener('error', (event) => {
      this.add('windowError', [event.message], event.error?.stack);
    });
  }

  private add(level: LogEntry['level'], data: any[], stack?: string) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message: data.map(d => {
        if (typeof d === 'string') return d;
        if (d instanceof Error) return d.message;
        try {
          return JSON.stringify(d);
        } catch {
          return String(d);
        }
      }).join(' '),
      stack,
      data: data.length === 1 ? data[0] : data,
    };

    this.buffer.push(entry);

    // Keep buffer size under control
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.buffer];
  }

  public clear() {
    this.buffer = [];
  }

  public exportAsText(): string {
    return this.buffer.map(entry => {
      const date = new Date(entry.timestamp).toISOString();
      let line = `[${date}] [${entry.level.toUpperCase()}] ${entry.message}`;
      if (entry.stack) {
        line += `\n${entry.stack}`;
      }
      return line;
    }).join('\n\n');
  }

  public exportAsJSON(): string {
    return JSON.stringify(this.buffer, null, 2);
  }

  public downloadAsText(filename = 'runtime-logs.txt') {
    const text = this.exportAsText();
    this.download(text, filename, 'text/plain');
  }

  public downloadAsJSON(filename = 'runtime-logs.json') {
    const json = this.exportAsJSON();
    this.download(json, filename, 'application/json');
  }

  private download(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
export const devLogBuffer = new DevLogBuffer();
