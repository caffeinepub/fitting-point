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
  
  // Check for invalid credentials patterns
  const isInvalidCredentials = 
    errorMessage.includes('Authentication failed') ||
    errorMessage.includes('Check your credentials') ||
    errorMessage.includes('Invalid') ||
    errorMessage.includes('Unauthorized');

  if (isInvalidCredentials) {
    return {
      type: 'invalid_credentials',
      message: 'Invalid email or password. Please check your credentials and try again.',
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
