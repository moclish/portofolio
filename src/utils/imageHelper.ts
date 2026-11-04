/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Normalizes image paths/URLs:
 * - Extracts Google Drive file IDs from various link formats (share links, view links, uc links)
 * - Converts to optimized high-res thumbnail endpoint (sz=w1200)
 * - Passes through local paths (/assets/..., /portfolio/...) or standard web URLs
 */
export function formatPortfolioImageUrl(source: string): string {
  if (!source) return '';

  const trimmed = source.trim();

  // If already a local asset or standard URL that is not Google Drive
  if (!trimmed.includes('drive.google.com')) {
    // If it looks like a raw Google Drive ID (e.g., alphanumeric ~33 chars)
    if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
      return `https://drive.google.com/thumbnail?id=${trimmed}&sz=w1200`;
    }
    return trimmed;
  }

  // Extract from Google Drive file URL patterns:
  // 1. https://drive.google.com/file/d/{ID}/view...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${fileDMatch[1]}&sz=w1200`;
  }

  // 2. https://drive.google.com/open?id={ID} or id={ID}
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${idParamMatch[1]}&sz=w1200`;
  }

  return trimmed;
}
