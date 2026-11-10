/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  MawarisInputState,
  StatusPasangan,
  MazhabKakek,
  MawarisCalculationOutput,
} from "../types/mawaris";
import { calculateMawaris } from "../utils/mawarisCalculator";
import { parseMoney, formatRupiah } from "../utils/formatters";

interface MawarisCalculatorProps {
  onShowToast: (msg: string) => void;
}

export const MawarisCalculator: React.FC<MawarisCalculatorProps> = ({
  onShowToast,
}) => {
  // Raw inputs for formatted money strings
  const [hartaKotorRaw, setHartaKotorRaw] = useState("0");
  const [biayaJenazahRaw, setBiayaJenazahRaw] = useState("0");
  const [hutangRaw, setHutangRaw] = useState("0");
  const [wasiatRaw, setWasiatRaw] = useState("0");

  // State untuk kontrol visibilitas hasil dan snapshot kalkulasi (tidak berubah realtime jika input diedit)
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeCalculation, setActiveCalculation] =
    useState<MawarisCalculationOutput | null>(null);
  const [isDirtyAfterCalc, setIsDirtyAfterCalc] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  // Step Wizard: max unlocked step untuk memastikan langkah 2,3,4 terkunci jika langkah sebelumnya belum selesai
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<1 | 2 | 3 | 4>(1);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 2: Pasangan & Leluhur
  const [statusPasangan, setStatusPasangan] = useState<StatusPasangan>("none");
  const [jmlIstri, setJmlIstri] = useState(1);
  const [adaAyah, setAdaAyah] = useState(false);
  const [adaIbu, setAdaIbu] = useState(false);
  const [adaKakek, setAdaKakek] = useState(false);
  const [adaNenek, setAdaNenek] = useState(false);
  const [mazhabKakek, setMazhabKakek] = useState<MazhabKakek>("jumhur");

  // Step 3: Anak Keturunan
  const [anakLaki, setAnakLaki] = useState(0);
  const [anakPerempuan, setAnakPerempuan] = useState(0);
  const [cucuLaki, setCucuLaki] = useState(0);
  const [cucuPerempuan, setCucuPerempuan] = useState(0);

  // Step 4: Saudara & Kerabat Laki-Laki
  const [sdraLakiKandung, setSdraLakiKandung] = useState(0);
  const [sdraPerempuanKandung, setSdraPerempuanKandung] = useState(0);
  const [sdraLakiSeayah, setSdraLakiSeayah] = useState(0);
  const [sdraPerempuanSeayah, setSdraPerempuanSeayah] = useState(0);
  const [sdraSeibu, setSdraSeibu] = useState(0);

  // Kerabat Laki-Laki Lanjutan ('Asabah Binafsihi)
  const [keponakanLakiKandung, setKeponakanLakiKandung] = useState(0);
  const [keponakanLakiSeayah, setKeponakanLakiSeayah] = useState(0);
  const [pamanKandung, setPamanKandung] = useState(0);
  const [pamanSeayah, setPamanSeayah] = useState(0);
  const [sepupuLakiKandung, setSepupuLakiKandung] = useState(0);
  const [sepupuLakiSeayah, setSepupuLakiSeayah] = useState(0);

  // Auto clean-up hierarchical Mahjub
  useEffect(() => {
    if (adaAyah && adaKakek) setAdaKakek(false);
  }, [adaAyah, adaKakek]);

  useEffect(() => {
    if (adaIbu && adaNenek) setAdaNenek(false);
  }, [adaIbu, adaNenek]);

  useEffect(() => {
    if (anakLaki > 0) {
      if (cucuLaki > 0) setCucuLaki(0);
      if (cucuPerempuan > 0) setCucuPerempuan(0);
    }
  }, [anakLaki, cucuLaki, cucuPerempuan]);

  const hartaKotorNum = parseMoney(hartaKotorRaw);
  const biayaJenazahNum = parseMoney(biayaJenazahRaw);
  const hutangNum = parseMoney(hutangRaw);
  const wasiatNum = parseMoney(wasiatRaw);

  const isHartaEntered = hartaKotorNum > 0;

  // Validasi 1: Biaya Jenazah sama dengan atau melebihi Total Harta
  const isBiayaJenazahHabis =
    hartaKotorNum > 0 && biayaJenazahNum >= hartaKotorNum;

  // Sisa harta setelah dikurangi Biaya Jenazah
  const sisaSetelahJenazah = Math.max(0, hartaKotorNum - biayaJenazahNum);

  // Validasi 2: Hutang Mayyit sama dengan atau melebihi sisa harta setelah biaya jenazah
  const isHutangHabis =
    hartaKotorNum > 0 &&
    !isBiayaJenazahHabis &&
    hutangNum >= sisaSetelahJenazah;

  // Sisa harta bersih setelah dikurang biaya jenazah dan hutang
  const sisaSebelumWasiat = Math.max(0, sisaSetelahJenazah - hutangNum);

  // Batas maksimal wasiat syar'i = 1/3 dari sisa harta bersih setelah jenazah & hutang
  const maxWasiat = sisaSebelumWasiat / 3;

  // Persentase wasiat realtime dari harta bersih setelah jenazah & hutang
  const wasiatPct =
    sisaSebelumWasiat > 0 ? (wasiatNum / sisaSebelumWasiat) * 100 : 0;

  // Validasi 3: Wasiat tidak boleh melebihi 1/3 dari sisa harta bersih
  const isWasiatValid = wasiatNum <= maxWasiat + 0.0001;
  const isWasiatOverLimit =
    wasiatNum > 0 && (sisaSebelumWasiat === 0 || !isWasiatValid);

  // Status validasi lengkap Langkah 1
  const isStep1Valid =
    isHartaEntered &&
    !isBiayaJenazahHabis &&
    !isHutangHabis &&
    !isWasiatOverLimit &&
    sisaSebelumWasiat > 0;

  // Auto-reset to Step 1 and hide results if Harta is cleared or invalid
  useEffect(() => {
    if (!isHartaEntered || !isStep1Valid) {
      if (currentStep > 1) {
        setCurrentStep(1);
      }
      setMaxUnlockedStep(1);
      setShowResults(false);
      setActiveCalculation(null);
      setIsDirtyAfterCalc(false);
    }
  }, [isHartaEntered, isStep1Valid, currentStep]);

  const hasMaleFuru = anakLaki > 0 || cucuLaki > 0;
  const hasFemaleFuru = anakPerempuan > 0 || cucuPerempuan > 0;
  const hasFuru = hasMaleFuru || hasFemaleFuru;

  // Saudara mahjub total jika ada Anak Laki-Laki, Cucu Laki-Laki, Ayah,
  // ATAU Kakek menurut madzhab Hanafi (bukan Jumhur).
  const saudaraMahjubByAll =
    anakLaki > 0 ||
    cucuLaki > 0 ||
    adaAyah ||
    (adaKakek && mazhabKakek === "hanafi");

  // If user is on Step 4 but Saudara becomes mahjub, smoothly move back to Step 3
  useEffect(() => {
    if (saudaraMahjubByAll && currentStep === 4) {
      setCurrentStep(3);
    }
  }, [saudaraMahjubByAll, currentStep]);

  const isSdraPrKandungAsabahMaalGhair =
    !hasMaleFuru &&
    !adaAyah &&
    !adaKakek &&
    sdraLakiKandung === 0 &&
    hasFemaleFuru &&
    sdraPerempuanKandung > 0;

  const isSdraPrSeayahAsabahMaalGhair =
    !hasMaleFuru &&
    !adaAyah &&
    !adaKakek &&
    sdraLakiKandung === 0 &&
    sdraPerempuanKandung === 0 &&
    sdraLakiSeayah === 0 &&
    hasFemaleFuru &&
    sdraPerempuanSeayah > 0;

  const canShowKeponakan =
    !saudaraMahjubByAll &&
    !adaKakek &&
    sdraLakiKandung === 0 &&
    !isSdraPrKandungAsabahMaalGhair &&
    sdraLakiSeayah === 0 &&
    !isSdraPrSeayahAsabahMaalGhair;

  const canShowPaman =
    canShowKeponakan && keponakanLakiKandung === 0 && keponakanLakiSeayah === 0;

  const canShowSepupu = canShowPaman && pamanKandung === 0 && pamanSeayah === 0;

  useEffect(() => {
    if (adaKakek) {
      if (keponakanLakiKandung > 0) setKeponakanLakiKandung(0);
      if (keponakanLakiSeayah > 0) setKeponakanLakiSeayah(0);
      if (pamanKandung > 0) setPamanKandung(0);
      if (pamanSeayah > 0) setPamanSeayah(0);
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [
    adaKakek,
    keponakanLakiKandung,
    keponakanLakiSeayah,
    pamanKandung,
    pamanSeayah,
    sepupuLakiKandung,
    sepupuLakiSeayah,
  ]);

  useEffect(() => {
    if (saudaraMahjubByAll) {
      if (sdraLakiKandung > 0) setSdraLakiKandung(0);
      if (sdraPerempuanKandung > 0) setSdraPerempuanKandung(0);
      if (sdraLakiSeayah > 0) setSdraLakiSeayah(0);
      if (sdraPerempuanSeayah > 0) setSdraPerempuanSeayah(0);
      if (sdraSeibu > 0) setSdraSeibu(0);
      if (keponakanLakiKandung > 0) setKeponakanLakiKandung(0);
      if (keponakanLakiSeayah > 0) setKeponakanLakiSeayah(0);
      if (pamanKandung > 0) setPamanKandung(0);
      if (pamanSeayah > 0) setPamanSeayah(0);
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [
    saudaraMahjubByAll,
    sdraLakiKandung,
    sdraPerempuanKandung,
    sdraLakiSeayah,
    sdraPerempuanSeayah,
    sdraSeibu,
    keponakanLakiKandung,
    keponakanLakiSeayah,
    pamanKandung,
    pamanSeayah,
    sepupuLakiKandung,
    sepupuLakiSeayah,
  ]);

  useEffect(() => {
    // Saudara seibu terhalang oleh Furu' warits ATAU Kakek/Ayah
    if ((hasFuru || adaKakek || adaAyah) && sdraSeibu > 0) {
      setSdraSeibu(0);
    }
  }, [hasFuru, adaKakek, adaAyah, sdraSeibu]);

  useEffect(() => {
    if (sdraLakiKandung > 0 || isSdraPrKandungAsabahMaalGhair) {
      if (sdraLakiSeayah > 0) setSdraLakiSeayah(0);
      if (sdraPerempuanSeayah > 0) setSdraPerempuanSeayah(0);
      if (keponakanLakiKandung > 0) setKeponakanLakiKandung(0);
      if (keponakanLakiSeayah > 0) setKeponakanLakiSeayah(0);
      if (pamanKandung > 0) setPamanKandung(0);
      if (pamanSeayah > 0) setPamanSeayah(0);
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [
    sdraLakiKandung,
    isSdraPrKandungAsabahMaalGhair,
    sdraLakiSeayah,
    sdraPerempuanSeayah,
    keponakanLakiKandung,
    keponakanLakiSeayah,
    pamanKandung,
    pamanSeayah,
    sepupuLakiKandung,
    sepupuLakiSeayah,
  ]);

  useEffect(() => {
    if (sdraLakiSeayah > 0 || isSdraPrSeayahAsabahMaalGhair) {
      if (keponakanLakiKandung > 0) setKeponakanLakiKandung(0);
      if (keponakanLakiSeayah > 0) setKeponakanLakiSeayah(0);
      if (pamanKandung > 0) setPamanKandung(0);
      if (pamanSeayah > 0) setPamanSeayah(0);
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [
    sdraLakiSeayah,
    isSdraPrSeayahAsabahMaalGhair,
    keponakanLakiKandung,
    keponakanLakiSeayah,
    pamanKandung,
    pamanSeayah,
    sepupuLakiKandung,
    sepupuLakiSeayah,
  ]);

  useEffect(() => {
    if (keponakanLakiKandung > 0) {
      if (keponakanLakiSeayah > 0) setKeponakanLakiSeayah(0);
      if (pamanKandung > 0) setPamanKandung(0);
      if (pamanSeayah > 0) setPamanSeayah(0);
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [
    keponakanLakiKandung,
    keponakanLakiSeayah,
    pamanKandung,
    pamanSeayah,
    sepupuLakiKandung,
    sepupuLakiSeayah,
  ]);

  useEffect(() => {
    if (keponakanLakiSeayah > 0) {
      if (pamanKandung > 0) setPamanKandung(0);
      if (pamanSeayah > 0) setPamanSeayah(0);
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [
    keponakanLakiSeayah,
    pamanKandung,
    pamanSeayah,
    sepupuLakiKandung,
    sepupuLakiSeayah,
  ]);

  useEffect(() => {
    if (pamanKandung > 0) {
      if (pamanSeayah > 0) setPamanSeayah(0);
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [pamanKandung, pamanSeayah, sepupuLakiKandung, sepupuLakiSeayah]);

  useEffect(() => {
    if (pamanSeayah > 0) {
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [pamanSeayah, sepupuLakiKandung, sepupuLakiSeayah]);

  useEffect(() => {
    if (sepupuLakiKandung > 0) {
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [sepupuLakiKandung, sepupuLakiSeayah]);

  const handleMoneyChange = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      setter("");
      return;
    }
    setter(parseInt(digits, 10).toLocaleString("id-ID"));
  };

  const stepNumber = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number,
    min = 0,
    max = 99,
  ) => {
    setter((prev) => Math.min(max, Math.max(min, prev + delta)));
  };

  // Structured list of active Mahjub rules (HANYA Hajb Hirman / Terhalang Penuh agar layar tidak penuh)
  const activeMahjubAlerts = useMemo(() => {
    const alerts: { target: string; by: string; detail: string }[] = [];

    if (adaAyah) {
      alerts.push({
        target: "Kakek",
        by: "Ayah Kandung",
        detail:
          "Kakek terhalang penuh karena Ayah berderajat nasab lebih dekat.",
      });
    }
    if (adaIbu) {
      alerts.push({
        target: "Nenek",
        by: "Ibu Kandung",
        detail: "Seluruh nenek terhalang oleh keberadaan Ibu Kandung.",
      });
    }
    if (anakLaki > 0) {
      alerts.push({
        target: "Cucu (dr Anak Laki)",
        by: "Anak Laki-Laki",
        detail: "Cucu terhalang oleh anak laki-laki utama.",
      });
    }
    if (saudaraMahjubByAll) {
      const penyebab = adaAyah
        ? "Ayah Kandung"
        : anakLaki > 0
          ? "Anak Laki-Laki"
          : cucuLaki > 0
            ? "Cucu Laki-Laki"
            : "Kakek (Mazhab Hanafi)";
      alerts.push({
        target: "Seluruh Saudara & Kerabat",
        by: penyebab,
        detail: "Saudara, keponakan, paman, dan sepupu terhalang secara total.",
      });
    } else {
      if (sdraLakiKandung > 0) {
        alerts.push({
          target: "Saudara Seayah & Kerabat Bawah",
          by: "Sdr. Laki Kandung",
          detail:
            "Saudara kandung menggugurkan saudara seayah dan seluruh kerabat paman/sepupu.",
        });
      } else if (isSdraPrKandungAsabahMaalGhair) {
        alerts.push({
          target: "Saudara Seayah & Kerabat Bawah",
          by: "Sdr. Pr Kandung ('Asabah)",
          detail:
            "Saudari kandung menjadi asabah ma'al ghair sehingga menghalangi saudara seayah dan kerabat bawah.",
        });
      } else if (isSdraPrSeayahAsabahMaalGhair) {
        alerts.push({
          target: "Keponakan & Paman",
          by: "Sdr. Pr Seayah ('Asabah)",
          detail:
            "Saudari seayah menjadi asabah ma'al ghair sehingga menghalangi keponakan dan paman.",
        });
      }
      if (hasFuru || adaKakek || adaAyah) {
        alerts.push({
          target: "Saudara Seibu",
          by: hasFuru ? "Keturunan (Furu')" : "Ayah / Kakek",
          detail: "Saudara seibu gugur oleh keturunan maupun ushul laki-laki.",
        });
      }
      if (sdraLakiSeayah > 0) {
        alerts.push({
          target: "Keponakan & Paman",
          by: "Sdr. Laki Seayah",
          detail: "Saudara laki-laki seayah menghalangi keponakan dan paman.",
        });
      }
      if (keponakanLakiKandung > 0) {
        alerts.push({
          target: "Keponakan Seayah & Paman",
          by: "Keponakan Kandung",
          detail: "Keponakan kandung menghalangi keponakan seayah serta paman.",
        });
      }
      if (keponakanLakiSeayah > 0) {
        alerts.push({
          target: "Paman & Sepupu",
          by: "Keponakan Seayah",
          detail: "Keponakan seayah menghalangi seluruh paman dan sepupu.",
        });
      }
      if (pamanKandung > 0) {
        alerts.push({
          target: "Paman Seayah & Sepupu",
          by: "Paman Kandung",
          detail: "Paman kandung menghalangi paman seayah dan sepupu.",
        });
      }
      if (pamanSeayah > 0) {
        alerts.push({
          target: "Seluruh Sepupu",
          by: "Paman Seayah",
          detail: "Paman seayah menghalangi seluruh anak paman (sepupu).",
        });
      }
      if (sepupuLakiKandung > 0) {
        alerts.push({
          target: "Sepupu Seayah",
          by: "Sepupu Kandung",
          detail: "Sepupu kandung menghalangi sepupu seayah.",
        });
      }
    }

    return alerts;
  }, [
    adaAyah,
    adaIbu,
    anakLaki,
    cucuLaki,
    saudaraMahjubByAll,
    sdraLakiKandung,
    isSdraPrKandungAsabahMaalGhair,
    isSdraPrSeayahAsabahMaalGhair,
    hasFuru,
    adaKakek,
    sdraLakiSeayah,
    keponakanLakiKandung,
    keponakanLakiSeayah,
    pamanKandung,
    pamanSeayah,
    sepupuLakiKandung,
    sepupuLakiSeayah,
  ]);

  // Structured input state for the calculation engine
  const inputState: MawarisInputState = useMemo(
    () => ({
      hartaKotor: hartaKotorNum,
      biayaJenazah: biayaJenazahNum,
      hutang: hutangNum,
      wasiat: wasiatNum,
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
      keponakanLakiKandung,
      keponakanLakiSeayah,
      pamanKandung,
      pamanSeayah,
      sepupuLakiKandung,
      sepupuLakiSeayah,
      mazhabKakek,
    }),
    [
      hartaKotorNum,
      biayaJenazahNum,
      hutangNum,
      wasiatNum,
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
      keponakanLakiKandung,
      keponakanLakiSeayah,
      pamanKandung,
      pamanSeayah,
      sepupuLakiKandung,
      sepupuLakiSeayah,
      mazhabKakek,
    ],
  );

  // Jika user mengubah form setelah hasil ditampilkan, tandai bahwa data telah berubah
  // Snapshot activeCalculation TETAP disimpan dan tidak diupdate realtime sampai user klik tombol hitung ulang
  useEffect(() => {
    if (showResults && activeCalculation) {
      setIsDirtyAfterCalc(true);
    }
  }, [inputState]);

  const scrollToRingkasanHarta = () => {
    const doScroll = () => {
      const targetEl =
        document.getElementById("ringkasanHartaCard") ||
        document.getElementById("hasilCardSection");
      if (!targetEl) return;

      const navEl = document.getElementById("navbar");
      const navHeight = navEl ? navEl.getBoundingClientRect().height : 80;
      const topBuffer = 16; // Jarak rapi dan estetik di atas div ringkasan harta
      const elementTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const targetY = Math.max(0, elementTop - navHeight - topBuffer);

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    };

    // Eksekusi segera di frame berikutnya setelah render
    requestAnimationFrame(() => {
      doScroll();
      // Penyesuaian halus setelah DOM settled (mengantisipasi banner 'data berubah' unmount & reflow layout)
      setTimeout(doScroll, 80);
      setTimeout(doScroll, 220);
    });
  };

  const handleHitungClick = () => {
    if (!isHartaEntered) {
      onShowToast("Mohon masukkan nominal Total Harta terlebih dahulu.");
      setCurrentStep(1);
      return;
    }

    if (isBiayaJenazahHabis || isHutangHabis || sisaSebelumWasiat <= 0) {
      onShowToast("Tidak ada harta yang tersisa untuk dibagikan.");
      setCurrentStep(1);
      return;
    }

    if (isWasiatOverLimit) {
      onShowToast("Wasiat tidak boleh lebih dari 1/3 harta bersih.");
      setCurrentStep(1);
      return;
    }

    const isRecalculation = showResults && activeCalculation !== null;
    setIsCalculating(true);

    setTimeout(() => {
      // Ambil snapshot hasil perhitungan pada saat tombol diklik
      const result = calculateMawaris(inputState);
      setActiveCalculation(result);
      setShowResults(true);
      setIsDirtyAfterCalc(false);
      setIsCalculating(false);

      if (isRecalculation) {
        setJustUpdated(true);
        setTimeout(() => {
          setJustUpdated(false);
        }, 2800);
        onShowToast("Hasil perhitungan waris berhasil diperbarui!");
      } else {
        setJustUpdated(false);
        onShowToast("Hasil perhitungan waris berhasil dihitung!");
      }

      // Smooth scroll tepat ke atas div ringkasan harta
      scrollToRingkasanHarta();
    }, 200);
  };

  return (
    <section
      id="simulator"
      className="py-16 md:py-20 bg-gradient-to-br from-emerald-900 via-brand-900 to-teal-950 text-white relative overflow-hidden scroll-mt-20 md:scroll-mt-24"
    >
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <i className="fa-solid fa-calculator"></i> Tool Interaktif
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Kalkulator Waris Syar'i
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Sistem kalkulasi waris lengkap dan komprehensif sesuai dengan syari'at islam
          </p>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            showResults && activeCalculation
              ? "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
              : "max-w-2xl sm:max-w-3xl mx-auto"
          }`}
        >
          {/* Form Inputs Column */}
          <div
            id="calculatorFormCard"
            className={`bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-5 sm:p-7 rounded-3xl shadow-2xl border border-emerald-400/30 dark:border-slate-800 space-y-5 transition-all duration-500 ${
              showResults && activeCalculation ? "lg:col-span-7" : "w-full"
            }`}
          >
            {/* Step Navigation Header - Responsive Grid, Zero Horizontal Scroll */}
            <div
              className={`grid gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-emerald-50/70 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700/70 shadow-2xs ${
                saudaraMahjubByAll ? "grid-cols-3" : "grid-cols-4"
              }`}
            >
              {[
                {
                  step: 1 as const,
                  mobileLabel: "Harta",
                  desktopSuffix: "",
                  icon: "fa-coins",
                },
                {
                  step: 2 as const,
                  mobileLabel: "Pasangan",
                  desktopSuffix: " & Ortu",
                  icon: "fa-users",
                },
                {
                  step: 3 as const,
                  mobileLabel: "Keturunan",
                  desktopSuffix: "",
                  icon: "fa-child-reaching",
                },
                ...(!saudaraMahjubByAll
                  ? [
                      {
                        step: 4 as const,
                        mobileLabel: "Saudara",
                        desktopSuffix: "",
                        icon: "fa-people-roof",
                      },
                    ]
                  : []),
              ].map((item) => {
                const isActive = currentStep === item.step;
                const isUnlocked =
                  item.step === 1 ||
                  (isStep1Valid && item.step <= maxUnlockedStep);

                return (
                  <button
                    key={item.step}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) {
                        setCurrentStep(item.step);
                      }
                    }}
                    className={`w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 select-none ${
                      isActive
                        ? "bg-brand-600 dark:bg-emerald-600 text-white shadow-xs cursor-default ring-1 ring-brand-700/20"
                        : isUnlocked
                          ? "bg-white/90 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-brand-900 dark:hover:text-emerald-300 border border-emerald-100/70 dark:border-slate-700 cursor-pointer shadow-2xs active:scale-95"
                          : "bg-gray-100/60 dark:bg-slate-800/40 text-gray-400 dark:text-slate-500 border border-gray-200/40 dark:border-slate-800 cursor-not-allowed opacity-60"
                    }`}
                    title={
                      !isUnlocked
                        ? item.step > 1 && !isHartaEntered
                          ? "Masukkan Total Harta terlebih dahulu"
                          : "Selesaikan langkah sebelumnya terlebih dahulu"
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1 shrink-0">
                      <i
                        className={`fa-solid ${item.icon} text-[10px] sm:text-xs ${
                          isActive
                            ? "text-white"
                            : isUnlocked
                              ? "text-brand-600 dark:text-emerald-400"
                              : "text-gray-400 dark:text-slate-500"
                        }`}
                      ></i>
                      {!isUnlocked && (
                        <i className="fa-solid fa-lock text-[8px] sm:text-[9px] text-gray-400 dark:text-slate-500"></i>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs leading-none truncate tracking-tight">
                      <span className="font-extrabold">{item.step}.</span>{" "}
                      <span>{item.mobileLabel}</span>
                      {item.desktopSuffix && (
                        <span className="hidden md:inline">
                          {item.desktopSuffix}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* STEP 1: Harta & Kewajiban */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-brand-800 dark:text-emerald-400 flex items-center gap-2">
                    <i className="fa-solid fa-coins text-amber-500"></i>
                    <span>Total Harta & Kewajiban</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">
                    1 dari {saudaraMahjubByAll ? "3" : "4"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 dark:text-slate-200 mb-1">
                    Total Harta <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 font-bold text-sm">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="hartaKotor"
                      value={hartaKotorRaw}
                      onChange={(e) =>
                        handleMoneyChange(e.target.value, setHartaKotorRaw)
                      }
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-base focus:ring-2 focus:ring-brand-500 font-bold text-gray-900 dark:text-white bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-slate-300 mb-1">
                      Biaya Jenazah
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 font-bold text-xs pointer-events-none select-none">
                        Rp
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="biayaJenazah"
                        value={biayaJenazahRaw}
                        onChange={(e) =>
                          handleMoneyChange(e.target.value, setBiayaJenazahRaw)
                        }
                        onFocus={(e) => e.target.select()}
                        placeholder="0"
                        className={`w-full pl-8 pr-2.5 py-2 border rounded-xl text-xs font-semibold focus:ring-2 ${
                          isBiayaJenazahHabis
                            ? "border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 focus:ring-red-500 bg-red-50/20 dark:bg-red-950/30"
                            : "border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white bg-white dark:bg-slate-800 focus:ring-brand-500"
                        }`}
                      />
                    </div>
                    {isBiayaJenazahHabis && (
                      <p
                        className="text-[10px] text-red-600 dark:text-red-400 font-semibold mt-1 leading-tight flex items-center gap-1 animate-in fade-in"
                        title="Tidak ada harta yang tersisa"
                      >
                        <i className="fa-solid fa-triangle-exclamation text-[9px] shrink-0"></i>
                        <span className="truncate">Tidak ada harta yang tersisa</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-slate-300 mb-1">
                      Hutang Mayit
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 font-bold text-xs pointer-events-none select-none">
                        Rp
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="hutang"
                        value={hutangRaw}
                        onChange={(e) =>
                          handleMoneyChange(e.target.value, setHutangRaw)
                        }
                        onFocus={(e) => e.target.select()}
                        placeholder="0"
                        className={`w-full pl-8 pr-2.5 py-2 border rounded-xl text-xs font-semibold focus:ring-2 ${
                          isHutangHabis
                            ? "border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 focus:ring-red-500 bg-red-50/20 dark:bg-red-950/30"
                            : "border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white bg-white dark:bg-slate-800 focus:ring-brand-500"
                        }`}
                      />
                    </div>
                    {isHutangHabis && (
                      <p
                        className="text-[10px] text-red-600 dark:text-red-400 font-semibold mt-1 leading-tight flex items-center gap-1 animate-in fade-in"
                        title="Tidak ada harta yang tersisa"
                      >
                        <i className="fa-solid fa-triangle-exclamation text-[9px] shrink-0"></i>
                        <span className="truncate">Tidak ada harta yang tersisa</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-slate-300 truncate">
                        Wasiat <span className="text-gray-400 dark:text-slate-500 font-normal">(Maksimal 1/3)</span>
                      </label>
                      {wasiatNum > 0 && (
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded transition-colors ${
                            sisaSebelumWasiat === 0 || !isWasiatValid
                              ? "text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800"
                              : "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800"
                          }`}
                          title={
                            !isWasiatValid
                              ? "Lebih dari 1/3. Berdasarkan syariat, sistem otomatis hanya mencatat maksimal 1/3."
                              : `${wasiatPct.toFixed(1)}% dari harta setelah dikurangi jenazah dan hutang`
                          }
                        >
                          {sisaSebelumWasiat > 0
                            ? !isWasiatValid
                              ? "Lebih dari 1/3"
                              : `${wasiatPct.toFixed(1)}%`
                            : "Lebih dari 1/3"}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 font-bold text-xs pointer-events-none select-none">
                        Rp
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="wasiat"
                        value={wasiatRaw}
                        onChange={(e) =>
                          handleMoneyChange(e.target.value, setWasiatRaw)
                        }
                        onFocus={(e) => e.target.select()}
                        placeholder="0"
                        className={`w-full pl-8 pr-2.5 py-2 border rounded-xl text-xs font-semibold focus:ring-2 ${
                          isWasiatOverLimit
                            ? "border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 focus:ring-red-500 bg-red-50/20 dark:bg-red-950/30"
                            : "border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white bg-white dark:bg-slate-800 focus:ring-brand-500"
                        }`}
                      />
                    </div>
                    {isWasiatOverLimit && (
                      <p
                        className="text-[10px] text-red-600 dark:text-red-400 font-semibold mt-1 leading-tight flex items-center gap-1 animate-in fade-in"
                        title={
                          sisaSebelumWasiat > 0
                            ? `Batas syar'i maksimal 1/3: Rp ${Math.floor(maxWasiat).toLocaleString("id-ID")}`
                            : "Tidak ada harta yang tersisa"
                        }
                      >
                        <i className="fa-solid fa-triangle-exclamation text-[9px] shrink-0"></i>
                        <span className="truncate">
                          {sisaSebelumWasiat > 0
                            ? `Maksimal 1/3: (Rp ${Math.floor(maxWasiat).toLocaleString("id-ID")})`
                            : "Tidak ada harta yang tersisa"}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Pasangan & Orang Tua */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-brand-800 dark:text-emerald-400 flex items-center gap-2">
                    <i className="fa-solid fa-users text-brand-600 dark:text-emerald-400"></i>
                    <span>Pasangan & Orang Tua</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">
                    2 dari {saudaraMahjubByAll ? "3" : "4"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div
                    className={`grid gap-3 transition-all ${
                      statusPasangan === "istri" || statusPasangan === "suami"
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                        Yang Meninggal
                      </label>
                      <select
                        id="statusPasangan"
                        value={statusPasangan}
                        onChange={(e) =>
                          setStatusPasangan(e.target.value as StatusPasangan)
                        }
                        className="w-full h-11 px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="none">
                          Belum Menikah/Duda/Janda
                        </option>
                        <option value="istri">
                          Suami
                        </option>
                        <option value="suami">
                          Istri
                        </option>
                      </select>
                    </div>

                    {statusPasangan === "istri" && (
                      <div className="animate-in fade-in duration-200">
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                          Jumlah Istri
                        </label>
                        <div className="h-11 px-3 py-1.5 bg-warmbg dark:bg-slate-800/80 rounded-xl border border-gray-200/80 dark:border-slate-700 flex items-center justify-between">
                          <div className="min-w-0 pr-1">
                            <span className="block text-xs font-bold text-gray-800 dark:text-white leading-tight truncate">
                              {jmlIstri} Orang
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight block truncate">
                              1/4 atau 1/8
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => stepNumber(setJmlIstri, -1, 1, 4)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer flex items-center justify-center active:scale-95 transition-transform"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                              {jmlIstri}
                            </span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setJmlIstri, 1, 1, 4)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer flex items-center justify-center active:scale-95 transition-transform"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {statusPasangan === "suami" && (
                      <div className="animate-in fade-in duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                            Jumlah Suami
                          </label>
                          <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            Maksimal 1
                          </span>
                        </div>
                        <div className="h-11 px-3 py-1.5 bg-gray-50/90 dark:bg-slate-800/80 rounded-xl border border-gray-200/90 dark:border-slate-700 flex items-center justify-between">
                          <div className="min-w-0 pr-1">
                            <span className="block text-xs font-bold text-gray-800 dark:text-white leading-tight truncate">
                              1 Orang
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight block truncate">
                              1/2 atau 1/4
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled
                              className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 font-bold text-sm text-gray-400 dark:text-slate-600 cursor-not-allowed flex items-center justify-center select-none"
                              title="Jumlah suami tetap 1 orang (syariat tidak membolehkan poliandri)"
                              aria-label="Kurangi jumlah suami (disabled)"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400 select-none">
                              1
                            </span>
                            <button
                              type="button"
                              disabled
                              className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 font-bold text-sm text-gray-400 dark:text-slate-600 cursor-not-allowed flex items-center justify-center select-none"
                              title="Jumlah suami tetap 1 orang (syariat tidak membolehkan poliandri)"
                              aria-label="Tambah jumlah suami (disabled)"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Orang Tua (Kakek & Nenek hanya tampil jika TIDAK terhalang) */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                      Orang Tua & Leluhur yang Masih Hidup:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <label
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          adaAyah
                            ? "bg-brand-50 dark:bg-emerald-950/40 border-brand-300 dark:border-emerald-700/80 text-brand-900 dark:text-emerald-200 font-bold"
                            : "bg-gray-50/70 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={adaAyah}
                          onChange={(e) => setAdaAyah(e.target.checked)}
                          className="rounded text-brand-600 dark:text-emerald-500 focus:ring-brand-500"
                        />
                        <span className="text-xs">Ayah Kandung</span>
                      </label>

                      <label
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          adaIbu
                            ? "bg-brand-50 dark:bg-emerald-950/40 border-brand-300 dark:border-emerald-700/80 text-brand-900 dark:text-emerald-200 font-bold"
                            : "bg-gray-50/70 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={adaIbu}
                          onChange={(e) => setAdaIbu(e.target.checked)}
                          className="rounded text-brand-600 dark:text-emerald-500 focus:ring-brand-500"
                        />
                        <span className="text-xs">Ibu Kandung</span>
                      </label>

                      {/* Kakek HANYA ditampilkan jika TIDAK terhalang oleh Ayah */}
                      {!adaAyah && (
                        <label
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all animate-in fade-in duration-200 ${
                            adaKakek
                              ? "bg-brand-50 dark:bg-emerald-950/40 border-brand-300 dark:border-emerald-700/80 text-brand-900 dark:text-emerald-200 font-bold"
                              : "bg-gray-50/70 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={adaKakek}
                            onChange={(e) => setAdaKakek(e.target.checked)}
                            className="rounded text-brand-600 dark:text-emerald-500 focus:ring-brand-500"
                          />
                          <span className="text-xs">Kakek (dr Ayah)</span>
                        </label>
                      )}

                      {/* Nenek HANYA ditampilkan jika TIDAK terhalang oleh Ibu */}
                      {!adaIbu && (
                        <label
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all animate-in fade-in duration-200 ${
                            adaNenek
                              ? "bg-brand-50 dark:bg-emerald-950/40 border-brand-300 dark:border-emerald-700/80 text-brand-900 dark:text-emerald-200 font-bold"
                              : "bg-gray-50/70 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={adaNenek}
                            onChange={(e) => setAdaNenek(e.target.checked)}
                            className="rounded text-brand-600 dark:text-emerald-500 focus:ring-brand-500"
                          />
                          <span className="text-xs">Nenek</span>
                        </label>
                      )}
                    </div>

                    {/* Mazhab Kakek jika Kakek ada */}
                    {adaKakek && !adaAyah && (
                      <div className="p-2.5 bg-emerald-50/70 dark:bg-slate-800/70 rounded-xl border border-emerald-200/80 dark:border-slate-700 space-y-1.5 animate-in fade-in duration-200">
                        <span className="block text-[11px] font-bold text-brand-900 dark:text-emerald-300">
                          Kaidah Kakek Bersama Saudara:
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMazhabKakek("jumhur")}
                            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                              mazhabKakek === "jumhur"
                                ? "bg-brand-600 dark:bg-emerald-600 text-white shadow-xs"
                                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600"
                            }`}
                          >
                            Jumhur (Muqasamah/(1/3)
                          </button>
                          <button
                            type="button"
                            onClick={() => setMazhabKakek("hanafi")}
                            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                              mazhabKakek === "hanafi"
                                ? "bg-brand-600 dark:bg-emerald-600 text-white shadow-xs"
                                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600"
                            }`}
                          >
                            Hanafi (Kakek Halangi Saudara)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Keturunan (Furu') */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-brand-800 dark:text-emerald-400 flex items-center gap-2">
                    <i className="fa-solid fa-child-reaching text-blue-600 dark:text-blue-400"></i>
                    <span>Anak & Keturunan Kandung</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">
                    3 dari {saudaraMahjubByAll ? "3" : "4"}
                  </span>
                </div>

                <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed flex items-start gap-2">
                  <i className="fa-solid fa-circle-info text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"></i>
                  <span>
                    Hanya anak kandung mayit yang berhak mendapat jatah waris, anak tiri dan anak angkat bukanlah ahli waris syar'i.
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50/80 dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-gray-900 dark:text-white">
                          Anak Laki-Laki
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-slate-400">
                          'Asabah Binafsihi
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => stepNumber(setAnakLaki, -1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                          {anakLaki}
                        </span>
                        <button
                          type="button"
                          onClick={() => stepNumber(setAnakLaki, 1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50/80 dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-gray-900 dark:text-white">
                          Anak Perempuan
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-slate-400">
                          1/2, 2/3, atau 'Asabah
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            stepNumber(setAnakPerempuan, -1, 0, 99)
                          }
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                          {anakPerempuan}
                        </span>
                        <button
                          type="button"
                          onClick={() => stepNumber(setAnakPerempuan, 1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cucu HANYA ditampilkan jika TIDAK terhalang oleh Anak Laki-Laki */}
                  {anakLaki === 0 && (
                    <div className="pt-1 space-y-2 animate-in fade-in duration-200">
                      <span className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                        Cucu (dari Jalur Anak Laki-Laki):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-warmbg dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900 dark:text-white">
                              Cucu Laki-Laki
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">
                              dr Anak Laki-Laki
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => stepNumber(setCucuLaki, -1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                              {cucuLaki}
                            </span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setCucuLaki, 1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-warmbg dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900 dark:text-white">
                              Cucu Perempuan
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">
                              dr Anak Laki-Laki
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setCucuPerempuan, -1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                              {cucuPerempuan}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setCucuPerempuan, 1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Saudara, Paman & Kerabat Mayyit (Hanya jika TIDAK mahjub total) */}
            {currentStep === 4 && !saudaraMahjubByAll && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-brand-800 dark:text-emerald-400 flex items-center gap-2">
                    <i className="fa-solid fa-people-roof text-purple-600 dark:text-purple-400"></i>
                    <span>Saudara, Paman & Kerabat</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">
                    4 dari 4
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Saudara Kandung */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                      Saudara Kandung:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50/80 dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-gray-900 dark:text-white">
                            Sdr Laki Kandung
                          </span>
                          <span className="text-[10px] text-gray-500 dark:text-slate-400">
                            'Asabah
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              stepNumber(setSdraLakiKandung, -1, 0, 99)
                            }
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                            {sdraLakiKandung}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              stepNumber(setSdraLakiKandung, 1, 0, 99)
                            }
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50/80 dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-gray-900 dark:text-white">
                            Sdr Pr Kandung
                          </span>
                          <span className="text-[10px] text-gray-500 dark:text-slate-400">
                            1/2, 2/3, atau 'Asabah
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              stepNumber(setSdraPerempuanKandung, -1, 0, 99)
                            }
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                            {sdraPerempuanKandung}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              stepNumber(setSdraPerempuanKandung, 1, 0, 99)
                            }
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Saudara Seayah HANYA ditampilkan jika TIDAK terhalang oleh Sdr Kandung */}
                  {sdraLakiKandung === 0 && !isSdraPrKandungAsabahMaalGhair && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      <span className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                        Saudara Seayah:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-warmbg dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900 dark:text-white">
                              Sdr Laki Seayah
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">
                              'Asabah
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setSdraLakiSeayah, -1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                              {sdraLakiSeayah}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setSdraLakiSeayah, 1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-warmbg dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900 dark:text-white">
                              Sdr Pr Seayah
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">
                              1/6, 1/2, 2/3, atau 'Asabah
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setSdraPerempuanSeayah, -1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                              {sdraPerempuanSeayah}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setSdraPerempuanSeayah, 1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Saudara Seibu HANYA ditampilkan jika TIDAK terhalang */}
                  {!hasFuru && !adaKakek && !adaAyah && (
                    <div className="p-3 bg-warmbg dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between animate-in fade-in duration-200">
                      <div>
                        <span className="block text-xs font-bold text-gray-900 dark:text-white">
                          Saudara / Saudari Seibu
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-slate-400">
                          1/6 (sendiri) atau 1/3 (2+ orang)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => stepNumber(setSdraSeibu, -1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                          {sdraSeibu}
                        </span>
                        <button
                          type="button"
                          onClick={() => stepNumber(setSdraSeibu, 1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Anak Saudara Laki-Laki (Keponakan) HANYA jika tidak terhalang saudara */}
                  {canShowKeponakan && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      <span className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                        Anak Saudara Laki-Laki (Keponakan):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900 dark:text-white">
                              Keponakan Kandung
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">
                              dr Sdr Laki Kandung ('Asabah)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setKeponakanLakiKandung, -1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                              {keponakanLakiKandung}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setKeponakanLakiKandung, 1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {keponakanLakiKandung === 0 && (
                          <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40 flex items-center justify-between animate-in fade-in duration-200">
                            <div>
                              <span className="block text-xs font-bold text-gray-900 dark:text-white">
                                Keponakan Seayah
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-slate-400">
                                dr Sdr Laki Seayah ('Asabah)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  stepNumber(setKeponakanLakiSeayah, -1, 0, 99)
                                }
                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                                {keponakanLakiSeayah}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  stepNumber(setKeponakanLakiSeayah, 1, 0, 99)
                                }
                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Paman (Saudara Laki-Laki Ayah) HANYA jika tidak ada saudara & keponakan */}
                  {canShowPaman && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      <span className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                        Paman (Saudara Laki-Laki Ayah):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900 dark:text-white">
                              Paman Kandung
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">
                              Sdr Laki Kandung Ayah ('Asabah)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setPamanKandung, -1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                              {pamanKandung}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setPamanKandung, 1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {pamanKandung === 0 && (
                          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-between animate-in fade-in duration-200">
                            <div>
                              <span className="block text-xs font-bold text-gray-900 dark:text-white">
                                Paman Seayah
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-slate-400">
                                Sdr Laki Seayah Ayah ('Asabah)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  stepNumber(setPamanSeayah, -1, 0, 99)
                                }
                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                                {pamanSeayah}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  stepNumber(setPamanSeayah, 1, 0, 99)
                                }
                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Anak Paman (Sepupu Laki-Laki) HANYA jika tidak ada saudara, keponakan, & paman */}
                  {canShowSepupu && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      <span className="block text-xs font-bold text-gray-700 dark:text-slate-300">
                        Anak Paman (Sepupu Laki-Laki):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-sky-50/60 dark:bg-sky-950/30 rounded-2xl border border-sky-100 dark:border-sky-900/40 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900 dark:text-white">
                              Sepupu Laki Kandung
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">
                              dr Paman Kandung ('Asabah)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setSepupuLakiKandung, -1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                              {sepupuLakiKandung}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                stepNumber(setSepupuLakiKandung, 1, 0, 99)
                              }
                              className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {sepupuLakiKandung === 0 && (
                          <div className="p-3 bg-sky-50/60 dark:bg-sky-950/30 rounded-2xl border border-sky-100 dark:border-sky-900/40 flex items-center justify-between animate-in fade-in duration-200">
                            <div>
                              <span className="block text-xs font-bold text-gray-900 dark:text-white">
                                Sepupu Laki Seayah
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-slate-400">
                                dr Paman Seayah ('Asabah)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  stepNumber(setSepupuLakiSeayah, -1, 0, 99)
                                }
                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-sm text-brand-800 dark:text-emerald-400">
                                {sepupuLakiSeayah}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  stepNumber(setSepupuLakiSeayah, 1, 0, 99)
                                }
                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Smart, Compact, Informative Hajb Hirman Widget */}
            {activeMahjubAlerts.length > 0 && isHartaEntered && (
              <div className="p-3 bg-gradient-to-r from-amber-50/90 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-800/70 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <i className="fa-solid fa-shield-halved text-amber-600 dark:text-amber-400"></i>
                    <span>
                      ({activeMahjubAlerts.length}) Orang/Kelompok Terhalang:
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeMahjubAlerts.map((item, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-slate-800 border border-amber-200/90 dark:border-amber-800/70 text-[11px] shadow-2xs text-amber-950 dark:text-amber-200 font-medium"
                      title={item.detail}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400"></span>
                      <strong className="font-bold text-gray-900 dark:text-white">
                        {item.target}
                      </strong>
                      <span className="text-gray-500 dark:text-slate-400 text-[10px]">
                        terhalang oleh
                      </span>
                      <span className="font-bold text-brand-800 dark:text-emerald-400">
                        {item.by}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tombol Aksi & Navigasi Langkah (Lanjut ke... & Kembali ke...) - Diletakkan tepat di bawah widget kaidah hajb */}
            <div className="pt-1">
              {currentStep === 1 && (
                <div>
                  <button
                    type="button"
                    disabled={!isStep1Valid}
                    onClick={() => {
                      setMaxUnlockedStep((prev) =>
                        Math.max(prev, 2) as 1 | 2 | 3 | 4,
                      );
                      setCurrentStep(2);
                    }}
                    className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                      isStep1Valid
                        ? "bg-brand-600 dark:bg-emerald-600 hover:bg-brand-700 dark:hover:bg-emerald-500 text-white cursor-pointer active:scale-[0.99]"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed border border-gray-200 dark:border-slate-700"
                    }`}
                  >
                    <span>Selanjutnya</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-bold text-xs hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    ← Kembali ke Harta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMaxUnlockedStep((prev) =>
                        Math.max(prev, 3) as 1 | 2 | 3 | 4,
                      );
                      setCurrentStep(3);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 dark:bg-emerald-600 hover:bg-brand-700 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Lanjut ke Keturunan →
                  </button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-bold text-xs hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    ← Kembali ke Ortu
                  </button>
                  {saudaraMahjubByAll ? (
                    <button
                      type="button"
                      disabled={isCalculating}
                      onClick={handleHitungClick}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700 hover:from-brand-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-80 disabled:cursor-wait transition-all active:scale-[0.99]"
                    >
                      {isCalculating ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>
                            {showResults ? "Memperbarui..." : "Sedang Menghitung..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {showResults
                              ? isDirtyAfterCalc
                                ? "Perbarui Hasil"
                                : "Hitung Ulang"
                              : "Selesai & Lihat Hasil"}
                          </span>
                          <i
                            className={`fa-solid ${
                              showResults ? "fa-rotate" : "fa-calculator"
                            } text-[10px]`}
                          ></i>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMaxUnlockedStep((prev) =>
                          Math.max(prev, 4) as 1 | 2 | 3 | 4,
                        );
                        setCurrentStep(4);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-brand-600 dark:bg-emerald-600 hover:bg-brand-700 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Lanjut ke Saudara →</span>
                    </button>
                  )}
                </div>
              )}

              {currentStep === 4 && !saudaraMahjubByAll && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-bold text-xs hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    ← Kembali ke Keturunan
                  </button>
                  <button
                    type="button"
                    disabled={isCalculating}
                    onClick={handleHitungClick}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-wait transition-all active:scale-[0.99]"
                  >
                    {isCalculating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>
                          {showResults ? "Memperbarui..." : "Sedang Menghitung..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {showResults
                            ? isDirtyAfterCalc
                              ? "Perbarui Hasil Waris"
                              : "Hitung Ulang & Lihat Hasil"
                            : "Selesai & Lihat Hasil"}
                        </span>
                        <i
                          className={`fa-solid ${
                            showResults ? "fa-rotate" : "fa-calculator"
                          } text-xs`}
                        ></i>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Result Display Column (Right) - Tersembunyi by default, hanya muncul saat user klik tombol hitung */}
          {showResults && activeCalculation && (
            <div
              id="hasilCardSection"
              className={`lg:col-span-5 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-right-8 duration-500 transition-opacity ${
                isCalculating ? "opacity-60 pointer-events-none" : "opacity-100"
              }`}
            >
              {/* Notifikasi jika data form diubah setelah kalkulasi */}
              {isDirtyAfterCalc && (
                <div className="p-3 sm:p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/40 rounded-2xl border border-amber-300 dark:border-amber-800/80 flex items-center justify-between gap-2.5 sm:gap-3 text-amber-950 dark:text-amber-100 shadow-xs animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-900/60 border border-amber-200/80 dark:border-amber-700/80 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <i
                        className={`fa-solid fa-circle-exclamation text-xs ${
                          isCalculating ? "animate-pulse text-amber-600 dark:text-amber-400" : ""
                        }`}
                      ></i>
                    </div>
                    <div className="min-w-0 leading-tight sm:leading-normal">
                      <span className="block sm:inline text-xs font-bold text-amber-950 dark:text-amber-200">
                        Data berubah.
                      </span>{" "}
                      <span className="block sm:inline text-[11px] sm:text-xs text-amber-900/90 dark:text-amber-300/90 font-medium sm:font-bold">
                        Hasil belum diperbarui.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isCalculating}
                    onClick={handleHitungClick}
                    className={`px-3 sm:px-3.5 py-2 rounded-xl text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-all ${
                      isCalculating
                        ? "bg-brand-700 dark:bg-emerald-700 opacity-90 cursor-wait scale-95"
                        : "bg-brand-600 dark:bg-emerald-600 hover:bg-brand-700 dark:hover:bg-emerald-500 active:scale-95 hover:shadow-md"
                    }`}
                  >
                    {isCalculating ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                        <span>Memperbarui...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-arrows-rotate text-[11px]"></i>
                        <span>Perbarui</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Special Case Alert Banner (Akdariyah, Himariyah, Umariyyatain) */}
              {activeCalculation.kasusKhusus && (
                <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/40 rounded-3xl border border-amber-200 dark:border-amber-800/80 text-gray-900 dark:text-amber-100 shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-600 text-white flex items-center justify-center text-xs">
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <strong className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                      {activeCalculation.kasusKhusus}
                    </strong>
                  </div>
                  {activeCalculation.penjelasanSyari &&
                    activeCalculation.penjelasanSyari.length > 0 && (
                      <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed mt-1">
                        {activeCalculation.penjelasanSyari[0]}
                      </p>
                    )}
                </div>
              )}

              {/* Summary Card */}
              <div
                id="ringkasanHartaCard"
                className={`bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-4 sm:p-6 rounded-3xl shadow-xl border space-y-3.5 scroll-mt-20 md:scroll-mt-24 transition-all duration-700 ${
                  justUpdated
                    ? "ring-4 ring-emerald-400 border-emerald-500 shadow-2xl"
                    : "border-emerald-400/30 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2.5 border-gray-100 dark:border-slate-800 gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-brand-900 dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-transparent dark:border-emerald-800/60 flex items-center justify-center text-xs sm:text-sm">
                      <i className="fa-solid fa-file-invoice-dollar"></i>
                    </span>
                    <span>Ringkasan Harta</span>
                  </h3>
                  <span
                    id="statusFaroidBadge"
                    className={`text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      justUpdated
                        ? "bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-400"
                        : "bg-brand-100 dark:bg-slate-800 text-brand-800 dark:text-emerald-300 border border-transparent dark:border-slate-700"
                    }`}
                  >
                    {justUpdated ? (
                      <>
                        <i className="fa-solid fa-check text-emerald-600 dark:text-emerald-400 text-[10px]"></i>
                        <span>Hasil Diperbarui</span>
                      </>
                    ) : (
                      activeCalculation.badgeStatus
                    )}
                  </span>
                </div>

                {/* Clean 2-column mobile dashboard grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div className="p-2.5 sm:p-3 bg-gray-50/80 dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700/70">
                    <span className="block text-[10px] sm:text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                      Harta Kotor
                    </span>
                    <strong
                      id="dispHartaKotor"
                      className="block text-xs sm:text-sm text-gray-900 dark:text-white font-mono font-bold mt-0.5 truncate"
                    >
                      {formatRupiah(activeCalculation.hartaKotorVal)}
                    </strong>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/40">
                    <div className="flex items-center justify-between">
                      <span className="block text-[10px] sm:text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                        Kewajiban
                      </span>
                      {activeCalculation.wasiatIsCapped && (
                        <span
                          className="text-[8px] bg-rose-200/80 dark:bg-rose-900/70 text-rose-800 dark:text-rose-200 font-bold px-1 rounded"
                          title="Wasiat syar'i maksimal 1/3 dari harta setelah hutang"
                        >
                          Maks 1/3
                        </span>
                      )}
                    </div>
                    <strong
                      id="dispKewajiban"
                      className="block text-xs sm:text-sm text-rose-700 dark:text-rose-400 font-mono font-bold mt-0.5 truncate"
                    >
                      - {formatRupiah(activeCalculation.kewajibanTotal)}
                    </strong>
                  </div>

                  <div className="col-span-2 p-3 sm:p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/70 dark:from-emerald-950/50 dark:to-teal-950/40 rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block text-[11px] sm:text-xs font-bold text-emerald-950 dark:text-emerald-200">
                        Harta Bersih (Tarakah)
                      </span>
                      <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 hidden sm:block">
                        Siap dibagikan kepada ahli waris
                      </span>
                    </div>
                    <strong
                      id="dispHartaBersih"
                      className="font-mono text-sm sm:text-base font-black text-brand-900 dark:text-emerald-300 whitespace-nowrap"
                    >
                      {formatRupiah(activeCalculation.tarakah)}
                    </strong>
                  </div>
                </div>

                {activeCalculation.asalMasalah && (
                  <div className="pt-0.5 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 font-medium px-1">
                    <span>Asal Masalah:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-slate-200">
                      {activeCalculation.asalMasalah}
                      {activeCalculation.aulMasalah && (
                        <span className="text-amber-700 dark:text-amber-400 font-semibold ml-1">
                          (Ber-'Aul: {activeCalculation.aulMasalah})
                        </span>
                      )}
                      {activeCalculation.tashihMasalah && (
                        <span className="text-brand-700 dark:text-emerald-400 font-semibold ml-1">
                          (Tashih: {activeCalculation.tashihMasalah})
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Detailed Breakdown List Card */}
              <div
                id="rincianAhliWarisCard"
                className={`bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 p-4 sm:p-6 rounded-3xl shadow-xl border space-y-3 scroll-mt-20 md:scroll-mt-24 transition-all duration-700 ${
                  justUpdated
                    ? "ring-4 ring-emerald-400 border-emerald-500 shadow-2xl"
                    : "border-emerald-400/30 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2.5 border-gray-100 dark:border-slate-800">
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>Rincian Bagian Ahli Waris</span>
                  </h4>
                  <span
                    className="text-[11px] sm:text-xs bg-emerald-50 dark:bg-emerald-950/70 text-brand-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60"
                    id="totalPersenTerbagi"
                  >
                    {activeCalculation.totalPercentStr}
                  </span>
                </div>

                <div
                  id="detailBagian"
                  className="space-y-2 sm:space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5 sm:pr-1"
                >
                  {activeCalculation.results.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-500 dark:text-slate-400">
                      <i className="fa-solid fa-circle-info text-amber-500 dark:text-amber-400 mb-1 block text-base"></i>
                      Tidak ada ahli waris yang berhak menerima warisan atau
                      data belum lengkap.
                    </div>
                  ) : (
                    activeCalculation.results.map((r, i) => {
                      const totalFormatted = formatRupiah(r.totalRupiah);
                      const perPersonFormatted = formatRupiah(
                        r.perPersonRupiah,
                      );
                      const hasMultiple = r.count > 1;

                      return (
                        <div
                          key={i}
                          className={`p-3 sm:p-3.5 rounded-2xl ${r.badgeClass} dark:bg-slate-800/90 dark:border-slate-700/80 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all hover:shadow-xs`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <strong className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                                {r.name}
                              </strong>
                              {r.jenisBagian && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-white/90 dark:bg-slate-900/90 text-gray-600 dark:text-slate-300 font-semibold rounded border border-gray-200 dark:border-slate-700">
                                  {r.jenisBagian}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-brand-700 dark:text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span>{r.ket}</span>
                              <span className="text-gray-400 dark:text-slate-500">•</span>
                              <span className="font-semibold text-emerald-800 dark:text-emerald-300">{r.pct}%</span>
                              {r.saham && (
                                <>
                                  <span className="text-gray-400 dark:text-slate-500">•</span>
                                  <span className="text-gray-500 dark:text-slate-400 font-mono text-[10px]">
                                    Saham: {r.saham}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-1.5 sm:pt-0 border-gray-200/50 dark:border-slate-700/50 flex-shrink-0">
                            <span className="text-xs sm:text-sm font-mono font-black text-brand-900 dark:text-emerald-300">
                              {totalFormatted}
                            </span>
                            {hasMultiple && (
                              <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-white/95 dark:bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80 shadow-2xs mt-0.5">
                                @ {perPersonFormatted} /orang
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
