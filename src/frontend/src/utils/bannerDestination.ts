export interface BannerDestination {
  type: 'catalog' | 'product' | 'external' | 'none';
  category?: string;
  productId?: string;
  url?: string;
}

export function encodeBannerDestination(dest: BannerDestination): string | null {
  if (dest.type === 'none') return null;
  
  try {
    return JSON.stringify(dest);
  } catch {
    return null;
  }
}

export function decodeBannerDestination(link: string | null | undefined): BannerDestination {
  if (!link) return { type: 'none' };
  
  try {
    const parsed = JSON.parse(link);
    if (typeof parsed === 'object' && parsed.type) {
      return parsed;
    }
    // Fallback: treat as external URL
    return { type: 'external', url: link };
  } catch {
    // Fallback: treat as external URL
    return { type: 'external', url: link };
  }
}

export function getBannerClickHandler<T extends string>(
  destination: BannerDestination,
  onNavigate: (page: T, productId?: string, category?: string) => void
): (() => void) | undefined {
  switch (destination.type) {
    case 'catalog':
      return () => onNavigate('catalog' as T, undefined, destination.category);
    case 'product':
      return destination.productId 
        ? () => onNavigate('product' as T, destination.productId)
        : undefined;
    case 'external':
      return destination.url 
        ? () => window.open(destination.url, '_blank', 'noopener,noreferrer')
        : undefined;
    case 'none':
    default:
      return undefined;
  }
}
