
/**
 * Formats a number as a price with proper thousand separators
 * @param price The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
