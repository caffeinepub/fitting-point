import { useIsCallerAdmin } from './useQueries';

/**
 * Admin guard hook that verifies backend admin status before mutations.
 * Relies solely on backend isCallerAdmin() for authorization.
 */
export function useAdminGuard() {
  const { data: isAdmin = false, isLoading, error } = useIsCallerAdmin();

  const requireAdmin = (action: string = 'perform this action') => {
    if (isLoading) {
      throw new Error('Admin verification in progress. Please wait.');
    }

    if (error) {
      throw new Error(`Admin verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    if (!isAdmin) {
      throw new Error(`Unauthorized: You must be an admin to ${action}`);
    }
  };

  return {
    isAdmin,
    isLoading,
    error,
    requireAdmin,
  };
}
