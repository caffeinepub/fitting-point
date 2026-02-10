import { useState, useEffect } from 'react';
import { CartItem } from '../backend';
import { getGuestCart, saveGuestCart, clearGuestCart } from '../utils/localCart';

export function useGuestCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getGuestCart());
  }, []);

  const addToCart = (item: CartItem) => {
    const existingIndex = cart.findIndex(
      (c) =>
        c.productId === item.productId &&
        c.size === item.size &&
        c.color === item.color
    );

    let newCart: CartItem[];
    if (existingIndex >= 0) {
      newCart = [...cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: BigInt(Number(newCart[existingIndex].quantity) + Number(item.quantity)),
      };
    } else {
      newCart = [...cart, item];
    }

    setCart(newCart);
    saveGuestCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    setCart(newCart);
    saveGuestCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    clearGuestCart();
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
