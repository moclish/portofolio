/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import profileImg from '../assets/profile.webp';
import logoImg from '../assets/logo.webp';
import faviconImg from '../assets/favicon.webp';

const LOCAL_ASSET_MAP: Record<string, string> = {
  '1u31jBVyshSC3IiSNAXir06ERDRd3EyNJ': profileImg,
  '1pXTxsYy_hngtUV6WlF4lPVj5e0eGPfEZ': logoImg,
  '13W1EyYpOlx6pm_-3dYvCcii4SnqquDFB': faviconImg,
};

/**
 * Normalizes image paths/URLs:
 * - Resolves bundled local WebP assets for core brand imagery (zero redirect, instant LCP)
 * - Extracts Google Drive file IDs from various link formats (share links, view links, uc links)
 * - Converts to direct WebP CDN endpoint on lh3.googleusercontent.com (no 302 redirect)
 * - Passes through local paths (/assets/..., /portfolio/...) or standard web URLs
 */
export function formatPortfolioImageUrl(source: string, width = 1200): string {
  if (!source) return '';

  const trimmed = source.trim();

  if (LOCAL_ASSET_MAP[trimmed]) {
    return LOCAL_ASSET_MAP[trimmed];
  }

  // If already a local asset or standard URL that is not Google Drive
  if (!trimmed.includes('drive.google.com')) {
    // If it looks like a raw Google Drive ID (e.g., alphanumeric ~33 chars)
    if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
      return `https://lh3.googleusercontent.com/d/${trimmed}=w${width}-rw`;
    }
    return trimmed;
  }

  // Extract from Google Drive file URL patterns:
  // 1. https://drive.google.com/file/d/{ID}/view...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    if (LOCAL_ASSET_MAP[fileDMatch[1]]) {
      return LOCAL_ASSET_MAP[fileDMatch[1]];
    }
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}=w${width}-rw`;
  }

  // 2. https://drive.google.com/open?id={ID} or id={ID}
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    if (LOCAL_ASSET_MAP[idParamMatch[1]]) {
      return LOCAL_ASSET_MAP[idParamMatch[1]];
    }
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}=w${width}-rw`;
  }

  return trimmed;
}
