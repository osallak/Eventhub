export const formatPrice = (amount: number, currency?: string): string => {
  if (!currency) return amount.toString();

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
