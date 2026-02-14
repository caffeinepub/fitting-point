/**
 * Centralized INR currency formatting utility
 * Formats prices consistently across the storefront
 */

/**
 * Format a price value (in smallest unit, e.g., paise) to INR display format
 * @param priceInPaise - Price in paise (1 rupee = 100 paise)
 * @returns Formatted string like "₹1,299.00"
 */
export function formatINR(priceInPaise: number | bigint): string {
  const priceInRupees = Number(priceInPaise) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInRupees);
}

/**
 * Format a price value without currency symbol (for calculations display)
 * @param priceInPaise - Price in paise
 * @returns Formatted number string like "1,299.00"
 */
export function formatINRNumber(priceInPaise: number | bigint): string {
  const priceInRupees = Number(priceInPaise) / 100;
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInRupees);
}
