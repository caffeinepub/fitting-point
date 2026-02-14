import { useState, useEffect } from 'react';
import { getGuestWishlist, saveGuestWishlist, clearGuestWishlist } from '../utils/localWishlist';

export function useGuestWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setWishlist(getGuestWishlist());
  }, []);

  const addToWishlist = (productId: string) => {
    if (!wishlist.includes(productId)) {
      const newWishlist = [...wishlist, productId];
      setWishlist(newWishlist);
      saveGuestWishlist(newWishlist);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(newWishlist);
    saveGuestWishlist(newWishlist);
  };

  const clearWishlist = () => {
    setWishlist([]);
    clearGuestWishlist();
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };
}
