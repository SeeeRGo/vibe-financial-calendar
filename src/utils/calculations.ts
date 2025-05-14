export function calculatePeriodStart(date: Date, period: string): Date {
  const startDate = new Date(date);
  
  switch (period) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      startDate.setDate(date.getDate() - date.getDay());
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yearly':
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      throw new Error(`Invalid period: ${period}`);
  }
  
  return startDate;
}

export function calculateSpending(events: Array<{ amount: number; enabled?: boolean }>) {
  return events
    .filter(event => event.enabled !== false) // Consider event enabled if field is missing
    .reduce((sum, event) => sum + event.amount, 0);
}

export function calculateRemainingBudget(cap: number, spent: number) {
  return cap - spent;
}

export function calculateUsagePercentage(spent: number, cap: number) {
  return (spent / cap) * 100;
}

export function getColorForPercentage(percentage: number) {
  return percentage > 90 ? 'red' : percentage > 75 ? 'yellow' : 'green';
}
