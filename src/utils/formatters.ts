export const formatPercentage = (value: number): string => {
  if (isNaN(value)) return "0%";
  return `${(value * 100).toFixed(1)}%`;
};

export const formatCurrency = (value: number, currency: string = "CHF"): string => {
  if (isNaN(value)) return `${currency} 0.00`;
  return `${currency} ${value.toFixed(2)}`;
};

export const formatNumber = (value: number): string => {
  if (isNaN(value)) return "0";
  return value.toLocaleString();
};