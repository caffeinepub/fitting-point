import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getAdminSession, saveAdminSession, resetAdminSession as resetAdminSessionUtil, type AdminSessionData } from '../utils/adminSession';

export function useAdminSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AdminSessionData>(getAdminSession);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<Error | null>(null);

  // On mount, if session indicates authenticated, trigger admin verification
  useEffect(() => {
    if (session.isAuthenticated && actor) {
      // Trigger a refetch of admin status to verify session is still valid
      queryClient.refetchQueries({ queryKey: ['isCallerAdmin'] });
    }
  }, [actor, session.isAuthenticated, queryClient]);

  const login = useCallback(async () => {
    if (!actor) {
      throw new Error('Actor not available');
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      // Verify the current user is an admin via backend isCallerAdmin()
      // This call handles bootstrapping automatically on the backend
      const isAdmin = await actor.isCallerAdmin();
      
      if (!isAdmin) {
        throw new Error('Access denied: You do not have admin privileges');
      }

      // Update local session
      const newSession: AdminSessionData = {
        isAuthenticated: true,
        lastLogin: Date.now(),
      };
      saveAdminSession(newSession);
      setSession(newSession);

      // Invalidate and refetch admin status to update UI
      await queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      await queryClient.refetchQueries({ queryKey: ['isCallerAdmin'] });

      return newSession;
    } catch (error: any) {
      console.error('Admin login failed:', error);
      setLoginError(error);
      
      // Clear invalid session
      const resetSession = resetAdminSessionUtil('login_failed');
      setSession(resetSession);
      
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, [actor, queryClient]);

  const logout = useCallback(() => {
    // Clear local session
    const resetSession = resetAdminSessionUtil('user_logout');
    setSession(resetSession);
    setLoginError(null);

    // Clear all admin-related queries
    queryClient.removeQueries({ queryKey: ['isCallerAdmin'] });
    queryClient.removeQueries({ queryKey: ['siteContent'] });
    queryClient.removeQueries({ queryKey: ['storefrontAnnouncement'] });
    queryClient.removeQueries({ queryKey: ['products'] });
    queryClient.removeQueries({ queryKey: ['lookbook'] });
    queryClient.removeQueries({ queryKey: ['banners'] });
  }, [queryClient]);

  const resetSession = useCallback(() => {
    // Reset session with reason
    const resetSession = resetAdminSessionUtil('manual_reset');
    setSession(resetSession);
    setLoginError(null);

    // Clear admin-related queries
    queryClient.removeQueries({ queryKey: ['isCallerAdmin'] });
  }, [queryClient]);

  return {
    session,
    login,
    logout,
    resetSession,
    isLoggingIn,
    loginError,
  };
}
