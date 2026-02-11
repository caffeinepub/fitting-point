/**
 * Utility to parse and classify admin authentication errors
 * from the backend into stable error types for UI display.
 */

export type AdminAuthErrorType = 'invalid_credentials' | 'generic_failure';

export interface ParsedAdminAuthError {
  type: AdminAuthErrorType;
  message: string;
  originalError: any;
}

/**
 * Parse backend authentication errors into a stable classification
 * so the UI can show appropriate messages.
 */
export function parseAdminAuthError(error: any): ParsedAdminAuthError {
  const errorMessage = error?.message || String(error);
  const lowerMessage = errorMessage.toLowerCase();
  
  // Only treat as invalid credentials if we have explicit authentication failure messages
  const isInvalidCredentials = 
    lowerMessage.includes('authentication failed') ||
    lowerMessage.includes('check your credentials') ||
    lowerMessage.includes('invalid email') ||
    lowerMessage.includes('invalid password') ||
    lowerMessage.includes('incorrect credentials');

  if (isInvalidCredentials) {
    return {
      type: 'invalid_credentials',
      message: 'Invalid email or password. Please check your credentials and try again.',
      originalError: error,
    };
  }

  // Check for actor/initialization errors
  if (lowerMessage.includes('actor not available') || 
      lowerMessage.includes('not initialized') ||
      lowerMessage.includes('canister')) {
    return {
      type: 'generic_failure',
      message: 'System is initializing. Please wait a moment and try again.',
      originalError: error,
    };
  }

  // Generic failure for all other cases
  return {
    type: 'generic_failure',
    message: 'Login failed. Please try again or contact support.',
    originalError: error,
  };
}
