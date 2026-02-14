export interface ParsedAdminAuthError {
  message: string;
  nextSteps?: string;
  type: 'anonymous_access' | 'authorization_trap' | 'actor_unavailable' | 'network_error' | 'unknown';
}

export function parseAdminAuthError(error: unknown): ParsedAdminAuthError {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      nextSteps: 'Please try again or contact support if the issue persists.',
      type: 'unknown',
    };
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Anonymous access attempt
  if (lowerMessage.includes('anonymous') || lowerMessage.includes('not authenticated')) {
    return {
      message: 'You must log in to access the admin panel',
      nextSteps: 'Please log in with Internet Identity to continue.',
      type: 'anonymous_access',
    };
  }

  // Authorization/permission errors
  if (
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('access denied') ||
    lowerMessage.includes('admin privileges') ||
    lowerMessage.includes('permission')
  ) {
    return {
      message: 'You do not have admin permissions',
      nextSteps: 'Please contact the site administrator or log in with an admin account.',
      type: 'authorization_trap',
    };
  }

  // Actor/backend unavailable
  if (
    lowerMessage.includes('actor not available') ||
    lowerMessage.includes('actor not initialized') ||
    lowerMessage.includes('backend not ready')
  ) {
    return {
      message: 'Backend connection unavailable',
      nextSteps: 'Please wait a moment and try again. If the issue persists, check your network connection.',
      type: 'actor_unavailable',
    };
  }

  // Network errors
  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('timeout')
  ) {
    return {
      message: 'Network connection error',
      nextSteps: 'Please check your internet connection and try again.',
      type: 'network_error',
    };
  }

  // Generic fallback
  return {
    message: 'Admin verification failed',
    nextSteps: 'Please try logging out and logging in again. If the issue persists, contact support.',
    type: 'unknown',
  };
}
