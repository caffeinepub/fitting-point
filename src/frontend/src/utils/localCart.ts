import { CartItem } from '../backend';

const CART_STORAGE_KEY = 'fitting_point_guest_cart';
const CART_VERSION = '1.0';

interface StoredCart {
  version: string;
  items: CartItem[];
}

export function getGuestCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed: StoredCart = JSON.parse(stored);
    if (parsed.version !== CART_VERSION) {
      clearGuestCart();
      return [];
    }

    return parsed.items.map(item => ({
      ...item,
      quantity: BigInt(item.quantity.toString()),
    }));
  } catch (error) {
    console.error('Error reading guest cart:', error);
    return [];
  }
}

export function saveGuestCart(cart: CartItem[]): void {
  try {
    const toStore: StoredCart = {
      version: CART_VERSION,
      items: cart.map(item => ({
        ...item,
        quantity: item.quantity.toString() as any,
      })),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
}

export function clearGuestCart(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing guest cart:', error);
  }
}
