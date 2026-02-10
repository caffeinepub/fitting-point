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

function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 91 (India country code), use as-is
  // Otherwise, prepend 91
  if (digits.startsWith('91')) {
    return digits;
  }
  return '91' + digits;
}

export function buildWhatsAppCheckoutURL(
  cartItems: CartItemWithProduct[],
  total: number
): string {
  const phoneNumber = normalizePhoneNumber(
    import.meta.env.VITE_WHATSAPP_NUMBER || '9826022251'
  );

  // Build order message
  let message = '🛍️ *New Order from Fitting Point*\n\n';
  message += '*Order Details:*\n';
  message += '━━━━━━━━━━━━━━━━\n\n';

  cartItems.forEach((item, index) => {
    const productName = item.product?.name || 'Unknown Product';
    const price = item.product ? Number(item.product.price) : 0;
    const quantity = Number(item.quantity);
    const lineTotal = price * quantity;

    message += `${index + 1}. *${productName}*\n`;
    message += `   Size: ${item.size}\n`;
    message += `   Color: ${item.color}\n`;
    message += `   Quantity: ${quantity}\n`;
    message += `   Price: ₹${lineTotal.toLocaleString()}\n\n`;
  });

  message += '━━━━━━━━━━━━━━━━\n';
  message += `*Total Amount: ₹${total.toLocaleString()}*\n\n`;
  message += 'Please confirm this order and let me know the delivery details.';

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // Build WhatsApp URL
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
