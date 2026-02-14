import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, LookbookImage, Cart, CartItem } from '../backend';

// Admin verification hook
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

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

export function useGetProduct(productId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor || !productId) return null;
      try {
        return await actor.getProduct(productId);
      } catch (error) {
        console.error('Error fetching product:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useFilterProductsByCategory(category: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.filterProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetBestsellers() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'bestsellers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBestsellers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNewProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'new'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMostLovedProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'mostLoved'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMostLovedProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

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
    mutationFn: async ({ productId, product }: { productId: string; product: Product }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminUpdateProduct(productId, product);
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
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminDeleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Cart
export function useGetCart() {
  const { actor, isFetching } = useActor();

  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

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
    mutationFn: async ({ productId, size, color }: { productId: string; size: string; color: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(productId, size, color);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
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
