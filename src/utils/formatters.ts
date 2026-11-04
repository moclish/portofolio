/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Parses raw text input into a positive integer.
 */
export function parseMoney(val: string): number {
  if (!val) return 0;
  return parseFloat(val.replace(/\D/g, '')) || 0;
}

/**
 * Formats a number or numeric string as Indonesian Rupiah formatted string (e.g. 100.000.000).
 */
export function formatNumberInput(raw: string | number): string {
  const str = String(raw);
  const digits = str.replace(/\D/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toLocaleString('id-ID');
}

/**
 * Formats currency as Indonesian Rupiah with prefix (e.g. Rp 10.000.000).
 */
export function formatRupiah(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}
