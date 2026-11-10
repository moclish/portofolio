/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExperienceItem {
  period: string;
  institution: string;
  role: string;
  subtitle: string;
  points: string[];
  bulletColorClass: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  subname: string;
  description: string;
  period: string;
  location: string;
  iconClass: string;
  iconBgClass: string;
  badgeBgClass: string;
}

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

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: "Juli 2023 – Saat Ini",
    institution: "MAS AL FURQON • Kalimantan Timur",
    role: "Guru Fikih Waris",
    subtitle: "Spesialis Bidang Syariah & Fikih Waris",
    points: [
      "Menyusun metode pembelajaran Fikih Waris yang disesuaikan dengan tingkat pemahaman santri Madrasah Aliyah.",
      "Mengembangkan alat bantu hitung pembagian waris berbasis logika praktis untuk mempermudah pemahaman perhitungan bagian Dzawil Furudh.",
      "Membimbing santri dalam kajian hukum Islam kontekstual dan penyelesaian problematika waris kemasyarakatan.",
    ],
    bulletColorClass: "text-brand-500",
  },
  {
    period: "Juli 2020 – Desember 2025",
    institution: "MAS AL FURQON • Kalimantan Timur",
    role: "Wakil Kepala Madrasah Bidang Akademik",
    subtitle: "Pengembang Mutu Pembelajaran & Kurikulum",
    points: [
      "Memimpin perencanaan, pelaksanaan, dan evaluasi kurikulum madrasah secara terstruktur selaras dengan standar Kementerian Agama dan Pondok Pesantren.",
      "Mengkoordinasikan supervisi akademik pengajar serta menyelenggarakan program peningkatan kompetensi digital guru.",
      "Berkontribusi dalam digitalisasi administrasi pembelajaran dan integrasi teknologi dalam kegiatan KBM harian.",
    ],
    bulletColorClass: "text-sunshine-500",
  },
  {
    period: "Januari 2020 – Juni 2023",
    institution: "MAS AL FURQON • Kalimantan Timur",
    role: "Guru Ushul & Kaidah Fikih",
    subtitle: "Pendidik Bidang Ushul & Kaidah Fikih",
    points: [
      "Menyusun metode pembelajaran Ushul & Kaidah Fikih yang disesuaikan dengan tingkat pemahaman santri Madrasah Aliyah.",
      "Mengembangkan metode pembelajaran Ushul & Kaidah Fikih yang inovatif dan efektif agar mudah dipahami.",
      "Membimbing santri dalam memahami konsep Ushul & Kaidah Fikih dan menerapkannya dalam kehidupan sehari-hari.",
    ],
    bulletColorClass: "text-sunshine-500",
  },
];

export const EDUCATION_HISTORY: EducationItem[] = [
  {
    degree: "Sarjana Syari'ah",
    institution: "LIPIA Jakarta",
    subname: "Lembaga Ilmu Pengetahuan Islam dan Arab",
    description:
      "Mendalami keilmuan Syariah Islamiyah, Fikih Perbandingan Mazhab, serta Bahasa Arab mulai dari jenjang I'dad, Takmili hingga Sarjana.",
    period: "Juli 2012 – Des 2019",
    location: "Jakarta",
    iconClass: "fa-university",
    iconBgClass: "bg-brand-100 text-brand-700",
    badgeBgClass: "bg-brand-50 text-brand-700",
  },
  {
    degree: "Diploma Bahasa Arab",
    institution: "LSIA Bogor",
    subname: "Lembaga Studi Islam dan Bahasa Arab",
    description:
      "Pendidikan persiapan dan pemantapan bahasa Arab dasar hingga menengah serta kaidah-kaidah ilmu syar'i dasar.",
    period: "Juli 2011 – Juni 2012",
    location: "Bogor",
    iconClass: "fa-book-open",
    iconBgClass: "bg-amber-100 text-amber-700",
    badgeBgClass: "bg-amber-50 text-amber-700",
  },
  {
    degree: "Madrasah Aliyah",
    institution: "MAS AL FURQON",
    subname: "Ilmu Pengetahuan Sosial",
    description:
      "Menyelesaikan pendidikan menengah atas dengan fokus pada dinamika sosial dan pondasi keislaman di Pondok Pesantren.",
    period: "Juli 2008 – Juni 2011",
    location: "Kalimantan Timur",
    iconClass: "fa-school",
    iconBgClass: "bg-blue-100 text-blue-700",
    badgeBgClass: "bg-blue-50 text-blue-700",
  },
];
