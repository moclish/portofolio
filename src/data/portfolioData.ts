/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioItem } from "../types/portfolio";

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
 *
 */
export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 1,
    title: "Santri Mahir Artificial Intelligence",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Pusbangkom",
    year: "2026",
    date: "2026-10-26",
    dateLabel: "Okt 2026",
    yearBadgeClass: "bg-emerald-600 text-white",
    description:
      "Sertifikasi kompetensi yang mencakup pemahaman dasar AI, penerapan AI dalam pendidikan, dan pengembangan keterampilan digital.",
    imageUrl: "1ogrPUshX6ktGkXDPLf41d2uX08xO85F3",
    fallbackUrl:
      "https://placehold.co/600x450/f0fdf4/047857?text=Santri+Mahir+AI+2026",
  },
  {
    id: 2,
    title: "Bangun Portofolio Digital",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Websis For Edu",
    year: "2026",
    date: "2026-10-30",
    dateLabel: "Okt 2026",
    yearBadgeClass: "bg-emerald-600 text-white",
    description:
      "Pelatihan kompetensi Bangun Portofolio Digital bagi guru dan pendidik untuk meningkatkan kemampuan digital dalam menyusun portofolio profesional.",
    imageUrl: "1qr2vjNzCT9YRGryA5F_5e4o_3PiyiDMO",
    fallbackUrl:
      "https://placehold.co/600x450/eff6ff/1d4ed8?text=Portofolio+Digital+2026",
  },
  {
    id: 3,
    title: "Certified Gemini Educator",
    category: "sertifikat",
    categoryLabel: "Sertifikasi",
    categoryBadgeClass: "bg-emerald-100 text-emerald-700",
    organizer: "Google Education",
    year: "2026",
    date: "2026-10-19",
    dateLabel: "Okt 2026",
    yearBadgeClass: "bg-emerald-600 text-white",
    description:
      "Sertifikasi kompetensi integrasi Artificial Intelligence (AI Gemini) dalam menyusun modul ajar, evaluasi otomatis, serta efisiensi KBM.",
    imageUrl: "1a48rEi_qDjOJMlc-lHMYVIc_glRk_MVt",
    fallbackUrl:
      "https://placehold.co/600x450/fef3c7/d97706?text=Gemini+Educator+2026",
  },
  {
    id: 4,
    title: "Berbagi Cerita Inovasi Madrasah",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Pusbangkom",
    year: "2024",
    date: "2024-05-17",
    dateLabel: "Mei 2024",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Pelatihan kompetensi guru dalam menyusun inovasi pembelajaran berbasis AI, serta berbagi pengalaman dan praktik terbaik di madrasah.",
    imageUrl: "1HiIlNMt_dtvfn826-15QrwDpnRXXmISU",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/059669?text=Pelatihan+Faroid+2024",
  },
  {
    id: 5,
    title: "Anti Bullying di Sekolah",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Pusbangkom",
    year: "2024",
    date: "2024-05-03",
    dateLabel: "Mei 2024",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Pelatihan kompetensi guru dalam mengenali dan menangani kasus bullying serta kekerasan di lingkungan sekolah.",
    imageUrl: "1HMg0h7QSveR0FbffHLf9gjBWqxJKm1HR",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Modul+Buku+Saku+2023",
  },
  {
    id: 6,
    title: "Sertifikasi TOAFL",
    category: "sertifikat",
    categoryLabel: "Sertifikasi",
    categoryBadgeClass: "bg-emerald-100 text-emerald-700",
    organizer: "Al-Azhar",
    year: "2021",
    date: "2021-04-11",
    dateLabel: "Apr 2021",
    yearBadgeClass: "bg-emerald-600 text-white",
    description:
      "Sertifikasi kompetensi bahasa Arab berdasarkan standar TOAFL yang diselenggarakan oleh Kursus Bahasa Arab Al-Azhar Kediri.",
    imageUrl: "1kktbnLyY2Q-lOB4Xvqp2GYdf5GkKiTfJ",
    fallbackUrl:
      "https://placehold.co/600x450/dbeafe/1d4ed8?text=Sertifikat+Pedagogik+2022",
  },
];
