import { useState, useEffect } from 'react';
import { ProductId } from '../backend';
import { getGuestWishlist, saveGuestWishlist, clearGuestWishlist } from '../utils/localWishlist';

export function useGuestWishlist() {
  const [wishlist, setWishlist] = useState<ProductId[]>([]);

  useEffect(() => {
    setWishlist(getGuestWishlist());
  }, []);

  const addToWishlist = (productId: ProductId) => {
    if (!wishlist.includes(productId)) {
      const newWishlist = [...wishlist, productId];
      setWishlist(newWishlist);
      saveGuestWishlist(newWishlist);
    }
  };

  const removeFromWishlist = (productId: ProductId) => {
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
