export interface ParsedAdminAuthError {
  message: string;
  nextSteps?: string;
  type: 'anonymous_access' | 'authorization_trap' | 'signup_closed' | 'already_admin' | 'actor_unavailable' | 'network_error' | 'validation_error' | 'category_in_use' | 'unknown';
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

  // Admin signup window closed
  if (
    lowerMessage.includes('registration window is closed') ||
    lowerMessage.includes('signup window') ||
    lowerMessage.includes('admin registration is closed')
  ) {
    return {
      message: 'Admin registration is closed',
      nextSteps: 'The admin signup window has been closed. Please log in with an existing admin account or contact the site administrator.',
      type: 'signup_closed',
    };
  }

  // Already registered as admin
  if (
    lowerMessage.includes('already registered as an admin') ||
    lowerMessage.includes('already an admin') ||
    lowerMessage.includes('you are already')
  ) {
    return {
      message: 'You are already registered as an admin',
      nextSteps: 'Your Internet Identity is already an administrator. Please refresh the page or retry verification to continue to the dashboard.',
      type: 'already_admin',
    };
  }

  // Category already exists
  if (lowerMessage.includes('category with that name already exists')) {
    return {
      message: 'Category name already exists',
      nextSteps: 'Please choose a different name for this category.',
      type: 'validation_error',
    };
  }

  // Category in use (has products)
  if (lowerMessage.includes('category has') && lowerMessage.includes('product')) {
    return {
      message: 'Cannot delete category with products',
      nextSteps: 'Please reassign or remove all products from this category before deleting it.',
      type: 'category_in_use',
    };
  }

  // Missing required fields
  if (
    lowerMessage.includes('required') ||
    lowerMessage.includes('missing') ||
    lowerMessage.includes('cannot be empty')
  ) {
    return {
      message: 'Missing required information',
      nextSteps: 'Please fill in all required fields and try again.',
      type: 'validation_error',
    };
  }

  // Authorization/permission errors (not admin)
  if (
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('access denied') ||
    lowerMessage.includes('admin privileges') ||
    lowerMessage.includes('permission') ||
    lowerMessage.includes('not authorized')
  ) {
    return {
      message: 'Your Internet Identity is not authorized',
      nextSteps: 'Please log out and switch to an admin account, or contact the site administrator for access.',
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
    message: errorMessage || 'An error occurred',
    nextSteps: 'Please try again. If the issue persists, contact support.',
    type: 'unknown',
  };
}
