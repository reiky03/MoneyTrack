/**
 * Formats a number to Indonesian Rupiah (IDR)
 * e.g. 1500000 -> "Rp 1.500.000"
 * When privacy mode is on, returns "Rp ••••••"
 */
export function formatRupiah(amount: number, isPrivacyMode = false): string {
  if (isPrivacyMode) {
    return 'Rp ••••••';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const formatted = absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${isNegative ? '-Rp ' : 'Rp '}${formatted}`;
}

/**
 * Formats number with thousand dots (e.g. 50000 -> "50.000")
 */
export function formatNumberWithDots(num: number): string {
  if (isNaN(num)) return '0';
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parses user input string with possible dots or spaces into a numeric integer
 * e.g. "50.000" or "50,000" or "Rp 50.000" -> 50000
 */
export function parseCurrencyInput(text: string): number {
  if (!text) return 0;
  const cleaned = text.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Compact formatter for charts & badges
 * e.g. 1500000 -> "1.5 Jt", 25000 -> "25 Rb"
 */
export function formatCompactRupiah(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} M`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, '')} Jt`;
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(0)} Rb`;
  }
  return `${sign}${abs}`;
}
