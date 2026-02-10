import { ProductId } from '../backend';

const WISHLIST_STORAGE_KEY = 'fitting_point_guest_wishlist';
const WISHLIST_VERSION = '1.0';

interface StoredWishlist {
  version: string;
  items: ProductId[];
}

export function getGuestWishlist(): ProductId[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];

    const parsed: StoredWishlist = JSON.parse(stored);
    if (parsed.version !== WISHLIST_VERSION) {
      clearGuestWishlist();
      return [];
    }

    return parsed.items;
  } catch (error) {
    console.error('Error reading guest wishlist:', error);
    return [];
  }
}

export function saveGuestWishlist(wishlist: ProductId[]): void {
  try {
    const toStore: StoredWishlist = {
      version: WISHLIST_VERSION,
      items: wishlist,
    };
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving guest wishlist:', error);
  }
}

export function clearGuestWishlist(): void {
  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing guest wishlist:', error);
  }
}
