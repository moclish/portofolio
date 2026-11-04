/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MawarisInputState,
  MawarisCalculationOutput,
  FaroidResultItem,
} from '../types/mawaris';

/**
 * FPB (Faktor Persekutuan Terbesar / GCD)
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * KPK (Kelipatan Persekutuan Terkecil / LCM)
 */
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Menghasilkan catatan Mahjub (Hajb Hirman & Hajb Nuqsan) sesuai kaidah Fikih Waris Jumhur Ulama.
 */
export function generateMahjubNotes(input: MawarisInputState): string[] {
  const notes: string[] = [];

  const {
    adaAyah,
    adaIbu,
    adaKakek,
    adaNenek,
    anakLaki,
    anakPerempuan,
    cucuLaki,
    cucuPerempuan,
    sdraLakiKandung,
    sdraPerempuanKandung,
    sdraLakiSeayah,
    sdraPerempuanSeayah,
    sdraSeibu,
    keponakanLakiKandung = 0,
    keponakanLakiSeayah = 0,
    pamanKandung = 0,
    pamanSeayah = 0,
    sepupuLakiKandung = 0,
    sepupuLakiSeayah = 0,
    mazhabKakek = 'jumhur',
  } = input;

  const hasMaleFuru = anakLaki > 0 || cucuLaki > 0;
  const hasFemaleFuru = anakPerempuan > 0 || cucuPerempuan > 0;
  const hasFuru = hasMaleFuru || hasFemaleFuru;

  // 1. Kakek
  if (adaAyah && adaKakek) {
    notes.push(
      '<strong>Kakek:</strong> Mahjub Hirman (terhalang total) oleh adanya Ayah Kandung.'
    );
  }

  // 2. Nenek
  if (adaIbu && adaNenek) {
    notes.push(
      '<strong>Nenek:</strong> Mahjub Hirman oleh adanya Ibu Kandung (berlaku untuk nenek pihak ibu maupun pihak ayah).'
    );
  } else if (adaAyah && adaNenek) {
    notes.push(
      '<strong>Catatan Nenek Pihak Ayah:</strong> Menurut jumhur, Nenek dari jalur ayah terhalang oleh Ayah, sedangkan Nenek dari jalur ibu tetap mewarisi 1/6.'
    );
  }

  // 3. Cucu
  if (anakLaki > 0) {
    if (cucuLaki > 0 || cucuPerempuan > 0) {
      notes.push(
        '<strong>Cucu Laki & Perempuan:</strong> Mahjub Hirman oleh adanya Anak Laki-Laki.'
      );
    }
  } else if (anakPerempuan >= 2 && cucuPerempuan > 0 && cucuLaki === 0) {
    notes.push(
      '<strong>Cucu Perempuan:</strong> Terhalang (Mahjub Hirman) karena porsi 2/3 anak perempuan telah genap diambil 2+ Anak Perempuan (dan tidak ada Cucu Laki-Laki sebagai <em>Al-Akh Al-Mubarak</em>).'
    );
  } else if (anakPerempuan >= 2 && cucuPerempuan > 0 && cucuLaki > 0) {
    notes.push(
      '<strong>Al-Akh Al-Mubarak (Cucu Laki-Laki):</strong> Keberadaan Cucu Laki-Laki menyelamatkan Cucu Perempuan menjadi <em>Ashabah Bil Ghair</em> (2:1), sehingga tidak terhalang oleh 2+ Anak Perempuan.'
    );
  }

  // 4. Saudara Seibu
  if (sdraSeibu > 0) {
    if (hasFuru) {
      notes.push(
        "<strong>Saudara/i Seibu:</strong> Mahjub Hirman oleh adanya Keturunan (Furu' Warits: Anak/Cucu laki-laki maupun perempuan)."
      );
    }
    if (adaAyah || adaKakek) {
      notes.push(
        '<strong>Saudara/i Seibu:</strong> Mahjub Hirman oleh Asl Mudzakkar (Ayah atau Kakek).'
      );
    }
  }

  // 5. Saudara Kandung & Seayah vs Furu' Laki-laki / Ayah / Kakek
  if (anakLaki > 0 || cucuLaki > 0) {
    notes.push(
      '<strong>Seluruh Saudara/i:</strong> Mahjub Hirman oleh adanya Anak Laki-Laki atau Cucu Laki-Laki.'
    );
  } else if (adaAyah) {
    notes.push(
      '<strong>Seluruh Saudara/i:</strong> Mahjub Hirman oleh adanya Ayah Kandung (ijma\' ulama).'
    );
  } else if (adaKakek) {
    if (mazhabKakek === 'hanafi') {
      notes.push(
        '<strong>Seluruh Saudara/i:</strong> Mahjub oleh Kakek (menurut Mazhab Hanafi / Abu Bakar r.a. yang mendudukkan kakek seperti ayah penuh).'
      );
    } else {
      notes.push(
        '<strong>Kakek Bersama Saudara (Jumhur Ulama):</strong> Menurut Mazhab Syafi\'i, Maliki, Hanbali (Zaid bin Tsabit r.a.), Kakek tidak menghalangi saudara kandung/seayah, melainkan berbagi waris secara <em>Muqasamah</em> atau <em>Tsuluts al-Baqi / Sudus</em>.'
      );
    }
  }

  // 6. Saudara Seayah vs Saudara Kandung
  const isSdraPrKandungAsabahMaalGhair =
    !hasMaleFuru &&
    !adaAyah &&
    !adaKakek &&
    sdraLakiKandung === 0 &&
    hasFemaleFuru &&
    sdraPerempuanKandung > 0;

  if (sdraLakiSeayah > 0 || sdraPerempuanSeayah > 0) {
    if (sdraLakiKandung > 0) {
      notes.push(
        '<strong>Saudara/i Seayah:</strong> Mahjub Hirman oleh adanya Saudara Laki-Laki Kandung (karena derajat kekerabatan dua arah lebih kuat).'
      );
    } else if (isSdraPrKandungAsabahMaalGhair) {
      notes.push(
        "<strong>Saudara/i Seayah:</strong> Mahjub Hirman oleh Saudara Perempuan Kandung yang telah menjadi <em>'Ashabah Ma'al Ghair</em> (bersama Anak/Cucu Perempuan, menduduki kekuatan saudara laki-laki kandung)."
      );
    } else if (sdraPerempuanKandung >= 2 && sdraPerempuanSeayah > 0 && sdraLakiSeayah === 0) {
      notes.push(
        '<strong>Saudara Perempuan Seayah:</strong> Mahjub Hirman karena porsi 2/3 saudari perempuan telah habis diambil oleh 2+ Saudara Perempuan Kandung (dan tidak ada Saudara Laki-Laki Seayah).'
      );
    }
  }

  // 7. Keponakan Laki-Laki (Anak Saudara)
  const isSdraPrSeayahAsabahMaalGhair =
    !hasMaleFuru &&
    !adaAyah &&
    !adaKakek &&
    sdraLakiKandung === 0 &&
    sdraPerempuanKandung === 0 &&
    sdraLakiSeayah === 0 &&
    hasFemaleFuru &&
    sdraPerempuanSeayah > 0;

  const isKeponakanKandungMahjub =
    hasMaleFuru ||
    adaAyah ||
    adaKakek ||
    sdraLakiKandung > 0 ||
    sdraLakiSeayah > 0 ||
    isSdraPrKandungAsabahMaalGhair ||
    isSdraPrSeayahAsabahMaalGhair;

  if (keponakanLakiKandung > 0 && isKeponakanKandungMahjub) {
    notes.push(
      '<strong>Anak Laki Sdr Kandung (Keponakan):</strong> Mahjub Hirman oleh keturunan/ushul laki-laki atau saudara laki-laki yang lebih dekat.'
    );
  }

  const isKeponakanSeayahMahjub =
    isKeponakanKandungMahjub || keponakanLakiKandung > 0;
  if (keponakanLakiSeayah > 0 && isKeponakanSeayahMahjub) {
    notes.push(
      '<strong>Anak Laki Sdr Seayah (Keponakan):</strong> Mahjub Hirman oleh keponakan kandung atau kerabat yang lebih kuat.'
    );
  }

  // 8. Paman (Saudara Ayah)
  const isPamanKandungMahjub =
    isKeponakanSeayahMahjub || keponakanLakiSeayah > 0;
  if (pamanKandung > 0 && isPamanKandungMahjub) {
    notes.push(
      '<strong>Paman Kandung:</strong> Mahjub Hirman oleh keturunan saudara (keponakan) atau kerabat yang lebih dekat.'
    );
  }

  const isPamanSeayahMahjub = isPamanKandungMahjub || pamanKandung > 0;
  if (pamanSeayah > 0 && isPamanSeayahMahjub) {
    notes.push(
      '<strong>Paman Seayah:</strong> Mahjub Hirman oleh Paman Kandung atau kerabat yang lebih dekat.'
    );
  }

  // 9. Sepupu (Anak Paman)
  const isSepupuKandungMahjub = isPamanSeayahMahjub || pamanSeayah > 0;
  if (sepupuLakiKandung > 0 && isSepupuKandungMahjub) {
    notes.push(
      '<strong>Anak Paman Kandung (Sepupu):</strong> Mahjub Hirman oleh Paman atau kerabat yang lebih dekat.'
    );
  }

  const isSepupuSeayahMahjub = isSepupuKandungMahjub || sepupuLakiKandung > 0;
  if (sepupuLakiSeayah > 0 && isSepupuSeayahMahjub) {
    notes.push(
      '<strong>Anak Paman Seayah (Sepupu):</strong> Mahjub Hirman oleh Sepupu Kandung atau kerabat yang lebih dekat.'
    );
  }

  return notes;
}

