/**
 * Admin session persistence utilities
 */

const ADMIN_SESSION_KEY = 'fitting-point-admin-session';

export interface AdminSessionData {
  isAuthenticated: boolean;
  lastLogin?: number;
  lastReset?: number;
  resetReason?: string;
}

const DEFAULT_SESSION: AdminSessionData = {
  isAuthenticated: false,
};

export function getAdminSession(): AdminSessionData {
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) return DEFAULT_SESSION;
    
    const parsed = JSON.parse(stored);
    
    // Validate parsed shape
    if (typeof parsed !== 'object' || parsed === null) {
      console.warn('Invalid admin session format, resetting');
      return DEFAULT_SESSION;
    }
    
    // Ensure required fields exist
    if (typeof parsed.isAuthenticated !== 'boolean') {
      console.warn('Invalid admin session structure, resetting');
      return DEFAULT_SESSION;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to read admin session:', error);
    return DEFAULT_SESSION;
  }
}

export function saveAdminSession(session: AdminSessionData): void {
  try {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save admin session:', error);
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear admin session:', error);
  }
}

/**
 * Reset admin session with optional reason tracking
 */
export function resetAdminSession(reason?: string): AdminSessionData {
  const resetSession: AdminSessionData = {
    isAuthenticated: false,
    lastReset: Date.now(),
    resetReason: reason,
  };
  saveAdminSession(resetSession);
  return resetSession;
}
