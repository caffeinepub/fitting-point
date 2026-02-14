import type { Product } from '../backend';

/**
 * Returns safe image URLs for ProductCard display with fallback handling.
 * Uses a high-quality placeholder when product images are missing.
 */
export function getProductCardImages(product: Product): {
  primaryImage: string;
  secondaryImage: string | null;
  hasHoverSwap: boolean;
} {
  const FALLBACK_IMAGE = '/assets/generated/handbag-luxury.dim_800x800.jpg';

  // No images at all - use fallback for both
  if (!product.images || product.images.length === 0) {
    return {
      primaryImage: FALLBACK_IMAGE,
      secondaryImage: null,
      hasHoverSwap: false,
    };
  }

  // Single image - use it as primary, no hover swap
  if (product.images.length === 1) {
    return {
      primaryImage: product.images[0].getDirectURL(),
      secondaryImage: null,
      hasHoverSwap: false,
    };
  }

  // Multiple images - enable hover swap
  return {
    primaryImage: product.images[0].getDirectURL(),
    secondaryImage: product.images[1].getDirectURL(),
    hasHoverSwap: true,
  };
}

/**
 * Returns a single thumbnail URL for admin listings with fallback handling.
 * Optimized for table/grid views where only one image is needed.
 */
export function getProductThumbnail(product: Product): string {
  const FALLBACK_IMAGE = '/assets/generated/handbag-luxury.dim_800x800.jpg';

  if (!product.images || product.images.length === 0) {
    return FALLBACK_IMAGE;
  }

  return product.images[0].getDirectURL();
}
