import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, LookbookImage, CartItem, ProductId, UserProfile } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

// Products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

// Cart
export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: CartItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useGetCart() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

// Wishlist
export function useAddToWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useGetWishlist() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductId[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWishlist();
    },
    enabled: !!actor && !isFetching,
  });
}

// Lookbook
export function useGetAllLookbookImages() {
  const { actor, isFetching } = useActor();

  return useQuery<LookbookImage[]>({
    queryKey: ['lookbook'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLookbookImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLookbookImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: LookbookImage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLookbookImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lookbook'] });
    },
  });
}

// Admin - Products
export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminUpdateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminDeleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Admin - Access Control
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Site Content - Save Draft
export function useSaveDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, isHeroText }: { content: string; isHeroText: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveDraft(content, isHeroText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
    },
  });
}
