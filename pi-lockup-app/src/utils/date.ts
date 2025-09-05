import { format, formatDistanceToNow, isBefore, parseISO } from 'date-fns';

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Check if a lockup has matured
 */
export function isLockupMatured(maturityDate: string | Date): boolean {
  const maturityDateObj = typeof maturityDate === 'string' ? parseISO(maturityDate) : maturityDate;
  return isBefore(maturityDateObj, new Date());
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Calculate days until maturity
 */
export function getDaysUntilMaturity(maturityDate: string | Date): number {
  const maturityDateObj = typeof maturityDate === 'string' ? parseISO(maturityDate) : maturityDate;
  const now = new Date();
  const diffTime = maturityDateObj.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format duration in a human-readable way
 */
export function formatDuration(days: number): string {
  if (days < 0) return 'Matured';
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? '1 year' : `${years} years`;
}