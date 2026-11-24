/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PROFILE_INFO = {
  name: "Sadono, Lc",
  title: "a.k.a Ustadz Moclish",
  spec: "Spesialis Fikih Waris",
  location: "Paser, Kalimantan Timur",
  school: "MAS AL FURQON, Kalimantan Timur",
  // Obfuscated WhatsApp token untuk perlindungan dari bot crawler / web scraping
  whatsappToken: "NjI4MjI1MDgwMzE0NA==",
  whatsappDisplay: "+62 822 •••• 3144",
  email: "sadono@madrasah.kemenag.go.id",
  facebookUrl: "https://facebook.com/moclish",
  facebookFollowers: "1.8K+ Pengikut",
  instagramUrl: "https://instagram.com/sadonox",
  instagramFollowers: "3.5K+ Pengikut",
  // Foto Profil: Bisa pakai path lokal (cth: '/foto-profil.jpg') atau link/ID Google Drive
  photoUrl: "1u31jBVyshSC3IiSNAXir06ERDRd3EyNJ",
  // Logo & Favicon: Bisa diisi Google Drive ID (cth: '1u31jBVysh...'), link Google Drive, atau path gambar lokal
  // Jika dikosongkan '', akan otomatis menggunakan ikon monogram 'س' yang elegan
  logoUrl: "1pXTxsYy_hngtUV6WlF4lPVj5e0eGPfEZ",
  faviconUrl: "13W1EyYpOlx6pm_-3dYvCcii4SnqquDFB",
};

/**
 * Helper untuk mendekode nomor WhatsApp saat interaksi pengguna (klik/submit)
 * Mencegah nomor terekspos dalam bentuk teks mentah pada HTML / DOM
 */
export const getDecodedWhatsAppNumber = (): string => {
  try {
    return typeof atob !== "undefined" ? atob(PROFILE_INFO.whatsappToken) : "";
  } catch {
    return "";
  }
};
