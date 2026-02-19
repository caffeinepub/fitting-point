import { formatINR } from './currency';
import { calculateCartSummary } from './cartSummary';

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
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('91')) {
    return digits;
  }
  return '91' + digits;
}

export function buildWhatsAppCheckoutURL(
  cartItems: CartItemWithProduct[]
): string {
  const phoneNumber = normalizePhoneNumber(
    import.meta.env.VITE_WHATSAPP_NUMBER || '919826022251'
  );

  const summary = calculateCartSummary(cartItems);

  let message = '🛍️ *New Order from Fitting Point*\n\n';
  message += '*Order Details:*\n';
  message += '━━━━━━━━━━━━━━━━\n\n';

  summary.items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Size: ${item.size}\n`;
    message += `   Color: ${item.color}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ${formatINR(item.lineTotal)}\n\n`;
  });

  message += '━━━━━━━━━━━━━━━━\n';
  message += `*Total Amount: ${formatINR(summary.subtotal)}*\n\n`;
  message += 'Please confirm this order and let me know the delivery details.';

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