/**
 * Mesin kalkulasi Fikih Waris (Faroidh) Jumhur Ulama.
 * Mengakomodasi:
 * 1. Ashabul Furudh
 * 2. Asabah (Binafsihi, Bil Ghair 2:1, Ma'al Ghair)
 * 3. Kasus Khusus Umariyyatain (Gharrawain)
 * 4. Kasus Khusus Al-Musyarakah (Al-Himariyah / Al-Musytarakah / Al-Hajariyah)
 * 5. Kasus Khusus Al-Akdariyah
 * 6. Kakek bersama Saudara (Madzhab Zaid bin Tsabit / Jumhur vs Hanafi)
 * 7. 'Aul (penyebut naik proporsional)
 * 8. Radd (pengembalian sisa khusus kepada dzawil furudh nasab, mengecualikan suami/istri)
 * 9. Asal Masalah & Tashih Mas'alah
 */
export function calculateMawaris(
  input: MawarisInputState
): MawarisCalculationOutput {
  const {
    hartaKotor,
    biayaJenazah,
    hutang,
    wasiat,
    statusPasangan,
    jmlIstri,
    adaAyah,
    adaIbu,
    adaKakek,
    adaNenek,
    anakLaki,
    anakPerempuan,
    cucuLaki,
    cucuPerempuan,
    sdraLakiKandung,
    sdraPerempuanKandung,
    sdraLakiSeayah,
    sdraPerempuanSeayah,
    sdraSeibu,
    keponakanLakiKandung = 0,
    keponakanLakiSeayah = 0,
    pamanKandung = 0,
    pamanSeayah = 0,
    sepupuLakiKandung = 0,
    sepupuLakiSeayah = 0,
    mazhabKakek = 'jumhur',
  } = input;

  const kewajibanTotal = biayaJenazah + hutang;
  const sisaSebelumWasiat = Math.max(0, hartaKotor - kewajibanTotal);
  const maxWasiat = sisaSebelumWasiat / 3;
  const wasiatVal = Math.min(wasiat, maxWasiat);
  const wasiatIsCapped = wasiat > maxWasiat;
  const tarakah = Math.max(0, sisaSebelumWasiat - wasiatVal);
  const mahjubNotes = generateMahjubNotes(input);

  if (tarakah <= 0 || hartaKotor <= 0) {
    return {
      hartaKotorVal: hartaKotor,
      kewajibanTotal: kewajibanTotal + wasiatVal,
      wasiatIsCapped,
      tarakah: 0,
      badgeStatus: 'Kalkulasi Syari',
      totalPercentStr: '0% Terbagi',
      results: [],
      mahjubNotes,
    };
  }

  const effectiveJmlIstri = Math.min(4, Math.max(1, jmlIstri));
  const effectiveAdaKakek = !adaAyah && adaKakek;
  const effectiveAdaNenek = !adaIbu && adaNenek;

  const effectiveCucuLaki = anakLaki === 0 ? cucuLaki : 0;
  const effectiveCucuPerempuan = anakLaki === 0 ? cucuPerempuan : 0;

  const effHasMaleFuru = anakLaki > 0 || effectiveCucuLaki > 0;
  const effHasFemaleFuru = anakPerempuan > 0 || effectiveCucuPerempuan > 0;
  const effHasFuru = effHasMaleFuru || effHasFemaleFuru;

  const totalSaudaraRaw =
    sdraLakiKandung +
    sdraPerempuanKandung +
    sdraLakiSeayah +
    sdraPerempuanSeayah +
    sdraSeibu;

  // Saudara seibu terhalang oleh Furu' dan Asl Mudzakkar
  const effSdraSeibu =
    !effHasFuru && !adaAyah && !effectiveAdaKakek ? sdraSeibu : 0;

  // Cek Kasus Khusus 1: AL-GHARRAWAIN / UMARIYYATAIN
  const isUmariyyatain =
    statusPasangan !== 'none' &&
    adaIbu &&
    adaAyah &&
    !effHasFuru &&
    totalSaudaraRaw < 2 &&
    !effectiveAdaKakek &&
    !effectiveAdaNenek;

  if (isUmariyyatain) {
    const finalResults: FaroidResultItem[] = [];
    if (statusPasangan === 'istri') {
      const fracIstri = 1 / 4;
      const rIstri = fracIstri * tarakah;
      const labelIstri =
        effectiveJmlIstri > 1 ? `Istri (${effectiveJmlIstri} orang)` : 'Istri';
      finalResults.push({
        name: labelIstri,
        count: effectiveJmlIstri,
        ket: '1/4 (Fardh Umariyyatain)',
        totalRupiah: rIstri,
        perPersonRupiah: rIstri / effectiveJmlIstri,
        pct: '25.0',
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        saham: '1 / 4',
        jenisBagian: 'Fardh',
      });

      const sisaIstri = 3 / 4;
      const fracIbu = sisaIstri / 3; // 1/4 dari total
      const rIbu = fracIbu * tarakah;
      finalResults.push({
        name: 'Ibu Kandung',
        count: 1,
        ket: '1/3 Sisa Harta (Thuluth al-Baqi)',
        totalRupiah: rIbu,
        perPersonRupiah: rIbu,
        pct: '25.0',
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        saham: '1 / 4',
        jenisBagian: 'Thuluth al-Baqi',
      });

      const fracAyah = sisaIstri - fracIbu; // 1/2 dari total
      const rAyah = fracAyah * tarakah;
      finalResults.push({
        name: 'Ayah Kandung',
        count: 1,
        ket: 'Asabah Binafsihi (Sisa Harta)',
        totalRupiah: rAyah,
        perPersonRupiah: rAyah,
        pct: '50.0',
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        saham: '2 / 4',
        jenisBagian: 'Asabah Binafsihi',
      });
    } else {
      const fracSuami = 1 / 2;
      const rSuami = fracSuami * tarakah;
      finalResults.push({
        name: 'Suami',
        count: 1,
        ket: '1/2 (Fardh Umariyyatain)',
        totalRupiah: rSuami,
        perPersonRupiah: rSuami,
        pct: '50.0',
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        saham: '3 / 6',
        jenisBagian: 'Fardh',
      });

      const sisaSuami = 1 / 2;
      const fracIbu = sisaSuami / 3; // 1/6
      const rIbu = fracIbu * tarakah;
      finalResults.push({
        name: 'Ibu Kandung',
        count: 1,
        ket: '1/3 Sisa Harta (Thuluth al-Baqi)',
        totalRupiah: rIbu,
        perPersonRupiah: rIbu,
        pct: '16.7',
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        saham: '1 / 6',
        jenisBagian: 'Thuluth al-Baqi',
      });

      const fracAyah = sisaSuami - fracIbu; // 2/6 = 1/3
      const rAyah = fracAyah * tarakah;
      finalResults.push({
        name: 'Ayah Kandung',
        count: 1,
        ket: 'Asabah Binafsihi (Sisa Harta)',
        totalRupiah: rAyah,
        perPersonRupiah: rAyah,
        pct: '33.3',
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        saham: '2 / 6',
        jenisBagian: 'Asabah Binafsihi',
      });
    }

    return {
      hartaKotorVal: hartaKotor,
      kewajibanTotal: kewajibanTotal + wasiatVal,
      wasiatIsCapped,
      tarakah,
      badgeStatus: 'Kasus Khusus Umariyyatain',
      totalPercentStr: '100% Terbagi Pas',
      results: finalResults,
      mahjubNotes,
      kasusKhusus: 'Al-Gharrawain / Umariyyatain',
      asalMasalah: statusPasangan === 'istri' ? 4 : 6,
      penjelasanSyari: [
        'Kasus Gharrawain (Umariyyatain): Ibu mendapat 1/3 dari sisa setelah bagian pasangan (Thuluth al-Baqi).',
        'Hikmah Syar\'i: Agar bagian laki-laki (Ayah) tetap bernisbah 2:1 terhadap perempuan (Ibu) sesuai kaidah li adz-dzakari mitslu hazhzhi al-untsayain.',
      ],
    };
  }

  // Cek Kasus Khusus 2: AL-MUSYARAKAH / AL-HIMARIYAH / AL-HAJARIYAH
  // Syarat: Suami (1/2) + Ibu/Nenek (1/6) + Saudara Seibu >= 2 (1/3) + Saudara Laki-Laki Kandung >= 1 (Asabah)
  const isHimariyah =
    statusPasangan === 'suami' &&
    (adaIbu || effectiveAdaNenek) &&
    !effHasFuru &&
    !adaAyah &&
    !effectiveAdaKakek &&
    sdraSeibu >= 2 &&
    sdraLakiKandung >= 1;

  if (isHimariyah) {
    const finalResults: FaroidResultItem[] = [];
    const rSuami = (1 / 2) * tarakah;
    finalResults.push({
      name: 'Suami',
      count: 1,
      ket: '1/2 (Tanpa Keturunan)',
      totalRupiah: rSuami,
      perPersonRupiah: rSuami,
      pct: '50.0',
      badgeClass: 'bg-emerald-50/80 border-emerald-100',
      saham: '3 / 6',
      jenisBagian: 'Fardh',
    });

    const rIbu = (1 / 6) * tarakah;
    finalResults.push({
      name: adaIbu ? 'Ibu Kandung' : 'Nenek',
      count: 1,
      ket: '1/6 (Ada 2+ Saudara)',
      totalRupiah: rIbu,
      perPersonRupiah: rIbu,
      pct: '16.7',
      badgeClass: 'bg-emerald-50/80 border-emerald-100',
      saham: '1 / 6',
      jenisBagian: 'Fardh',
    });

    // Porsi 1/3 (2/6) diserikatkan antara Saudara Seibu dan Saudara Kandung
    const totalKepalaMusyarakah =
      sdraSeibu + sdraLakiKandung + sdraPerempuanKandung;
    const rMusyarakahTotal = (1 / 3) * tarakah;
    const rPerKepala = rMusyarakahTotal / totalKepalaMusyarakah;

    const rSeibu = rPerKepala * sdraSeibu;
    finalResults.push({
      name: `Saudara/i Seibu (${sdraSeibu} orang)`,
      count: sdraSeibu,
      ket: 'Bersekutu dalam 1/3 (Bagi rata per kepala)',
      totalRupiah: rSeibu,
      perPersonRupiah: rPerKepala,
      pct: ((rSeibu / tarakah) * 100).toFixed(1),
      badgeClass: 'bg-teal-50/80 border-teal-100',
      saham: `${sdraSeibu} bagian musyarakah`,
      jenisBagian: 'Musyarakah (Himariyah)',
    });

    const rSdrLakiK = rPerKepala * sdraLakiKandung;
    finalResults.push({
      name:
        sdraLakiKandung > 1
          ? `Saudara Laki-Laki Kandung (${sdraLakiKandung} orang)`
          : 'Saudara Laki-Laki Kandung',
      count: sdraLakiKandung,
      ket: 'Bersekutu dalam 1/3 (Kaidah Al-Himariyah)',
      totalRupiah: rSdrLakiK,
      perPersonRupiah: rPerKepala,
      pct: ((rSdrLakiK / tarakah) * 100).toFixed(1),
      badgeClass: 'bg-teal-50/80 border-teal-100',
      saham: `${sdraLakiKandung} bagian musyarakah`,
      jenisBagian: 'Musyarakah (Himariyah)',
    });

    if (sdraPerempuanKandung > 0) {
      const rSdrPrK = rPerKepala * sdraPerempuanKandung;
      finalResults.push({
        name:
          sdraPerempuanKandung > 1
            ? `Saudara Perempuan Kandung (${sdraPerempuanKandung} orang)`
            : 'Saudara Perempuan Kandung',
        count: sdraPerempuanKandung,
        ket: 'Bersekutu dalam 1/3 (Kaidah Al-Himariyah)',
        totalRupiah: rSdrPrK,
        perPersonRupiah: rPerKepala,
        pct: ((rSdrPrK / tarakah) * 100).toFixed(1),
        badgeClass: 'bg-teal-50/80 border-teal-100',
        saham: `${sdraPerempuanKandung} bagian musyarakah`,
        jenisBagian: 'Musyarakah (Himariyah)',
      });
    }

    return {
      hartaKotorVal: hartaKotor,
      kewajibanTotal: kewajibanTotal + wasiatVal,
      wasiatIsCapped,
      tarakah,
      badgeStatus: 'Kasus Khusus Musyarakah (Al-Himariyah)',
      totalPercentStr: '100% Terbagi Pas',
      results: finalResults,
      mahjubNotes,
      kasusKhusus: 'Al-Musyarakah / Al-Himariyah / Al-Hajariyah',
      asalMasalah: 6,
      tashihMasalah: 6 * totalKepalaMusyarakah,
      penjelasanSyari: [
        'Kasus Al-Himariyah (Al-Musytarakah / Al-Hajariyah): Fatwa Umar bin Khattab r.a. (diterima Madzhab Syafi\'i & Maliki).',
        'Karena porsi fardh (1/2 + 1/6 + 1/3 = 100%) menghabiskan seluruh harta, saudara kandung menggugat: "Wahai Amirul Mukminin, anggaplah ayah kami batu di laut / keledai (himar), bukankah ibu kami satu?".',
        'Maka saudara kandung diikutsertakan bersekutu bersama saudara seibu dalam porsi 1/3 dan dibagi rata per kepala.',
      ],
    };
  }

  // Cek Kasus Khusus 3: AL-AKDARIYAH
  // Syarat: Suami (1/2) + Ibu (1/3) + Kakek (1/6) + 1 Saudari Kandung/Seayah (1/2)
  const isAkdariyah =
    mazhabKakek === 'jumhur' &&
    statusPasangan === 'suami' &&
    adaIbu &&
    effectiveAdaKakek &&
    !adaAyah &&
    !effHasFuru &&
    sdraSeibu === 0 &&
    sdraLakiKandung === 0 &&
    sdraLakiSeayah === 0 &&
    (sdraPerempuanKandung === 1 ||
      (sdraPerempuanKandung === 0 && sdraPerempuanSeayah === 1));

  if (isAkdariyah) {
    const isKandung = sdraPerempuanKandung === 1;
    const finalResults: FaroidResultItem[] = [];

    // Asal Masalah 6 'Aul ke 9, di-Tashih x3 menjadi 27
    const rSuami = (9 / 27) * tarakah;
    finalResults.push({
      name: 'Suami',
      count: 1,
      ket: '3/9 di-tashih 9/27 (Fardh ter-\'Aul)',
      totalRupiah: rSuami,
      perPersonRupiah: rSuami,
      pct: '33.3',
      badgeClass: 'bg-amber-50/80 border-amber-200',
      saham: '9 / 27',
      jenisBagian: "Fardh 'Aul",
    });

    const rIbu = (6 / 27) * tarakah;
    finalResults.push({
      name: 'Ibu Kandung',
      count: 1,
      ket: '2/9 di-tashih 6/27 (Fardh ter-\'Aul)',
      totalRupiah: rIbu,
      perPersonRupiah: rIbu,
      pct: '22.2',
      badgeClass: 'bg-amber-50/80 border-amber-200',
      saham: '6 / 27',
      jenisBagian: "Fardh 'Aul",
    });

    // Kakek (1/9) + Saudari (3/9) = 4/9. Dikalikan 3 = 12/27. Kakek 8/27, Saudari 4/27 (2:1).
    const rKakek = (8 / 27) * tarakah;
    finalResults.push({
      name: 'Kakek',
      count: 1,
      ket: '8/27 (Kaidah Akdariyah, 2 bagian bersama Saudari)',
      totalRupiah: rKakek,
      perPersonRupiah: rKakek,
      pct: '29.6',
      badgeClass: 'bg-emerald-50/80 border-emerald-100',
      saham: '8 / 27',
      jenisBagian: 'Akdariyah (2:1)',
    });

    const rSaudari = (4 / 27) * tarakah;
    finalResults.push({
      name: isKandung
        ? 'Saudara Perempuan Kandung'
        : 'Saudara Perempuan Seayah',
      count: 1,
      ket: '4/27 (Kaidah Akdariyah, 1 bagian bersama Kakek)',
      totalRupiah: rSaudari,
      perPersonRupiah: rSaudari,
      pct: '14.8',
      badgeClass: 'bg-emerald-50/80 border-emerald-100',
      saham: '4 / 27',
      jenisBagian: 'Akdariyah (2:1)',
    });

    return {
      hartaKotorVal: hartaKotor,
      kewajibanTotal: kewajibanTotal + wasiatVal,
      wasiatIsCapped,
      tarakah,
      badgeStatus: 'Kasus Khusus Al-Akdariyah',
      totalPercentStr: '100% Terbagi Pas',
      results: finalResults,
      mahjubNotes,
      kasusKhusus: 'Al-Akdariyah (Tasyrih Zaid bin Tsabit)',
      asalMasalah: 6,
      tashihMasalah: 27,
      penjelasanSyari: [
        'Kasus Al-Akdariyah: Satu-satunya kasus di mana porsi fardh saudari perempuan di-\'aul-kan bersama kakek menurut Mazhab Zaid bin Tsabit / Syafi\'i.',
        'Asal masalah 6 ber-\'aul menjadi 9. Saham Kakek (1) dan Saudari (3) digabung menjadi 4, lalu ditashih x3 menjadi 27: Kakek mendapat 8/27, Saudari 4/27 (nisbah 2:1).',
      ],
    };
  }

  // LOGIKA UMUM ASHABUL FURUDH
  interface FardhEntry {
    name: string;
    count: number;
    frac: number;
    ket: string;
    isSpouse: boolean;
    jenisBagian?: string;
  }

  const fardhList: FardhEntry[] = [];
  let totalFardhFrac = 0;

  // 1. Pasangan
  if (statusPasangan === 'istri') {
    const frac = effHasFuru ? 1 / 8 : 1 / 4;
    const label =
      effectiveJmlIstri > 1 ? `Istri (${effectiveJmlIstri} orang)` : 'Istri';
    const ket = effHasFuru ? '1/8 (Ada Keturunan)' : '1/4 (Tanpa Keturunan)';
    fardhList.push({
      name: label,
      count: effectiveJmlIstri,
      frac,
      ket,
      isSpouse: true,
      jenisBagian: 'Fardh',
    });
    totalFardhFrac += frac;
  } else if (statusPasangan === 'suami') {
    const frac = effHasFuru ? 1 / 4 : 1 / 2;
    const ket = effHasFuru ? '1/4 (Ada Keturunan)' : '1/2 (Tanpa Keturunan)';
    fardhList.push({
      name: 'Suami',
      count: 1,
      frac,
      ket,
      isSpouse: true,
      jenisBagian: 'Fardh',
    });
    totalFardhFrac += frac;
  }

  // 2. Ibu / Nenek
  if (adaIbu) {
    const frac = effHasFuru || totalSaudaraRaw >= 2 ? 1 / 6 : 1 / 3;
    const ket =
      effHasFuru || totalSaudaraRaw >= 2
        ? '1/6 (Ada Keturunan / 2+ Sdr)'
        : '1/3 (Tanpa Keturunan & <2 Sdr)';
    fardhList.push({
      name: 'Ibu Kandung',
      count: 1,
      frac,
      ket,
      isSpouse: false,
      jenisBagian: 'Fardh',
    });
    totalFardhFrac += frac;
  } else if (effectiveAdaNenek) {
    const frac = 1 / 6;
    fardhList.push({
      name: 'Nenek',
      count: 1,
      frac,
      ket: '1/6 (Pengganti Ibu)',
      isSpouse: false,
      jenisBagian: 'Fardh',
    });
    totalFardhFrac += frac;
  }

  // 3. Ayah
  if (adaAyah) {
    if (effHasMaleFuru) {
      fardhList.push({
        name: 'Ayah Kandung',
        count: 1,
        frac: 1 / 6,
        ket: '1/6 (Ada Anak/Cucu Laki)',
        isSpouse: false,
        jenisBagian: 'Fardh Murni',
      });
      totalFardhFrac += 1 / 6;
    } else if (effHasFemaleFuru) {
      fardhList.push({
        name: 'Ayah Kandung',
        count: 1,
        frac: 1 / 6,
        ket: '1/6 (Fardh) + Sisa Asabah',
        isSpouse: false,
        jenisBagian: 'Fardh + Asabah',
      });
      totalFardhFrac += 1 / 6;
    }
    // Jika tanpa furu', Ayah murni Asabah Binafsihi (di-handle di asabah)
  }

  // 4. Kakek (Al-Jadd)
  // Periksa apakah kakek mewarisi Fardh atau bersama saudara (Jumhur)
  const isKakekWithSaudaraJumhur =
    effectiveAdaKakek &&
    mazhabKakek === 'jumhur' &&
    !effHasMaleFuru &&
    (sdraLakiKandung > 0 ||
      sdraPerempuanKandung > 0 ||
      sdraLakiSeayah > 0 ||
      sdraPerempuanSeayah > 0);

  if (effectiveAdaKakek && !isKakekWithSaudaraJumhur) {
    if (effHasMaleFuru) {
      fardhList.push({
        name: 'Kakek',
        count: 1,
        frac: 1 / 6,
        ket: '1/6 (Pengganti Ayah ada Furu Laki)',
        isSpouse: false,
        jenisBagian: 'Fardh Murni',
      });
      totalFardhFrac += 1 / 6;
    } else if (effHasFemaleFuru) {
      fardhList.push({
        name: 'Kakek',
        count: 1,
        frac: 1 / 6,
        ket: '1/6 (Fardh) + Sisa Asabah',
        isSpouse: false,
        jenisBagian: 'Fardh + Asabah',
      });
      totalFardhFrac += 1 / 6;
    }
  }

  // 5. Anak Perempuan
  if (anakLaki === 0) {
    if (anakPerempuan === 1) {
      fardhList.push({
        name: 'Anak Perempuan',
        count: 1,
        frac: 1 / 2,
        ket: '1/2 (Anak Tunggal)',
        isSpouse: false,
        jenisBagian: 'Fardh',
      });
      totalFardhFrac += 1 / 2;
    } else if (anakPerempuan >= 2) {
      fardhList.push({
        name: `Anak Perempuan (${anakPerempuan} orang)`,
        count: anakPerempuan,
        frac: 2 / 3,
        ket: `2/3 (Bagi rata ${anakPerempuan} orang)`,
        isSpouse: false,
        jenisBagian: 'Fardh',
      });
      totalFardhFrac += 2 / 3;
    }

    // 6. Cucu Perempuan (Bint Ibn)
    if (effectiveCucuLaki === 0) {
      if (anakPerempuan === 0) {
        if (effectiveCucuPerempuan === 1) {
          fardhList.push({
            name: 'Cucu Perempuan',
            count: 1,
            frac: 1 / 2,
            ket: '1/2 (Tanpa Anak Perempuan)',
            isSpouse: false,
            jenisBagian: 'Fardh',
          });
          totalFardhFrac += 1 / 2;
        } else if (effectiveCucuPerempuan >= 2) {
          fardhList.push({
            name: `Cucu Perempuan (${effectiveCucuPerempuan} orang)`,
            count: effectiveCucuPerempuan,
            frac: 2 / 3,
            ket: `2/3 (Bagi rata ${effectiveCucuPerempuan} orang)`,
            isSpouse: false,
            jenisBagian: 'Fardh',
          });
          totalFardhFrac += 2 / 3;
        }
      } else if (anakPerempuan === 1 && effectiveCucuPerempuan > 0) {
        // Takmilatan lis-tsulutsain (pelengkap 2/3)
        fardhList.push({
          name:
            effectiveCucuPerempuan > 1
              ? `Cucu Perempuan (${effectiveCucuPerempuan} orang)`
              : 'Cucu Perempuan',
          count: effectiveCucuPerempuan,
          frac: 1 / 6,
          ket: '1/6 (Pelengkap 2/3 bersama 1 Anak Perempuan)',
          isSpouse: false,
          jenisBagian: 'Fardh (Takmilatan)',
        });
        totalFardhFrac += 1 / 6;
      }
    }
  }

  // 7. Saudara Seibu (Akh / Ukht li Umm)
  if (effSdraSeibu > 0) {
    const frac = effSdraSeibu === 1 ? 1 / 6 : 1 / 3;
    const ket =
      effSdraSeibu === 1
        ? '1/6 (Saudara Seibu Tunggal)'
        : `1/3 (Bagi rata ${effSdraSeibu} orang sama rata laki & perempuan)`;
    const nameLabel =
      effSdraSeibu === 1
        ? 'Saudara/i Seibu'
        : `Saudara/i Seibu (${effSdraSeibu} orang)`;
    fardhList.push({
      name: nameLabel,
      count: effSdraSeibu,
      frac,
      ket,
      isSpouse: false,
      jenisBagian: 'Fardh',
    });
    totalFardhFrac += frac;
  }

  // 8. Saudara Perempuan Kandung & Seayah (Fardh murni saat tidak ada ashabah / kakek jumhur)
  const isSaudaraMahjubByKakekHanafi = effectiveAdaKakek && mazhabKakek === 'hanafi';

  if (
    !effHasFuru &&
    !adaAyah &&
    !isKakekWithSaudaraJumhur &&
    !isSaudaraMahjubByKakekHanafi
  ) {
    if (sdraLakiKandung === 0) {
      if (sdraPerempuanKandung === 1) {
        fardhList.push({
          name: 'Saudara Perempuan Kandung',
          count: 1,
          frac: 1 / 2,
          ket: '1/2 (Saudari Kandung Tunggal)',
          isSpouse: false,
          jenisBagian: 'Fardh',
        });
        totalFardhFrac += 1 / 2;
      } else if (sdraPerempuanKandung >= 2) {
        fardhList.push({
          name: `Saudara Perempuan Kandung (${sdraPerempuanKandung} orang)`,
          count: sdraPerempuanKandung,
          frac: 2 / 3,
          ket: `2/3 (Bagi rata ${sdraPerempuanKandung} orang)`,
          isSpouse: false,
          jenisBagian: 'Fardh',
        });
        totalFardhFrac += 2 / 3;
      }

      if (sdraLakiSeayah === 0) {
        if (sdraPerempuanKandung === 0) {
          if (sdraPerempuanSeayah === 1) {
            fardhList.push({
              name: 'Saudara Perempuan Seayah',
              count: 1,
              frac: 1 / 2,
              ket: '1/2 (Saudari Seayah Tunggal)',
              isSpouse: false,
              jenisBagian: 'Fardh',
            });
            totalFardhFrac += 1 / 2;
          } else if (sdraPerempuanSeayah >= 2) {
            fardhList.push({
              name: `Saudara Perempuan Seayah (${sdraPerempuanSeayah} orang)`,
              count: sdraPerempuanSeayah,
              frac: 2 / 3,
              ket: `2/3 (Bagi rata ${sdraPerempuanSeayah} orang)`,
              isSpouse: false,
              jenisBagian: 'Fardh',
            });
            totalFardhFrac += 2 / 3;
          }
        } else if (sdraPerempuanKandung === 1 && sdraPerempuanSeayah > 0) {
          // Takmilatan lis-tsulutsain
          fardhList.push({
            name:
              sdraPerempuanSeayah > 1
                ? `Saudara Perempuan Seayah (${sdraPerempuanSeayah} orang)`
                : 'Saudara Perempuan Seayah',
            count: sdraPerempuanSeayah,
            frac: 1 / 6,
            ket: '1/6 (Pelengkap 2/3 bersama 1 Saudari Kandung)',
            isSpouse: false,
            jenisBagian: 'Fardh (Takmilatan)',
          });
          totalFardhFrac += 1 / 6;
        }
      }
    }
  }

  // PENENTUAN KANDIDAT ASABAH
  interface AsabahConfig {
    type: string;
    countL: number;
    countP: number;
    nameL: string;
    nameP: string;
    jenis: string;
  }

  let asabahCandidate: AsabahConfig | null = null;

  if (anakLaki > 0) {
    asabahCandidate = {
      type: 'ANAK',
      countL: anakLaki,
      countP: anakPerempuan,
      nameL: 'Anak Laki-Laki',
      nameP: 'Anak Perempuan',
      jenis: anakPerempuan > 0 ? 'Asabah Bil Ghair' : 'Asabah Binafsihi',
    };
  } else if (effectiveCucuLaki > 0) {
    asabahCandidate = {
      type: 'CUCU',
      countL: effectiveCucuLaki,
      countP: effectiveCucuPerempuan,
      nameL: 'Cucu Laki-Laki',
      nameP: 'Cucu Perempuan',
      jenis:
        effectiveCucuPerempuan > 0 ? 'Asabah Bil Ghair' : 'Asabah Binafsihi',
    };
  } else if (adaAyah && !effHasMaleFuru) {
    asabahCandidate = {
      type: 'AYAH',
      countL: 1,
      countP: 0,
      nameL: 'Ayah Kandung',
      nameP: '',
      jenis: 'Asabah Binafsihi',
    };
  } else if (effectiveAdaKakek && (isSaudaraMahjubByKakekHanafi || !isKakekWithSaudaraJumhur)) {
    if (!effHasMaleFuru) {
      asabahCandidate = {
        type: 'KAKEK',
        countL: 1,
        countP: 0,
        nameL: 'Kakek',
        nameP: '',
        jenis: 'Asabah Binafsihi',
      };
    }
  } else if (!effHasMaleFuru && !adaAyah && !effectiveAdaKakek) {
    if (sdraLakiKandung > 0) {
      asabahCandidate = {
        type: 'SDRA_KANDUNG',
        countL: sdraLakiKandung,
        countP: sdraPerempuanKandung,
        nameL: 'Saudara Laki-Laki Kandung',
        nameP: 'Saudara Perempuan Kandung',
        jenis:
          sdraPerempuanKandung > 0 ? 'Asabah Bil Ghair' : 'Asabah Binafsihi',
      };
    } else if (effHasFemaleFuru && sdraPerempuanKandung > 0) {
      asabahCandidate = {
        type: 'SDRA_PR_MAAL_GHAIR',
        countL: 0,
        countP: sdraPerempuanKandung,
        nameL: '',
        nameP: 'Saudara Perempuan Kandung',
        jenis: "Asabah Ma'al Ghair",
      };
    } else if (sdraLakiSeayah > 0) {
      asabahCandidate = {
        type: 'SDRA_SEAYAH',
        countL: sdraLakiSeayah,
        countP: sdraPerempuanSeayah,
        nameL: 'Saudara Laki-Laki Seayah',
        nameP: 'Saudara Perempuan Seayah',
        jenis:
          sdraPerempuanSeayah > 0 ? 'Asabah Bil Ghair' : 'Asabah Binafsihi',
      };
    } else if (
      effHasFemaleFuru &&
      sdraPerempuanSeayah > 0 &&
      sdraPerempuanKandung === 0
    ) {
      asabahCandidate = {
        type: 'SDRA_PR_SEAYAH_MAAL_GHAIR',
        countL: 0,
        countP: sdraPerempuanSeayah,
        nameL: '',
        nameP: 'Saudara Perempuan Seayah',
        jenis: "Asabah Ma'al Ghair",
      };
    } else if (keponakanLakiKandung > 0) {
      asabahCandidate = {
        type: 'KEPONAKAN_KANDUNG',
        countL: keponakanLakiKandung,
        countP: 0,
        nameL: 'Anak Laki Sdr Kandung (Keponakan)',
        nameP: '',
        jenis: 'Asabah Binafsihi',
      };
    } else if (keponakanLakiSeayah > 0) {
      asabahCandidate = {
        type: 'KEPONAKAN_SEAYAH',
        countL: keponakanLakiSeayah,
        countP: 0,
        nameL: 'Anak Laki Sdr Seayah (Keponakan)',
        nameP: '',
        jenis: 'Asabah Binafsihi',
      };
    } else if (pamanKandung > 0) {
      asabahCandidate = {
        type: 'PAMAN_KANDUNG',
        countL: pamanKandung,
        countP: 0,
        nameL: 'Paman Kandung (Sdr Ayah)',
        nameP: '',
        jenis: 'Asabah Binafsihi',
      };
    } else if (pamanSeayah > 0) {
      asabahCandidate = {
        type: 'PAMAN_SEAYAH',
        countL: pamanSeayah,
        countP: 0,
        nameL: 'Paman Seayah (Sdr Ayah)',
        nameP: '',
        jenis: 'Asabah Binafsihi',
      };
    } else if (sepupuLakiKandung > 0) {
      asabahCandidate = {
        type: 'SEPUPU_KANDUNG',
        countL: sepupuLakiKandung,
        countP: 0,
        nameL: 'Anak Laki Paman Kandung (Sepupu)',
        nameP: '',
        jenis: 'Asabah Binafsihi',
      };
    } else if (sepupuLakiSeayah > 0) {
      asabahCandidate = {
        type: 'SEPUPU_SEAYAH',
        countL: sepupuLakiSeayah,
        countP: 0,
        nameL: 'Anak Laki Paman Seayah (Sepupu)',
        nameP: '',
        jenis: 'Asabah Binafsihi',
      };
    }
  }

  const finalResults: FaroidResultItem[] = [];
  let badgeStatus = 'Kalkulasi Syari';
  let totalPercentStr = '100% Terbagi Pas';
  let kasusKhususName: string | undefined;
  const penjelasanSyariList: string[] = [];

  // Hitung Asal Masalah dasar dari fardhList
  let calcAsalMasalah = 1;
  fardhList.forEach((item) => {
    // Estimasi penyebut (misal 1/8 -> 8, 1/6 -> 6, 2/3 -> 3, 1/4 -> 4)
    const den = Math.round(1 / item.frac) || (Math.round(2 / item.frac) === 3 ? 3 : 1);
    calcAsalMasalah = lcm(calcAsalMasalah, den);
  });
  if (calcAsalMasalah === 1) {
    if (asabahCandidate) {
      const parts = asabahCandidate.countL * 2 + asabahCandidate.countP * 1;
      calcAsalMasalah = asabahCandidate.countP > 0 ? parts : (asabahCandidate.countL > 0 ? asabahCandidate.countL : 1);
      if (calcAsalMasalah === 0) calcAsalMasalah = 1;
    } else {
      calcAsalMasalah = 1;
    }
  }

  // PENANGANAN KHUSUS KAKEK DENGAN SAUDARA (JUMHUR / ZAID BIN TSABIT)
  if (isKakekWithSaudaraJumhur) {
    kasusKhususName = 'Al-Jadd Ma\'a Al-Ikhwah (Zaid bin Tsabit / Jumhur)';
    badgeStatus = 'Kakek Bersama Saudara (Jumhur)';
    penjelasanSyariList.push(
      'Menurut Jumhur Ulama (Madzhab Syafi\'i, Maliki, Hanbali): Kakek tidak menghalangi saudara kandung/seayah, melainkan berbagi sisa secara Muqasamah / Tsuluts al-Baqi.'
    );

    // Bagian Fardh yang sudah ada (Suami/Istri, Ibu/Nenek, Anak Perempuan jika ada)
    const sisaSetelahFardhFrac = Math.max(0, 1 - totalFardhFrac);
    const sisaSetelahFardhRupiah = sisaSetelahFardhFrac * tarakah;

    // Evaluasi 3 opsi terbaik untuk kakek:
    // Opsi 1: Muqasamah
    const totalSaudaraL = sdraLakiKandung > 0 ? sdraLakiKandung : sdraLakiSeayah;
    const totalSaudaraP = sdraLakiKandung > 0 ? sdraPerempuanKandung : sdraPerempuanSeayah;
    const partsMuqasamah = 2 + (totalSaudaraL * 2 + totalSaudaraP * 1);
    const kakekShareMuqasamahFrac = (2 / partsMuqasamah) * sisaSetelahFardhFrac;

    // Opsi 2: 1/3 dari sisa (Tsuluts al-Baqi)
    const kakekShareTsulutsBaqiFrac = (1 / 3) * sisaSetelahFardhFrac;

    // Opsi 3: 1/6 dari seluruh harta (Sudus al-Jami')
    const kakekShareSudusFrac = 1 / 6;

    let kakekBestFrac = Math.max(
      kakekShareMuqasamahFrac,
      kakekShareTsulutsBaqiFrac,
      kakekShareSudusFrac
    );
    let kakekMethodLabel = 'Muqasamah (Berbagi Sisa)';
    if (kakekBestFrac === kakekShareTsulutsBaqiFrac) {
      kakekMethodLabel = '1/3 Sisa Harta (Tsuluts al-Baqi)';
    } else if (kakekBestFrac === kakekShareSudusFrac) {
      kakekMethodLabel = '1/6 Harta Utuh (Batas Minimum Kakek)';
    }

    // Render Ashabul Furudh yang ada
    fardhList.forEach((item) => {
      const r = item.frac * tarakah;
      finalResults.push({
        name: item.name,
        count: item.count,
        ket: item.ket,
        totalRupiah: r,
        perPersonRupiah: r / item.count,
        pct: ((r / tarakah) * 100).toFixed(1),
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        saham: `${Math.round(item.frac * calcAsalMasalah)} / ${calcAsalMasalah}`,
        jenisBagian: item.jenisBagian || 'Fardh',
      });
    });

    // Bagian Kakek
    const rKakek = kakekBestFrac * tarakah;
    finalResults.push({
      name: 'Kakek',
      count: 1,
      ket: `${kakekMethodLabel} (Pilihan Terbaik / Ahazz)`,
      totalRupiah: rKakek,
      perPersonRupiah: rKakek,
      pct: ((rKakek / tarakah) * 100).toFixed(1),
      badgeClass: 'bg-teal-50/80 border-teal-100',
      saham: 'Ahazz al-Hazzain',
      jenisBagian: 'Kakek ma\'a al-Ikhwah',
    });

    // Sisa untuk saudara
    const sisaSaudaraRupiah = Math.max(0, sisaSetelahFardhRupiah - rKakek);
    const totalPartsSaudara = totalSaudaraL * 2 + totalSaudaraP * 1;
    const unitSdr = totalPartsSaudara > 0 ? sisaSaudaraRupiah / totalPartsSaudara : 0;

    const isKandung = sdraLakiKandung > 0 || sdraPerempuanKandung > 0;
    const nameSdrL = isKandung ? 'Saudara Laki-Laki Kandung' : 'Saudara Laki-Laki Seayah';
    const nameSdrP = isKandung ? 'Saudara Perempuan Kandung' : 'Saudara Perempuan Seayah';

    if (totalSaudaraL > 0) {
      const rL = unitSdr * 2 * totalSaudaraL;
      finalResults.push({
        name: totalSaudaraL > 1 ? `${nameSdrL} (${totalSaudaraL} orang)` : nameSdrL,
        count: totalSaudaraL,
        ket: 'Sisa bersama Kakek (Nisbah 2:1)',
        totalRupiah: rL,
        perPersonRupiah: rL / totalSaudaraL,
        pct: ((rL / tarakah) * 100).toFixed(1),
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        jenisBagian: 'Muqasamah Sisa',
      });
    }

    if (totalSaudaraP > 0) {
      const rP = unitSdr * 1 * totalSaudaraP;
      finalResults.push({
        name: totalSaudaraP > 1 ? `${nameSdrP} (${totalSaudaraP} orang)` : nameSdrP,
        count: totalSaudaraP,
        ket: 'Sisa bersama Kakek (Nisbah 1:2)',
        totalRupiah: rP,
        perPersonRupiah: rP / totalSaudaraP,
        pct: ((rP / tarakah) * 100).toFixed(1),
        badgeClass: 'bg-emerald-50/80 border-emerald-100',
        jenisBagian: 'Muqasamah Sisa',
      });
    }
  } else if (totalFardhFrac > 1) {
    // TERJADI 'AUL (Porsi Fardh melebihi 100%)
    badgeStatus = "Terjadi 'Aul (Fardh > 100%)";
    totalPercentStr = "100% Terbagi ('Aul)";
    kasusKhususName = "Mas'alah 'Aul";
    const aulAsalMasalah = Math.round(calcAsalMasalah * totalFardhFrac);

    penjelasanSyariList.push(
      `Terjadi 'Aul: Total fardh (${(totalFardhFrac * 100).toFixed(1)}%) melebihi 100%. Asal masalah dinaikkan dari ${calcAsalMasalah} menjadi ${aulAsalMasalah}. Seluruh porsi ahli waris berkurang secara proporsional dan adil.`
    );

    if (asabahCandidate) {
      penjelasanSyariList.push(
        `Kerabat asabah (${asabahCandidate.nameL || asabahCandidate.nameP}) tidak mendapatkan bagian karena seluruh harta telah habis terbagi kepada Ashabul Furudh.`
      );
    }

    fardhList.forEach((item) => {
      const scaledFrac = item.frac / totalFardhFrac;
      const rTotal = scaledFrac * tarakah;
      const pct = (scaledFrac * 100).toFixed(1);
      const siham = Math.round(item.frac * calcAsalMasalah);

      finalResults.push({
        name: item.name,
        count: item.count,
        ket: `${item.ket} • Ter-'Aul`,
        totalRupiah: rTotal,
        perPersonRupiah: rTotal / item.count,
        pct,
        badgeClass: 'bg-amber-50/80 border-amber-200',
        saham: `${siham} / ${aulAsalMasalah}`,
        jenisBagian: "Fardh 'Aul",
      });
    });
  } else {
    // TOTAL FARDH <= 1
    const sisaFrac = 1 - totalFardhFrac;

    if (sisaFrac > 0.0001 && asabahCandidate) {
      // ADA ASABAH MENGAMBIL SISA
      badgeStatus = 'Kalkulasi Syari (Fardh + Asabah)';
      totalPercentStr = '100% Terbagi Pas';

      let extraAyahSisa = 0;
      let extraKakekSisa = 0;
      const totalParts =
        asabahCandidate.countL * 2 + asabahCandidate.countP * 1;
      const sisaRupiah = sisaFrac * tarakah;
      const unitRupiah = totalParts > 0 ? sisaRupiah / totalParts : 0;

      if (asabahCandidate.type === 'AYAH') extraAyahSisa = sisaRupiah;
      if (asabahCandidate.type === 'KAKEK') extraKakekSisa = sisaRupiah;

      const totalSihamFardh = fardhList.reduce(
        (acc, it) => acc + Math.round(it.frac * calcAsalMasalah),
        0
      );
      const sihamSisa = Math.max(0, calcAsalMasalah - totalSihamFardh);

      fardhList.forEach((item) => {
        let rTotal = item.frac * tarakah;
        const ket = item.ket;

        if (item.name.includes('Ayah Kandung') && extraAyahSisa > 0) {
          rTotal += extraAyahSisa;
          extraAyahSisa = 0;
        } else if (item.name.includes('Kakek') && extraKakekSisa > 0) {
          rTotal += extraKakekSisa;
          extraKakekSisa = 0;
        }
        const pct = ((rTotal / tarakah) * 100).toFixed(1);
        finalResults.push({
          name: item.name,
          count: item.count,
          ket,
          totalRupiah: rTotal,
          perPersonRupiah: rTotal / item.count,
          pct,
          badgeClass: 'bg-emerald-50/80 border-emerald-100',
          saham: `${Math.round(item.frac * calcAsalMasalah)} / ${calcAsalMasalah}`,
          jenisBagian: item.jenisBagian || 'Fardh',
        });
      });

      if (extraAyahSisa > 0) {
        const pct = ((extraAyahSisa / tarakah) * 100).toFixed(1);
        finalResults.push({
          name: 'Ayah Kandung',
          count: 1,
          ket: 'Asabah Binafsihi (Seluruh Sisa Harta)',
          totalRupiah: extraAyahSisa,
          perPersonRupiah: extraAyahSisa,
          pct,
          badgeClass: 'bg-emerald-50/80 border-emerald-100',
          saham: `${calcAsalMasalah} / ${calcAsalMasalah} (Sisa Asabah)`,
          jenisBagian: 'Asabah Binafsihi',
        });
      } else if (extraKakekSisa > 0) {
        const pct = ((extraKakekSisa / tarakah) * 100).toFixed(1);
        finalResults.push({
          name: 'Kakek',
          count: 1,
          ket: 'Asabah Binafsihi (Pengganti Ayah)',
          totalRupiah: extraKakekSisa,
          perPersonRupiah: extraKakekSisa,
          pct,
          badgeClass: 'bg-emerald-50/80 border-emerald-100',
          saham: `${calcAsalMasalah} / ${calcAsalMasalah} (Sisa Asabah)`,
          jenisBagian: 'Asabah Binafsihi',
        });
      }

      if (
        !['AYAH', 'KAKEK'].includes(asabahCandidate.type) &&
        totalParts > 0
      ) {
        if (asabahCandidate.countL > 0) {
          const valL = unitRupiah * 2 * asabahCandidate.countL;
          const pctL = ((valL / tarakah) * 100).toFixed(1);
          const labelL =
            asabahCandidate.countL > 1
              ? `${asabahCandidate.nameL} (${asabahCandidate.countL} orang)`
              : asabahCandidate.nameL;
          const ketL =
            asabahCandidate.countP > 0
              ? 'Asabah Bil Ghair (Nisbah 2:1 Pria)'
              : 'Asabah Binafsihi (Seluruh Sisa)';
          const sahamL =
            fardhList.length === 0
              ? `${asabahCandidate.countL} / ${calcAsalMasalah}`
              : asabahCandidate.countP > 0
              ? `${Math.round((sihamSisa * (asabahCandidate.countL * 2)) / totalParts)} / ${calcAsalMasalah}`
              : `${sihamSisa} / ${calcAsalMasalah}`;

          finalResults.push({
            name: labelL,
            count: asabahCandidate.countL,
            ket: ketL,
            totalRupiah: valL,
            perPersonRupiah: valL / asabahCandidate.countL,
            pct: pctL,
            badgeClass: 'bg-emerald-50/80 border-emerald-100',
            saham: sahamL,
            jenisBagian: asabahCandidate.jenis,
          });
        }
        if (asabahCandidate.countP > 0) {
          const valP = unitRupiah * 1 * asabahCandidate.countP;
          const pctP = ((valP / tarakah) * 100).toFixed(1);
          const labelP =
            asabahCandidate.countP > 1
              ? `${asabahCandidate.nameP} (${asabahCandidate.countP} orang)`
              : asabahCandidate.nameP;
          const ketP =
            asabahCandidate.countL > 0
              ? 'Asabah Bil Ghair (Nisbah 1:2 Wanita)'
              : "Asabah Ma'al Ghair (Bersama Keturunan Perempuan)";
          const sahamP =
            asabahCandidate.countL > 0
              ? `${Math.round((sihamSisa * (asabahCandidate.countP * 1)) / totalParts)} / ${calcAsalMasalah}`
              : `${sihamSisa} / ${calcAsalMasalah}`;

          finalResults.push({
            name: labelP,
            count: asabahCandidate.countP,
            ket: ketP,
            totalRupiah: valP,
            perPersonRupiah: valP / asabahCandidate.countP,
            pct: pctP,
            badgeClass: 'bg-emerald-50/80 border-emerald-100',
            saham: sahamP,
            jenisBagian: asabahCandidate.jenis,
          });
        }
      }
    } else if (sisaFrac > 0.0001 && fardhList.length > 0) {
      // TERJADI RADD (Sisa dikembalikan kepada dzawil furudh nasab, mengecualikan pasangan)
      badgeStatus = 'Terjadi Radd (Sisa Dikembalikan)';
      totalPercentStr = '100% Terbagi (Radd)';
      kasusKhususName = "Mas'alah Radd";

      penjelasanSyariList.push(
        'Kaidah Radd Jumhur Ulama (Ali bin Abi Thalib, Ibnu Mas\'ud, Mazhab Hanafi & Hanbali): Karena tidak ada ashabah, sisa harta dikembalikan proporsional kepada kerabat nasab, dan Suami/Istri tidak mendapatkan radd.'
      );

      const spouseItem = fardhList.find((i) => i.isSpouse);
      const nonSpouseItems = fardhList.filter((i) => !i.isSpouse);

      let nonSpouseTotalFardh = 0;
      nonSpouseItems.forEach((i) => (nonSpouseTotalFardh += i.frac));

      let spouseRupiah = 0;
      if (spouseItem) {
        spouseRupiah = spouseItem.frac * tarakah;
        const pct = (spouseItem.frac * 100).toFixed(1);
        finalResults.push({
          name: spouseItem.name,
          count: spouseItem.count,
          ket: `${spouseItem.ket} (Fardh Tanpa Radd)`,
          totalRupiah: spouseRupiah,
          perPersonRupiah: spouseRupiah / spouseItem.count,
          pct,
          badgeClass: 'bg-warmbg border-gray-100',
          saham: `${Math.round(spouseItem.frac * calcAsalMasalah)} / ${calcAsalMasalah}`,
          jenisBagian: 'Fardh (Tanpa Radd)',
        });
      }

      const sisaRaddRupiah = tarakah - spouseRupiah;
      nonSpouseItems.forEach((item) => {
        const scaledFrac =
          nonSpouseTotalFardh > 0
            ? item.frac / nonSpouseTotalFardh
            : 1 / nonSpouseItems.length;
        const rTotal = scaledFrac * sisaRaddRupiah;
        const pct = ((rTotal / tarakah) * 100).toFixed(1);
        finalResults.push({
          name: item.name,
          count: item.count,
          ket: `${item.ket} • Mendapatkan Radd`,
          totalRupiah: rTotal,
          perPersonRupiah: rTotal / item.count,
          pct,
          badgeClass: 'bg-teal-50/80 border-teal-100',
          jenisBagian: 'Fardh + Radd',
        });
      });
    } else {
      // TEPAT 100%
      badgeStatus = 'Kalkulasi Syari';
      totalPercentStr = '100% Terbagi Pas';

      if (asabahCandidate && sisaFrac <= 0.0001) {
        penjelasanSyariList.push(
          `Kerabat asabah (${asabahCandidate.nameL || asabahCandidate.nameP}) tidak mendapatkan bagian karena seluruh harta telah habis terbagi kepada Ashabul Furudh.`
        );
      }

      fardhList.forEach((item) => {
        const rTotal = item.frac * tarakah;
        const pct = (item.frac * 100).toFixed(1);
        finalResults.push({
          name: item.name,
          count: item.count,
          ket: item.ket,
          totalRupiah: rTotal,
          perPersonRupiah: rTotal / item.count,
          pct,
          badgeClass: 'bg-warmbg border-gray-100',
          saham: `${Math.round(item.frac * calcAsalMasalah)} / ${calcAsalMasalah}`,
          jenisBagian: item.jenisBagian || 'Fardh',
        });
      });
    }
  }

  // Tashih Mas'alah: periksa apakah ada kelompok yang sahamnya tidak habis dibagi jumlah kepalanya
  let generalTashihMasalah: number | undefined = undefined;
  if (!isUmariyyatain && !isAkdariyah && totalFardhFrac <= 1) {
    let multiplier = 1;
    finalResults.forEach((item) => {
      if (item.count > 1 && item.saham) {
        const numPart = parseInt(item.saham.split('/')[0].trim(), 10);
        if (numPart > 0 && numPart % item.count !== 0) {
          const g = gcd(numPart, item.count);
          const inkisar = item.count / g;
          multiplier = lcm(multiplier, inkisar);
        }
      }
    });
    if (multiplier > 1) {
      generalTashihMasalah = calcAsalMasalah * multiplier;
    }
  }

  const filteredValid = finalResults.filter(
    (r) => r.count > 0 && r.totalRupiah > 0.5
  );

  return {
    hartaKotorVal: hartaKotor,
    kewajibanTotal: kewajibanTotal + wasiatVal,
    wasiatIsCapped,
    tarakah,
    badgeStatus,
    totalPercentStr,
    results: filteredValid,
    mahjubNotes,
    kasusKhusus: kasusKhususName,
    asalMasalah: calcAsalMasalah,
    tashihMasalah: generalTashihMasalah,
    penjelasanSyari: penjelasanSyariList,
  };
}
