/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StatusPasangan = 'none' | 'istri' | 'suami';
export type MazhabKakek = 'jumhur' | 'hanafi';

export interface MawarisInputState {
  hartaKotor: number;
  biayaJenazah: number;
  hutang: number;
  wasiat: number;
  statusPasangan: StatusPasangan;
  jmlIstri: number;
  adaAyah: boolean;
  adaIbu: boolean;
  adaKakek: boolean;
  adaNenek: boolean;
  anakLaki: number;
  anakPerempuan: number;
  cucuLaki: number;
  cucuPerempuan: number;
  sdraLakiKandung: number;
  sdraPerempuanKandung: number;
  sdraLakiSeayah: number;
  sdraPerempuanSeayah: number;
  sdraSeibu: number;
  keponakanLakiKandung?: number; // Anak laki-laki saudara laki-laki kandung (Ibn Akh Syaqiq)
  keponakanLakiSeayah?: number; // Anak laki-laki saudara laki-laki seayah (Ibn Akh li Ab)
  pamanKandung?: number; // Paman kandung / saudara laki-laki kandung ayah ('Amm Syaqiq)
  pamanSeayah?: number; // Paman seayah / saudara laki-laki seayah ayah ('Amm li Ab)
  sepupuLakiKandung?: number; // Anak laki-laki paman kandung (Ibn 'Amm Syaqiq)
  sepupuLakiSeayah?: number; // Anak laki-laki paman seayah (Ibn 'Amm li Ab)
  mazhabKakek?: MazhabKakek; // 'jumhur' (Zaid bin Tsabit: Muqasamah/Tsuluts al-Baqi) atau 'hanafi' (Kakek menghalangi saudara)
}

export interface FaroidResultItem {
  name: string;
  count: number;
  ket: string;
  totalRupiah: number;
  perPersonRupiah: number;
  pct: string;
  badgeClass: string;
  saham?: string;
  jenisBagian?: string;
}

export interface MawarisCalculationOutput {
  hartaKotorVal: number;
  kewajibanTotal: number;
  wasiatIsCapped: boolean;
  tarakah: number;
  badgeStatus: string;
  totalPercentStr: string;
  results: FaroidResultItem[];
  mahjubNotes: string[];
  kasusKhusus?: string;
  asalMasalah?: number;
  tashihMasalah?: number;
  penjelasanSyari?: string[];
}
