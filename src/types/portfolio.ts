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
  yearBadgeClass: string;
  description: string;
  imageUrl: string;
  fallbackUrl: string;
}
