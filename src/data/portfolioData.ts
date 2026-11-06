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
      "https://placehold.co/600x450/dcfce7/059669?text=Berbagi+Inovasi+Madrasah+2024",
  },
  {
    id: 5,
    title: "Anti Bullying di Madrasah",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Pusbangkom",
    year: "2024",
    date: "2024-05-03",
    dateLabel: "Mei 2024",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Pelatihan kompetensi guru dalam mengenali dan menangani kasus bullying serta kekerasan di lingkungan madrasah.",
    imageUrl: "1HMg0h7QSveR0FbffHLf9gjBWqxJKm1HR",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Anti+Bullying+2024",
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
      "https://placehold.co/600x450/dbeafe/1d4ed8?text=Sertifikat+TOAFL+2022",
  },
  {
    id: 7,
    title: "Pembelajaran Bahasa Arab Terkini",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Arabic Lingual Center",
    year: "2022",
    date: "2022-04-24",
    dateLabel: "Apr 2022",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Pelatihan kompetensi guru dalam mengembangkan metode pembelajaran bahasa Arab yang efektif dan inovatif di era digital.",
    imageUrl: "1YXUslc10cIkP5Xv9VkKbM3Td8C0z-Ewp",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Pembelajaran+Bahasa+Arab+Terkini+2022",
  },
  {
    id: 8,
    title: "Penyusunan Bahan Ajar Berbasis Media",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Pusbangkom",
    year: "2024",
    date: "2024-08-26",
    dateLabel: "Agt 2024",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Pelatihan kompetensi guru dalam menyusun bahan ajar berbasis media digital untuk meningkatkan kualitas pembelajaran di kelas.",
    imageUrl: "1pj6X0Nz8-U4-fgCjyF4Tqwx9LjQy3yAy",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Penyusunan+Bahan+Ajar+Berbasis+Media+2024",
  },
  {
    id: 9,
    title: "Membuat Proyek P5PPRA",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Pusbangkom",
    year: "2024",
    date: "2024-05-22",
    dateLabel: "Mei 2024",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Pelatihan kompetensi guru dalam menyusun proyek P5PPRA untuk meningkatkan kualitas pembelajaran di madrasah.",
    imageUrl: "15AX49qpK2aQ80yVjjXtw7BsH3D2Qpqku",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Membuat+Proyek+P5PPRA+2024",
  },
  {
    id: 10,
    title: "Penguatan Kurikulum KMA 450",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Kanwil Kemenag",
    year: "2024",
    date: "2024-07-27",
    dateLabel: "Jul 2024",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Pelatihan kompetensi guru dalam mengimplementasikan kurikulum KMA 450 untuk meningkatkan kualitas pembelajaran di madrasah.",
    imageUrl: "134lji-HtOslfrdCWDYYPCuFPmuPD-bdN",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Penguatan+Kurikulum+KMA+450+2024",
  },
  {
    id: 11,
    title: "Sharia Economic Festival",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "KSEI ",
    year: "2019",
    date: "2019-10-25",
    dateLabel: "Okt 2019",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Seminar Sharia Economic Festival bertujuan untuk meningkatkan pemahaman tentang ekonomi syariah dan peluang bisnis halal di Indonesia.",
    imageUrl: "1TWn59T0VXGh1ns3Im4yogO-BUG9Rrvbd",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Sharia+Economic+Festival+2019",
  },
  {
    id: 12,
    title: "Daurah Ilmiah Syari'ah",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Madinah Salam ",
    year: "2021",
    date: "2021-07-17",
    dateLabel: "Jul 2021",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Daurah Ilmiah Ilmu Syari'ah bertujuan untuk meningkatkan pemahaman tentang ilmu syariah dan penerapannya dalam kehidupan sehari-hari.",
    imageUrl: "1d1bwifBBuu25s8EqfKsN0kdF2A2LzY-d",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Daurah+Ilmiah+Syari'ah+2021",
  },
  {
    id: 13,
    title: "Implementasi KMA 183 dan 184",
    category: "akademik",
    categoryLabel: "Pelatihan",
    categoryBadgeClass: "bg-amber-100 text-amber-700",
    organizer: "Dirjen Pendis",
    year: "2020",
    date: "2020-11-07",
    dateLabel: "Nov 2020",
    yearBadgeClass: "bg-brand-600 text-white",
    description:
      "Pelatihan kompetensi guru dalam mengimplementasikan KMA 183 dan 184 untuk meningkatkan kualitas pembelajaran di madrasah.",
    imageUrl: "14SwtHlrkgDfp7HnWzX8swWvVpIafO-IL",
    fallbackUrl:
      "https://placehold.co/600x450/dcfce7/047857?text=Implementasi+KMA+183+dan+184+2020",
  },
];
