export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const calculateBudgetProgress = (spent, allocated) => {
  if (allocated === 0) return 0;
  return Math.min(100, Math.round((spent / allocated) * 100));
};
