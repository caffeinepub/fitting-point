import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Banner } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetBanners() {
  const { actor, isFetching } = useActor();

  return useQuery<Banner[]>({
    queryKey: ['banners'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBanners();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ image, text, link }: { image: ExternalBlob; text: string; link?: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBanner(image, text, link || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
}

export function useUpdateBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      image, 
      text, 
      link 
    }: { 
      id: string; 
      image?: ExternalBlob; 
      text?: string; 
      link?: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBanner(id, image || null, text || null, link !== undefined ? link : null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
}

export function useDeleteBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBanner(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
}
