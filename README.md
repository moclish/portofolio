# ⚖️ Portofolio & Kalkulator Waris Syar'i

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

Website portofolio profesional dan **Sistem Simulasi Perhitungan Waris Interaktif** yang disusun oleh **Ust. Sadono, Lc** — Spesialis Fikih Waris.

Aplikasi ini menggabungkan ketepatan hukum fikih waris Islam berlandaskan Al-Qur'an, As-Sunnah, dan Ijma' Jumhur Ulama dengan antarmuka web modern yang estetik, responsif, dan mudah digunakan oleh masyarakat awam maupun praktisi hukum Islam.

---

## 🌟 Fitur Utama

### 1. 🧮 Mesin Kalkulator Waris Syar'i Komprehensif
* **Alur 4 Langkah (*Step Wizard*) Runtut:**
  1. **Harta & Kewajiban Mayyit:** Input total harta bruto, pemotongan biaya perawatan jenazah (*tajhiz al-janazah*), pelunasan hutang mayyit (*ad-duyun*), serta wasiat syar'i (maksimal $1/3$ dari harta bersih setelah jenazah dan hutang).
  2. **Pasangan & Orang Tua:** Suami/Istri (hingga 4 istri), Ayah Kandung, Ibu Kandung, Kakek (*Al-Jadd ash-Shahih*), dan Nenek (*Al-Jaddah*).
  3. **Keturunan (*Furu' Warits*):** Anak Laki-Laki, Anak Perempuan, Cucu Laki-Laki, dan Cucu Perempuan dari jalur anak laki-laki (*Bint Ibn*).
  4. **Saudara & Kerabat (*Hawasyi*):** Saudara Laki-Laki / Perempuan Kandung, Saudara Seayah, Saudara Seibu, Keponakan (*Ibn Akh*), Paman (*'Amm*), hingga Sepupu (*Ibn 'Amm*).

### 2. 📚 100% Keselarasan dengan Kaidah Faraidh Jumhur Ulama
Sistem kalkulasi (`src/utils/mawarisCalculator.ts`) dibangun berdasarkan fatwa dan kaidah resmi Jumhur Ulama (Madzhab Syafi'i, Maliki, Hanbali, dan Hanafi):
* **Ashabul Furudh:** Perhitungan presisi porsi fardh Qur'ani ($1/2$, $1/4$, $1/8$, $2/3$, $1/3$, $1/6$) menggunakan representasi pecahan eksak (*integer exact fractions*).
* **Kategori 'Ashabah Lengkap:**
  * *'Ashabah Binafsihi* (Anak laki-laki, ayah, saudara laki-laki, paman, dll.).
  * *'Ashabah Bil Ghair* (Nisbah $2:1$ antara anak laki & anak perempuan, cucu laki & cucu perempuan, saudara & saudari).
  * *'Ashabah Ma'al Ghair* (Saudara perempuan kandung/seayah bersama anak/cucu perempuan).
* **Kaidah Hajb Terotomatisasi:**
  * *Hajb Hirman* (gugur/terhalang total) terdeteksi secara realtime dengan notifikasi informatif.
  * *Hajb Nuqsan* (pengurangan porsi hak waris karena adanya ahli waris lain).

### 3. 🏛️ Penanganan Kasus-Kasus Khusus
* **Al-Gharrawain / Umariyyatain:** Fatwa Umar bin Khattab r.a. saat mayyit meninggalkan pasangan + Ibu + Ayah; Ibu mendapatkan $1/3$ sisa (*Thuluth al-Baqi*) agar nisbah Ayah tetap $2:1$.
* **Al-Musyarakah / Al-Himariyah / Al-Hajariyah:** Kasus persekutuan porsi $1/3$ antara saudara seibu dan saudara kandung saat harta fardh habis.
* **Al-Akdariyah:** Fatwa Zaid bin Tsabit r.a. saat Kakek ber-'aul bersama saudari perempuan (Asal masalah 6 di-'aul-kan ke 9 lalu ditashih ke 27).
* **Kakek Bersama Saudara (*Al-Jadd Ma'al Ikhwah*):** Mendukung pilihan madzhab Jumhur (Zaid bin Tsabit: Muqasamah / Tsuluts al-Baqi / Sudus al-Jami') serta Madzhab Hanafi.
* **Mas'alah 'Aul:** Otomatisasi penaikan Asal Masalah saat total saham melebihi harta ($6 \rightarrow 7, 8, 9, 10$; $12 \rightarrow 13, 15, 17$; $24 \rightarrow 27 / \text{Al-Minbariyah}$) dengan pengurangan proporsional yang adil.
* **Mas'alah Radd:** Pengembalian sisa harta secara proporsional kepada kerabat nasab (*Ashabul Furudh Nisbi*) dan mengecualikan pasangan sesuai mazhab jumhur sahabat (Ali bin Abi Thalib & Ibnu Mas'ud).
* **Tashih Mas'alah:** Pelurusan Asal Masalah bila terjadi *inkisar* (saham kelompok tidak habis dibagi jumlah orang).

### 4. 💼 Profil & Portofolio Ust. Sadono, Lc
* **Biografi & Kredensial:** Latar belakang pendidikan Syari'ah dan pengalaman mengajar fikih waris.
* **Portofolio :** Rekam jejak sertifikasi dan pelatihan yang pernah diikuti.
* **Layanan & Edukasi:** Konsultasi privat, kerjasama akademis, dan kelas intensif Faraidh.
* **Akses Kontak Cepat:** Integrasi WhatsApp langsung untuk pemesanan jadwal konsultasi.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [FontAwesome 6 Pro](https://fontawesome.com/) + [Lucide React](https://lucide.dev/) |
| **Animations & FX** | [Motion](https://motion.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Slider** | [Swiper.js](https://swiperjs.com/) |

---

## 🚀 Getting Started

### Prasyarat
* [Node.js](https://nodejs.org/) versi 18.0.0 atau lebih baru.
* Paket manajer `npm`, `pnpm`, atau `bun`.

### Instalasi & Menjalankan Lokal

1. **Clone repositori:**
   ```bash
   git clone https://github.com/moclish/portofolio.git
   cd portofolio
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal di `http://localhost:3000`.

4. **Check & Linting:**
   ```bash
   npm run lint
   ```

5. **Build untuk produksi:**
   ```bash
   npm run build
   ```
   Hasil build siap saji akan dibuat di direktori `dist/`.

---

## 📜 Lisensi & Atribusi

Proyek ini dilisensikan di bawah **Apache License 2.0**.  
Materi keilmuan waris merujuk pada literatur fikih klasik madzhab empat (*Al-Mughni*, *Raudhatut Thalibin*, *Bidayatul Mujtahid*, *Al-Faraidh ar-Rahabiyyah*) dan fatwa Majelis Tarjih/MUI.

---

## 📞 Konsultasi
Untuk konsultasi pembagian waris keluarga, kerjasama akademis atau lainnya, silakan hubungi melalui form kontak saya pada website ini.




