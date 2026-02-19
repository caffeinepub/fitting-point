import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAdminGuard } from './useAdminGuard';
import type { Product, LookbookImage, Cart, CartItem, Category, BannerImage, Logo } from '../backend';
import { ExternalBlob } from '../backend';

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

// Admin signup window state
export function useIsAdminSignupEnabled() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['adminSignupEnabled'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdminSignupEnabled();
    },
    enabled: !!actor && !isFetching,
  });
}

// Register current caller as admin
export function useRegisterAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerAdmin();
    },
    onSuccess: async () => {
      // Invalidate and immediately refetch admin status to force UI update
      await queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      await queryClient.refetchQueries({ queryKey: ['isCallerAdmin'] });
      
      // Also invalidate signup enabled state
      queryClient.invalidateQueries({ queryKey: ['adminSignupEnabled'] });
    },
  });
}

// Close admin signup window (admin-only)
export function useCloseAdminSignupWindow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.closeAdminSignupWindow();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSignupEnabled'] });
    },
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
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('add products');
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
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async ({ productId, product }: { productId: string; product: Product }) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('update products');
      return actor.adminUpdateProduct(productId, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Categories
export function useGetAllCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('create categories');
      return actor.createCategory(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategoryDescription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async ({ name, newDescription }: { name: string; newDescription: string }) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('update categories');
      return actor.updateCategoryDescription(name, newDescription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('delete categories');
      return actor.deleteCategory(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// Banners
export function useGetAllBanners() {
  const { actor, isFetching } = useActor();

  return useQuery<BannerImage[]>({
    queryKey: ['banners'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBanners();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async (banner: {
      id: string;
      image: ExternalBlob;
      title: string;
      description: string;
      link: string | null;
      order: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('add banners');
      return actor.addBanner(banner.id, banner.image, banner.title, banner.description, banner.link, banner.order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}

export function useUpdateBannerOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async (bannerOrders: Array<[string, bigint]>) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('reorder banners');
      return actor.updateBannerOrder(bannerOrders);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}

export function useRemoveBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async (bannerId: string) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('remove banners');
      return actor.removeBanner(bannerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}

// Logo
export function useGetLogo() {
  const { actor, isFetching } = useActor();

  return useQuery<Logo | null>({
    queryKey: ['logo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLogo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { requireAdmin } = useAdminGuard();

  return useMutation({
    mutationFn: async ({ image, altText, link }: { image: ExternalBlob; altText: string; link: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      requireAdmin('update logo');
      return actor.updateLogo(image, altText, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logo'] });
    },
  });
}

// Cart
export function useGetCart() {
  const { actor, isFetching } = useActor();

  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return { items: [] };
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
      return actor.addToCart([item]);
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
