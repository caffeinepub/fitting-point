const ADMIN_SESSION_KEY = 'fitting_point_admin_session';

export interface AdminSession {
  isAuthenticated: boolean;
  loginTime?: number;
}

export function getAdminSession(): AdminSession {
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) {
      return { isAuthenticated: false };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading admin session:', error);
    return { isAuthenticated: false };
  }
}

export function setAdminSession(session: AdminSession): void {
  try {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving admin session:', error);
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing admin session:', error);
  }
}
