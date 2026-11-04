/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioItem } from '../types/portfolio';

/**
 * PANDUAN MENAMBAHKAN PORTOFOLIO / SERTIFIKAT BARU:
 * ----------------------------------------------------
 * Anda cukup menduplikasi salah satu objek di bawah ini.
 *
 * PENGURUTAN OTOMATIS:
 * - Gunakan field `date` (format: 'YYYY-MM-DD', misal: '2026-10-24').
 * - Sistem akan otomatis mengurutkan dari tanggal paling baru ke paling lama,
 *   bahkan jika beberapa sertifikat diterbitkan pada tahun yang sama.
 * - Opsional: field `dateLabel` (misal: 'Okt 2026') untuk tampilan teks bulan & tahun di badge.
 *
 * OPSI SUMBER GAMBAR (imageUrl):
 * 1. Google Drive:
 *    - Masukkan link sharing Google Drive (Pastikan izin: "Siapa saja yang memiliki link dapat melihat"):
 *      Contoh: 'https://drive.google.com/file/d/1ogrPUshX6ktGkXDPLf41d2uX08xO85F3/view?usp=sharing'
 *    - ATAU masukkan ID-nya saja: '1ogrPUshX6ktGkXDPLf41d2uX08xO85F3'
 * 2. File Lokal di Proyek Anda (Paling direkomendasikan & paling cepat):
 *    - Simpan file foto/scan di folder `public/portfolio/nama-file.jpg`
 *    - Masukkan path: '/portfolio/nama-file.jpg'
 */
export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 1,
    title: 'Santri Mahir Artificial Intelligence',
    category: 'sertifikat',
    categoryLabel: 'Sertifikasi',
    categoryBadgeClass: 'bg-amber-100 text-amber-700',
    organizer: 'Pusbangkom',
    year: '2026',
    date: '2026-02-10',
    dateLabel: 'Feb 2026',
    yearBadgeClass: 'bg-emerald-600 text-white',
    description:
      'Sertifikasi kompetensi Santri Mahir Artificial Intelligence yang mencakup pemahaman dasar AI, penerapan AI dalam pendidikan, dan pengembangan keterampilan digital.',
    imageUrl: '1ogrPUshX6ktGkXDPLf41d2uX08xO85F3',
    fallbackUrl:
      'https://placehold.co/600x450/f0fdf4/047857?text=Santri+Mahir+AI+2026',
  },
  {
    id: 2,
    title: 'Bangun Portofolio Digital',
    category: 'akademik',
    categoryLabel: 'Pelatihan',
    categoryBadgeClass: 'bg-blue-100 text-blue-700',
    organizer: 'Websis For Edu',
    year: '2026',
    date: '2026-05-18',
    dateLabel: 'Mei 2026',
    yearBadgeClass: 'bg-emerald-600 text-white',
    description:
      'Pelatihan kompetensi Bangun Portofolio Digital bagi guru dan pendidik untuk meningkatkan kemampuan digital dalam menyusun portofolio profesional.',
    imageUrl: '1qr2vjNzCT9YRGryA5F_5e4o_3PiyiDMO',
    fallbackUrl:
      'https://placehold.co/600x450/eff6ff/1d4ed8?text=Portofolio+Digital+2026',
  },
  {
    id: 3,
    title: 'Certified Gemini Educator',
    category: 'sertifikat',
    categoryLabel: 'Sertifikasi',
    categoryBadgeClass: 'bg-amber-100 text-amber-700',
    organizer: 'Google Education',
    year: '2026',
    date: '2026-10-24',
    dateLabel: 'Okt 2026',
    yearBadgeClass: 'bg-emerald-600 text-white',
    description:
      'Sertifikasi kompetensi integrasi Artificial Intelligence (AI Gemini) dalam menyusun modul ajar, evaluasi otomatis, serta efisiensi KBM.',
    imageUrl: '1a48rEi_qDjOJMlc-lHMYVIc_glRk_MVt',
    fallbackUrl:
      'https://placehold.co/600x450/fef3c7/d97706?text=Gemini+Educator+2026',
  },
  {
    id: 4,
    title: 'Workshop Metodologi Fikih Mawaris Modern',
    category: 'faroid',
    categoryLabel: 'Pelatihan Fikih',
    categoryBadgeClass: 'bg-emerald-100 text-brand-700',
    organizer: 'Kementerian Agama',
    year: '2024',
    date: '2024-08-15',
    dateLabel: 'Agu 2024',
    yearBadgeClass: 'bg-brand-600 text-white',
    description:
      'Pendalaman teknik pengajaran ilmu Faroid interaktif menggunakan pendekatan studi kasus praktis bagi pendidik madrasah aliyah.',
    imageUrl:
      'https://placehold.co/600x450/dcfce7/059669?text=Pelatihan+Faroid+2024',
    fallbackUrl:
      'https://placehold.co/600x450/dcfce7/059669?text=Pelatihan+Faroid+2024',
  },
  {
    id: 5,
    title: 'Buku Saku Fikih Waris Ringkas',
    category: 'faroid',
    categoryLabel: 'Buku & Modul',
    categoryBadgeClass: 'bg-emerald-100 text-brand-700',
    organizer: 'MAS Al Furqon',
    year: '2023',
    date: '2023-11-01',
    dateLabel: 'Nov 2023',
    yearBadgeClass: 'bg-brand-600 text-white',
    description:
      'Panduan belajar mandiri santri dalam memahami pembagian harta warisan secara cepat dilengkapi tabel bagian utuh dan studi kasus.',
    imageUrl:
      'https://placehold.co/600x450/dcfce7/047857?text=Modul+Buku+Saku+2023',
    fallbackUrl:
      'https://placehold.co/600x450/dcfce7/047857?text=Modul+Buku+Saku+2023',
  },
  {
    id: 6,
    title: 'Sertifikat Strategi Pembelajaran Kreatif',
    category: 'sertifikat',
    categoryLabel: 'Pelatihan Guru',
    categoryBadgeClass: 'bg-blue-100 text-blue-700',
    organizer: 'Balai Diklat Keagamaan',
    year: '2022',
    date: '2022-06-20',
    dateLabel: 'Jun 2022',
    yearBadgeClass: 'bg-blue-600 text-white',
    description:
      'Pelatihan peningkatan kompetensi pedagogik guru dalam merancang metode KBM yang menyenangkan dan inklusif.',
    imageUrl:
      'https://placehold.co/600x450/dbeafe/1d4ed8?text=Sertifikat+Pedagogik+2022',
    fallbackUrl:
      'https://placehold.co/600x450/dbeafe/1d4ed8?text=Sertifikat+Pedagogik+2022',
  },
];
