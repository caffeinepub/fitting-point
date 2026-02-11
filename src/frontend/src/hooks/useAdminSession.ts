import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getAdminSession, setAdminSession, clearAdminSession, type AdminSession } from '../utils/adminSession';

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession>(getAdminSession());
  const { actor } = useActor();
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = getAdminSession();
    setSession(stored);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Trim credentials to handle accidental whitespace
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      await actor.authenticateAdminWithEmailPassword(trimmedEmail, trimmedPassword);
      return { email: trimmedEmail };
    },
    onSuccess: () => {
      const newSession: AdminSession = {
        isAuthenticated: true,
        loginTime: Date.now(),
      };
      setAdminSession(newSession);
      setSession(newSession);
      // Invalidate isCallerAdmin query to trigger re-fetch and render admin layout
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });

  const logout = () => {
    clearAdminSession();
    setSession({ isAuthenticated: false });
    queryClient.clear();
  };

  return {
    session,
    isAuthenticated: session.isAuthenticated,
    login: loginMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
