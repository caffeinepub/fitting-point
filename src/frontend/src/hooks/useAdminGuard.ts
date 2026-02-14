import { useCallback } from 'react';
import { useActor } from './useActor';

/**
 * Admin guard hook for protecting mutations.
 * Verifies backend admin status before allowing operations.
 */
export function useAdminGuard() {
  const { actor } = useActor();

  const requireAdmin = useCallback(async () => {
    if (!actor) {
      throw new Error('Backend actor is not available');
    }

    try {
      const isAdmin = await actor.isCallerAdmin();
      if (!isAdmin) {
        throw new Error('Admin privileges required. Please log in as an administrator.');
      }
      return true;
    } catch (error: any) {
      console.error('Admin verification failed:', error);
      throw new Error(`Admin verification failed: ${error.message || 'Unknown error'}`);
    }
  }, [actor]);

  return { requireAdmin };
}
