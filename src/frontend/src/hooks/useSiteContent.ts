import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SiteContent } from '../backend';
import { useAdminGuard } from './useAdminGuard';

export function useGetSiteContent() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteContent>({
    queryKey: ['siteContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSiteContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async ({ 
      heroText, 
      contactDetails, 
      darkModeEnabled, 
      companyName 
    }: { 
      heroText: string; 
      contactDetails: string; 
      darkModeEnabled: boolean; 
      companyName: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Verify backend admin status before proceeding
      requireAdmin('update site content');
      
      return actor.updateSiteContent(heroText, contactDetails, darkModeEnabled, companyName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
}

export function useToggleDarkMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error('Actor not available');
      
      // Get current site content
      const currentContent = await actor.getSiteContent();
      
      // Verify backend admin status before proceeding
      requireAdmin('toggle dark mode');
      
      // Update with new dark mode setting
      return actor.updateSiteContent(
        currentContent.heroText,
        currentContent.contactDetails,
        enabled,
        currentContent.companyName
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
}
