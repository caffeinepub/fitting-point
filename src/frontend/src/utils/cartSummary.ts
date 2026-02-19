interface CartItemWithProduct {
  productId: string;
  size: string;
  color: string;
  quantity: bigint;
  product?: {
    id: string;
    name: string;
    price: bigint;
  };
}

export interface CartSummary {
  items: Array<{
    productId: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  itemCount: number;
}

export function calculateCartSummary(cartItems: CartItemWithProduct[]): CartSummary {
  const items = cartItems.map((item) => {
    const unitPrice = item.product ? Number(item.product.price) : 0;
    const quantity = Number(item.quantity);
    const lineTotal = unitPrice * quantity;

    return {
      productId: item.productId,
      name: item.product?.name || 'Unknown Product',
      size: item.size,
      color: item.color,
      quantity,
      unitPrice,
      lineTotal,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    subtotal,
    itemCount,
  };
}
