/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PortfolioCategory = 'all' | 'sertifikat' | 'faroid' | 'akademik';

export interface PortfolioItem {
  id: number;
  title: string;
  category: 'sertifikat' | 'faroid' | 'akademik';
  categoryLabel: string;
  categoryBadgeClass: string;
  organizer: string;
  year: string;
  date?: string; // Format ISO: 'YYYY-MM-DD' atau 'YYYY-MM' untuk urutan presisi
  dateLabel?: string; // Tampilan label yang ramah dibaca, misal 'Okt 2026'
  yearBadgeClass: string;
  description: string;
  imageUrl: string;
  fallbackUrl: string;
}
