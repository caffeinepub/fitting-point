import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SiteContent } from '../backend';
import { getSiteContentDefaults } from '../utils/siteContentDefaults';
import { getAdminSession } from '../utils/adminSession';

export function useSiteContent() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteContent>({
    queryKey: ['siteContent'],
    queryFn: async () => {
      if (!actor) return getSiteContentDefaults();
      try {
        return await actor.getSiteContent();
      } catch (error) {
        console.error('Error loading site content:', error);
        return getSiteContentDefaults();
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePublishSiteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const session = getAdminSession();
      if (!session.isAuthenticated) {
        throw new Error('Admin authentication required');
      }
      return actor.publishSiteContent();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
}

export function useToggleDarkMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error('Actor not initialized');
      const session = getAdminSession();
      if (!session.isAuthenticated) {
        throw new Error('Admin authentication required');
      }
      return actor.toggleDarkMode(enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
}
