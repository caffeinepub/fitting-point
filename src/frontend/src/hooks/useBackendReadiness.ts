import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useCallback } from 'react';

export interface BackendReadinessState {
  isReady: boolean;
  isPolling: boolean;
  hasError: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Canonical hook to check backend readiness.
 * Single source of truth for readiness state across the app.
 * Since the backend's isReady() method always returns true,
 * this hook primarily checks if the actor is available and the method can be called.
 */
export function useBackendReadiness(): BackendReadinessState {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['backendReadiness'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Backend actor is not available. Please wait for the system to initialize.');
      }

      try {
        const ready = await actor.isReady();
        return { ready, timestamp: Date.now() };
      } catch (error: any) {
        console.error('Backend readiness check failed:', error);
        throw new Error(`Unable to connect to backend: ${error.message || 'Connection failed'}`);
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 60000, // Consider ready state valid for 60 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const retry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['backendReadiness'] });
    queryClient.refetchQueries({ queryKey: ['backendReadiness'] });
  }, [queryClient]);

  // Treat actor unavailability as an error state after initial fetch attempt
  const hasActorError = !actorFetching && !actor && query.fetchStatus === 'idle';

  return {
    isReady: query.data?.ready === true,
    isPolling: actorFetching || query.isLoading || query.isFetching,
    hasError: query.isError || hasActorError,
    error: query.error as Error | null || (hasActorError ? new Error('Backend actor failed to initialize') : null),
    retry,
  };
}
