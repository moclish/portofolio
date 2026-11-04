/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { MawarisInputState, StatusPasangan, MazhabKakek } from '../types/mawaris';
import { calculateMawaris } from '../utils/mawarisCalculator';
import { parseMoney, formatRupiah } from '../utils/formatters';

interface MawarisCalculatorProps {
  onShowToast: (msg: string) => void;
}

export const MawarisCalculator: React.FC<MawarisCalculatorProps> = ({ onShowToast }) => {
  // Raw inputs for formatted money strings
  const [hartaKotorRaw, setHartaKotorRaw] = useState('0');
  const [biayaJenazahRaw, setBiayaJenazahRaw] = useState('0');
  const [hutangRaw, setHutangRaw] = useState('0');
  const [wasiatRaw, setWasiatRaw] = useState('0');

  // Step Wizard active step: 1 (Harta) | 2 (Pasangan & Ortu) | 3 (Keturunan) | 4 (Saudara)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 2: Pasangan & Leluhur
  const [statusPasangan, setStatusPasangan] = useState<StatusPasangan>('none');
  const [jmlIstri, setJmlIstri] = useState(1);
  const [adaAyah, setAdaAyah] = useState(false);
  const [adaIbu, setAdaIbu] = useState(false);
  const [adaKakek, setAdaKakek] = useState(false);
  const [adaNenek, setAdaNenek] = useState(false);
  const [mazhabKakek, setMazhabKakek] = useState<MazhabKakek>('jumhur');

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

  // Auto-reset to Step 1 if Harta is cleared
  useEffect(() => {
    if (!isHartaEntered && currentStep > 1) {
      setCurrentStep(1);
    }
  }, [isHartaEntered, currentStep]);

  const hasMaleFuru = anakLaki > 0 || cucuLaki > 0;
  const hasFemaleFuru = anakPerempuan > 0 || cucuPerempuan > 0;
  const hasFuru = hasMaleFuru || hasFemaleFuru;

  // Saudara mahjub total jika ada Anak Laki-Laki, Cucu Laki-Laki, Ayah,
  // ATAU Kakek menurut madzhab Hanafi (bukan Jumhur).
  const saudaraMahjubByAll =
    anakLaki > 0 ||
    cucuLaki > 0 ||
    adaAyah ||
    (adaKakek && mazhabKakek === 'hanafi');

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
    canShowKeponakan &&
    keponakanLakiKandung === 0 &&
    keponakanLakiSeayah === 0;

  const canShowSepupu =
    canShowPaman &&
    pamanKandung === 0 &&
    pamanSeayah === 0;

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
  }, [keponakanLakiKandung, keponakanLakiSeayah, pamanKandung, pamanSeayah, sepupuLakiKandung, sepupuLakiSeayah]);

  useEffect(() => {
    if (keponakanLakiSeayah > 0) {
      if (pamanKandung > 0) setPamanKandung(0);
      if (pamanSeayah > 0) setPamanSeayah(0);
      if (sepupuLakiKandung > 0) setSepupuLakiKandung(0);
      if (sepupuLakiSeayah > 0) setSepupuLakiSeayah(0);
    }
  }, [keponakanLakiSeayah, pamanKandung, pamanSeayah, sepupuLakiKandung, sepupuLakiSeayah]);

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
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) {
      setter('');
      return;
    }
    setter(parseInt(digits, 10).toLocaleString('id-ID'));
  };

  const stepNumber = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number,
    min = 0,
    max = 99
  ) => {
    setter((prev) => Math.min(max, Math.max(min, prev + delta)));
  };

  // Structured list of active Mahjub rules (HANYA Hajb Hirman / Terhalang Penuh agar layar tidak penuh)
  const activeMahjubAlerts = useMemo(() => {
    const alerts: { target: string; by: string; detail: string }[] = [];

    if (adaAyah) {
      alerts.push({
        target: 'Kakek',
        by: 'Ayah Kandung',
        detail: 'Kakek terhalang penuh karena Ayah berderajat nasab lebih dekat.',
      });
    }
    if (adaIbu) {
      alerts.push({
        target: 'Nenek',
        by: 'Ibu Kandung',
        detail: 'Seluruh nenek terhalang oleh keberadaan Ibu Kandung.',
      });
    }
    if (anakLaki > 0) {
      alerts.push({
        target: 'Cucu (dr Anak Laki)',
        by: 'Anak Laki-Laki',
        detail: 'Cucu terhalang oleh anak laki-laki utama.',
      });
    }
    if (saudaraMahjubByAll) {
      const penyebab = adaAyah
        ? 'Ayah Kandung'
        : anakLaki > 0
        ? 'Anak Laki-Laki'
        : cucuLaki > 0
        ? 'Cucu Laki-Laki'
        : 'Kakek (Mazhab Hanafi)';
      alerts.push({
        target: 'Seluruh Saudara & Kerabat',
        by: penyebab,
        detail: 'Saudara, keponakan, paman, dan sepupu terhalang secara total.',
      });
    } else {
      if (sdraLakiKandung > 0) {
        alerts.push({
          target: 'Saudara Seayah & Kerabat Bawah',
          by: 'Sdr. Laki Kandung',
          detail: 'Saudara kandung menggugurkan saudara seayah dan seluruh kerabat paman/sepupu.',
        });
      } else if (isSdraPrKandungAsabahMaalGhair) {
        alerts.push({
          target: 'Saudara Seayah & Kerabat Bawah',
          by: 'Sdr. Pr Kandung (\'Asabah)',
          detail: 'Saudari kandung menjadi asabah ma\'al ghair sehingga menghalangi saudara seayah dan kerabat bawah.',
        });
      } else if (isSdraPrSeayahAsabahMaalGhair) {
        alerts.push({
          target: 'Keponakan & Paman',
          by: 'Sdr. Pr Seayah (\'Asabah)',
          detail: 'Saudari seayah menjadi asabah ma\'al ghair sehingga menghalangi keponakan dan paman.',
        });
      }
      if (hasFuru || adaKakek || adaAyah) {
        alerts.push({
          target: 'Saudara Seibu',
          by: hasFuru ? 'Keturunan (Furu\')' : 'Ayah / Kakek',
          detail: 'Saudara seibu gugur oleh keturunan maupun ushul laki-laki.',
        });
      }
      if (sdraLakiSeayah > 0) {
        alerts.push({
          target: 'Keponakan & Paman',
          by: 'Sdr. Laki Seayah',
          detail: 'Saudara laki-laki seayah menghalangi keponakan dan paman.',
        });
      }
      if (keponakanLakiKandung > 0) {
        alerts.push({
          target: 'Keponakan Seayah & Paman',
          by: 'Keponakan Kandung',
          detail: 'Keponakan kandung menghalangi keponakan seayah serta paman.',
        });
      }
      if (keponakanLakiSeayah > 0) {
        alerts.push({
          target: 'Paman & Sepupu',
          by: 'Keponakan Seayah',
          detail: 'Keponakan seayah menghalangi seluruh paman dan sepupu.',
        });
      }
      if (pamanKandung > 0) {
        alerts.push({
          target: 'Paman Seayah & Sepupu',
          by: 'Paman Kandung',
          detail: 'Paman kandung menghalangi paman seayah dan sepupu.',
        });
      }
      if (pamanSeayah > 0) {
        alerts.push({
          target: 'Seluruh Sepupu',
          by: 'Paman Seayah',
          detail: 'Paman seayah menghalangi seluruh anak paman (sepupu).',
        });
      }
      if (sepupuLakiKandung > 0) {
        alerts.push({
          target: 'Sepupu Seayah',
          by: 'Sepupu Kandung',
          detail: 'Sepupu kandung menghalangi sepupu seayah.',
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
  const inputState: MawarisInputState = useMemo(() => ({
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
  }), [
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
  ]);

  const calculation = useMemo(() => calculateMawaris(inputState), [inputState]);

  const handleHitungClick = () => {
    onShowToast('Perhitungan waris berhasil diperbarui!');
    const el = document.getElementById('hasilCardSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="simulator"
      className="py-16 md:py-20 bg-gradient-to-br from-emerald-900 via-brand-900 to-teal-950 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <i className="fa-solid fa-calculator"></i> Tool Interaktif
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Kalkulator Waris
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Sistem kalkulasi waris komprehensif
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Form Inputs Column (Left) */}
          <div className="lg:col-span-7 bg-white text-gray-900 p-5 sm:p-7 rounded-3xl shadow-2xl border border-emerald-400/30 space-y-5">
            {/* Step Navigation Header */}
            {!isHartaEntered ? (
              <div className="flex items-center justify-between bg-emerald-50/80 px-4 py-2.5 rounded-2xl border border-emerald-100 text-xs text-brand-900 font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  <span>Harta & Kewajiban</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 p-1.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 overflow-x-auto shadow-2xs">
                {[
                  { step: 1 as const, label: '1. Harta', icon: 'fa-coins' },
                  { step: 2 as const, label: '2. Pasangan & Ortu', icon: 'fa-users' },
                  { step: 3 as const, label: '3. Keturunan', icon: 'fa-child-reaching' },
                  ...(!saudaraMahjubByAll
                    ? [{ step: 4 as const, label: '4. Saudara', icon: 'fa-people-roof' }]
                    : []),
                ].map((item) => {
                  const isActive = currentStep === item.step;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setCurrentStep(item.step)}
                      className={`flex-1 min-w-fit px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-white/80 text-gray-700 hover:bg-white border border-emerald-100'
                      }`}
                    >
                      <i
                        className={`fa-solid ${item.icon} text-[10px] ${
                          isActive ? 'text-white' : 'text-brand-600'
                        }`}
                      ></i>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 1: Harta & Kewajiban */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <h3 className="text-sm font-extrabold text-brand-800 flex items-center gap-2">
                    <i className="fa-solid fa-coins text-amber-500"></i>
                    <span>Total Harta & Kewajiban</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500">Langkah 1 dari {saudaraMahjubByAll ? '3' : '4'}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Total Harta <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="hartaKotor"
                      value={hartaKotorRaw}
                      onChange={(e) => handleMoneyChange(e.target.value, setHartaKotorRaw)}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-brand-500 font-bold text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Biaya Jenazah
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="biayaJenazah"
                      value={biayaJenazahRaw}
                      onChange={(e) => handleMoneyChange(e.target.value, setBiayaJenazahRaw)}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Hutang Mayyit
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="hutang"
                      value={hutangRaw}
                      onChange={(e) => handleMoneyChange(e.target.value, setHutangRaw)}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Wasiat (Maks 1/3)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="wasiat"
                      value={wasiatRaw}
                      onChange={(e) => handleMoneyChange(e.target.value, setWasiatRaw)}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!isHartaEntered}
                    onClick={() => setCurrentStep(2)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                      isHartaEntered
                        ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer active:scale-[0.99]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                  >
                    <span>Lanjut ke Langkah 2: Pasangan & Ortu</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                  {!isHartaEntered && (
                    <p className="text-[11px] text-center text-gray-500 mt-2">
                      💡 Masukkan nominal Total Harta di atas untuk membuka langkah pemilihan ahli waris.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Pasangan & Orang Tua */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <h3 className="text-sm font-extrabold text-brand-800 flex items-center gap-2">
                    <i className="fa-solid fa-users text-brand-600"></i>
                    <span>Pasangan & Orang Tua</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500">Langkah 2 dari {saudaraMahjubByAll ? '3' : '4'}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Status Yang Meninggal
                    </label>
                    <select
                      id="statusPasangan"
                      value={statusPasangan}
                      onChange={(e) => setStatusPasangan(e.target.value as StatusPasangan)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 bg-white focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="none">Tidak Ada Pasangan (atau Belum/Tidak Menikah)</option>
                      <option value="istri">Suami Meninggal (Mewariskan ke Istri)</option>
                      <option value="suami">Istri Meninggal (Mewariskan ke Suami)</option>
                    </select>
                  </div>

                  {statusPasangan === 'istri' && (
                    <div className="p-3 bg-warmbg rounded-2xl border border-gray-200/70 flex items-center justify-between animate-in fade-in duration-200">
                      <div>
                        <span className="block text-xs font-bold text-gray-800">Jumlah Istri</span>
                        <span className="text-[11px] text-gray-500">Berbagi rata bagian 1/4 atau 1/8</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => stepNumber(setJmlIstri, -1, 1, 4)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-brand-800">{jmlIstri}</span>
                        <button
                          type="button"
                          onClick={() => stepNumber(setJmlIstri, 1, 1, 4)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Orang Tua (Kakek & Nenek hanya tampil jika TIDAK terhalang) */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Orang Tua & Leluhur yang Masih Hidup:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        adaAyah ? 'bg-brand-50 border-brand-300 text-brand-900 font-bold' : 'bg-gray-50/70 border-gray-200 text-gray-700'
                      }`}>
                        <input
                          type="checkbox"
                          checked={adaAyah}
                          onChange={(e) => setAdaAyah(e.target.checked)}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-xs">Ayah Kandung</span>
                      </label>

                      <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        adaIbu ? 'bg-brand-50 border-brand-300 text-brand-900 font-bold' : 'bg-gray-50/70 border-gray-200 text-gray-700'
                      }`}>
                        <input
                          type="checkbox"
                          checked={adaIbu}
                          onChange={(e) => setAdaIbu(e.target.checked)}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-xs">Ibu Kandung</span>
                      </label>

                      {/* Kakek HANYA ditampilkan jika TIDAK terhalang oleh Ayah */}
                      {!adaAyah && (
                        <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all animate-in fade-in duration-200 ${
                          adaKakek ? 'bg-brand-50 border-brand-300 text-brand-900 font-bold' : 'bg-gray-50/70 border-gray-200 text-gray-700'
                        }`}>
                          <input
                            type="checkbox"
                            checked={adaKakek}
                            onChange={(e) => setAdaKakek(e.target.checked)}
                            className="rounded text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-xs">Kakek (dr Ayah)</span>
                        </label>
                      )}

                      {/* Nenek HANYA ditampilkan jika TIDAK terhalang oleh Ibu */}
                      {!adaIbu && (
                        <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all animate-in fade-in duration-200 ${
                          adaNenek ? 'bg-brand-50 border-brand-300 text-brand-900 font-bold' : 'bg-gray-50/70 border-gray-200 text-gray-700'
                        }`}>
                          <input
                            type="checkbox"
                            checked={adaNenek}
                            onChange={(e) => setAdaNenek(e.target.checked)}
                            className="rounded text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-xs">Nenek</span>
                        </label>
                      )}
                    </div>

                    {/* Mazhab Kakek jika Kakek ada */}
                    {adaKakek && !adaAyah && (
                      <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-1.5 animate-in fade-in duration-200">
                        <span className="block text-[11px] font-bold text-brand-900">
                          Kaidah Kakek Bersama Saudara:
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMazhabKakek('jumhur')}
                            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                              mazhabKakek === 'jumhur'
                                ? 'bg-brand-600 text-white shadow-xs'
                                : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                          >
                            Jumhur (Muqasamah)
                          </button>
                          <button
                            type="button"
                            onClick={() => setMazhabKakek('hanafi')}
                            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                              mazhabKakek === 'hanafi'
                                ? 'bg-brand-600 text-white shadow-xs'
                                : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                          >
                            Hanafi (Kakek Halangi Saudara)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    ← Kembali ke Harta
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Lanjut ke Keturunan →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Keturunan (Furu') */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <h3 className="text-sm font-extrabold text-brand-800 flex items-center gap-2">
                    <i className="fa-solid fa-child-reaching text-blue-600"></i>
                    <span>Anak & Keturunan Mayyit</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500">Langkah 3 dari {saudaraMahjubByAll ? '3' : '4'}</span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-gray-900">Anak Laki-Laki</span>
                        <span className="text-[10px] text-gray-500">'Asabah Binafsihi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => stepNumber(setAnakLaki, -1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-brand-800">{anakLaki}</span>
                        <button
                          type="button"
                          onClick={() => stepNumber(setAnakLaki, 1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-gray-900">Anak Perempuan</span>
                        <span className="text-[10px] text-gray-500">1/2, 2/3, atau 'Asabah</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => stepNumber(setAnakPerempuan, -1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-brand-800">{anakPerempuan}</span>
                        <button
                          type="button"
                          onClick={() => stepNumber(setAnakPerempuan, 1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cucu HANYA ditampilkan jika TIDAK terhalang oleh Anak Laki-Laki */}
                  {anakLaki === 0 && (
                    <div className="pt-1 space-y-2 animate-in fade-in duration-200">
                      <span className="block text-xs font-bold text-gray-700">
                        Cucu (dari Jalur Anak Laki-Laki):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-warmbg rounded-2xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900">Cucu Laki-Laki</span>
                            <span className="text-[10px] text-gray-500">dr Anak Laki-Laki</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => stepNumber(setCucuLaki, -1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800">{cucuLaki}</span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setCucuLaki, 1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-warmbg rounded-2xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900">Cucu Perempuan</span>
                            <span className="text-[10px] text-gray-500">dr Anak Laki-Laki</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => stepNumber(setCucuPerempuan, -1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800">{cucuPerempuan}</span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setCucuPerempuan, 1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    ← Kembali ke Ortu
                  </button>
                  {saudaraMahjubByAll ? (
                    <button
                      type="button"
                      onClick={handleHitungClick}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Lihat Hasil Perhitungan</span>
                      <i className="fa-solid fa-arrow-down text-[10px]"></i>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md cursor-pointer"
                    >
                      Lanjut ke Saudara →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Saudara, Paman & Kerabat Mayyit (Hanya jika TIDAK mahjub total) */}
            {currentStep === 4 && !saudaraMahjubByAll && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <h3 className="text-sm font-extrabold text-brand-800 flex items-center gap-2">
                    <i className="fa-solid fa-people-roof text-purple-600"></i>
                    <span>Saudara, Paman & Kerabat</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500">Langkah 4 dari 4</span>
                </div>

                <div className="space-y-3">
                  {/* Saudara Kandung */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-gray-700">Saudara Kandung:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-gray-900">Sdr Laki Kandung</span>
                          <span className="text-[10px] text-gray-500">'Asabah</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => stepNumber(setSdraLakiKandung, -1, 0, 99)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-brand-800">{sdraLakiKandung}</span>
                          <button
                            type="button"
                            onClick={() => stepNumber(setSdraLakiKandung, 1, 0, 99)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-gray-900">Sdr Pr Kandung</span>
                          <span className="text-[10px] text-gray-500">1/2, 2/3, atau 'Asabah</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => stepNumber(setSdraPerempuanKandung, -1, 0, 99)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-brand-800">{sdraPerempuanKandung}</span>
                          <button
                            type="button"
                            onClick={() => stepNumber(setSdraPerempuanKandung, 1, 0, 99)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                      <span className="block text-xs font-bold text-gray-700">Saudara Seayah:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-warmbg rounded-2xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900">Sdr Laki Seayah</span>
                            <span className="text-[10px] text-gray-500">'Asabah</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => stepNumber(setSdraLakiSeayah, -1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800">{sdraLakiSeayah}</span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setSdraLakiSeayah, 1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-warmbg rounded-2xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900">Sdr Pr Seayah</span>
                            <span className="text-[10px] text-gray-500">1/6, 1/2, 2/3, atau 'Asabah</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => stepNumber(setSdraPerempuanSeayah, -1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800">{sdraPerempuanSeayah}</span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setSdraPerempuanSeayah, 1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                    <div className="p-3 bg-warmbg rounded-2xl border border-gray-200 flex items-center justify-between animate-in fade-in duration-200">
                      <div>
                        <span className="block text-xs font-bold text-gray-900">Saudara / Saudari Seibu</span>
                        <span className="text-[10px] text-gray-500">1/6 (sendiri) atau 1/3 (2+ orang)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => stepNumber(setSdraSeibu, -1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-brand-800">{sdraSeibu}</span>
                        <button
                          type="button"
                          onClick={() => stepNumber(setSdraSeibu, 1, 0, 99)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Anak Saudara Laki-Laki (Keponakan) HANYA jika tidak terhalang saudara */}
                  {canShowKeponakan && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      <span className="block text-xs font-bold text-gray-700">
                        Anak Saudara Laki-Laki (Keponakan):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900">Keponakan Kandung</span>
                            <span className="text-[10px] text-gray-500">dr Sdr Laki Kandung ('Asabah)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => stepNumber(setKeponakanLakiKandung, -1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800">{keponakanLakiKandung}</span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setKeponakanLakiKandung, 1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {keponakanLakiKandung === 0 && (
                          <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between animate-in fade-in duration-200">
                            <div>
                              <span className="block text-xs font-bold text-gray-900">Keponakan Seayah</span>
                              <span className="text-[10px] text-gray-500">dr Sdr Laki Seayah ('Asabah)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => stepNumber(setKeponakanLakiSeayah, -1, 0, 99)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-sm text-brand-800">{keponakanLakiSeayah}</span>
                              <button
                                type="button"
                                onClick={() => stepNumber(setKeponakanLakiSeayah, 1, 0, 99)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                      <span className="block text-xs font-bold text-gray-700">
                        Paman (Saudara Laki-Laki Ayah):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900">Paman Kandung</span>
                            <span className="text-[10px] text-gray-500">Sdr Laki Kandung Ayah ('Asabah)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => stepNumber(setPamanKandung, -1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800">{pamanKandung}</span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setPamanKandung, 1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {pamanKandung === 0 && (
                          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between animate-in fade-in duration-200">
                            <div>
                              <span className="block text-xs font-bold text-gray-900">Paman Seayah</span>
                              <span className="text-[10px] text-gray-500">Sdr Laki Seayah Ayah ('Asabah)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => stepNumber(setPamanSeayah, -1, 0, 99)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-sm text-brand-800">{pamanSeayah}</span>
                              <button
                                type="button"
                                onClick={() => stepNumber(setPamanSeayah, 1, 0, 99)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                      <span className="block text-xs font-bold text-gray-700">
                        Anak Paman (Sepupu Laki-Laki):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-gray-900">Sepupu Laki Kandung</span>
                            <span className="text-[10px] text-gray-500">dr Paman Kandung ('Asabah)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => stepNumber(setSepupuLakiKandung, -1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-brand-800">{sepupuLakiKandung}</span>
                            <button
                              type="button"
                              onClick={() => stepNumber(setSepupuLakiKandung, 1, 0, 99)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {sepupuLakiKandung === 0 && (
                          <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100 flex items-center justify-between animate-in fade-in duration-200">
                            <div>
                              <span className="block text-xs font-bold text-gray-900">Sepupu Laki Seayah</span>
                              <span className="text-[10px] text-gray-500">dr Paman Seayah ('Asabah)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => stepNumber(setSepupuLakiSeayah, -1, 0, 99)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-sm text-brand-800">{sepupuLakiSeayah}</span>
                              <button
                                type="button"
                                onClick={() => stepNumber(setSepupuLakiSeayah, 1, 0, 99)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    ← Kembali ke Keturunan
                  </button>
                  <button
                    type="button"
                    onClick={handleHitungClick}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Selesai & Lihat Hasil</span>
                    <i className="fa-solid fa-arrow-down text-[10px]"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Smart, Compact, Informative Hajb Hirman Widget */}
            {activeMahjubAlerts.length > 0 && isHartaEntered && (
              <div className="p-3 bg-gradient-to-r from-amber-50/90 to-orange-50/70 rounded-2xl border border-amber-200/80 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                    <i className="fa-solid fa-shield-halved text-amber-600"></i>
                    <span>Kaidah Hajb Hirman Terdeteksi ({activeMahjubAlerts.length})</span>
                  </span>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    Sistem Otomatis Menyesuaikan
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeMahjubAlerts.map((item, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 border border-amber-200/90 text-[11px] shadow-2xs text-amber-950 font-medium"
                      title={item.detail}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <strong className="font-bold text-gray-900">{item.target}</strong>
                      <span className="text-gray-500 text-[10px]">terhalang oleh</span>
                      <span className="font-bold text-brand-800">{item.by}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Result Display Column (Right) */}
          <div id="hasilCardSection" className="lg:col-span-5 space-y-4 sm:space-y-5">
            {!isHartaEntered ? (
              /* Initial State Placeholder */
              <div
                id="placeholderResult"
                className="bg-white/10 backdrop-blur-md text-white p-6 sm:p-8 rounded-3xl border border-emerald-400/20 text-center space-y-3 py-12"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-2xl mx-auto border border-emerald-400/30">
                  <i className="fa-solid fa-calculator"></i>
                </div>
                <h4 className="text-base font-bold text-white">
                  Siap Menghitung Warisan
                </h4>
                <p className="text-xs text-emerald-200/80 max-w-xs mx-auto leading-relaxed">
                  Isi rincian harta & kewajiban dan hasilnya akan otomatis muncul di sini
                </p>
              </div>
            ) : (
              /* Real Results */
              <div id="realResultCards" className="space-y-4 sm:space-y-5">
                {/* Special Case Alert Banner (Akdariyah, Himariyah, Umariyyatain) */}
                {calculation.kasusKhusus && (
                  <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200 text-gray-900 shadow-md">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                        <i className="fa-solid fa-star"></i>
                      </span>
                      <strong className="text-xs font-extrabold text-amber-900">
                        {calculation.kasusKhusus}
                      </strong>
                    </div>
                    {calculation.penjelasanSyari && calculation.penjelasanSyari.length > 0 && (
                      <p className="text-[11px] text-amber-900/90 leading-relaxed mt-1">
                        {calculation.penjelasanSyari[0]}
                      </p>
                    )}
                  </div>
                )}

                {/* Summary Card */}
                <div className="bg-white text-gray-900 p-4 sm:p-6 rounded-3xl shadow-xl border border-emerald-400/30 space-y-3.5">
                  <div className="flex items-center justify-between border-b pb-2.5 border-gray-100 gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-brand-900 flex items-center gap-2">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs sm:text-sm">
                        <i className="fa-solid fa-file-invoice-dollar"></i>
                      </span>
                      <span>Ringkasan Harta</span>
                    </h3>
                    <span
                      id="statusFaroidBadge"
                      className="text-[11px] sm:text-xs bg-brand-100 text-brand-800 font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                    >
                      {calculation.badgeStatus}
                    </span>
                  </div>

                  {/* Clean 2-column mobile dashboard grid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                    <div className="p-2.5 sm:p-3 bg-gray-50/80 rounded-2xl border border-gray-100">
                      <span className="block text-[10px] sm:text-[11px] text-gray-500 font-medium">Harta Kotor</span>
                      <strong id="dispHartaKotor" className="block text-xs sm:text-sm text-gray-900 font-mono font-bold mt-0.5 truncate">
                        {formatRupiah(calculation.hartaKotorVal)}
                      </strong>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                      <div className="flex items-center justify-between">
                        <span className="block text-[10px] sm:text-[11px] text-rose-700 font-medium">Kewajiban</span>
                        {calculation.wasiatIsCapped && (
                          <span
                            className="text-[8px] bg-rose-200/80 text-rose-800 font-bold px-1 rounded"
                            title="Wasiat syar'i maksimal 1/3 dari harta setelah hutang"
                          >
                            Maks 1/3
                          </span>
                        )}
                      </div>
                      <strong id="dispKewajiban" className="block text-xs sm:text-sm text-rose-700 font-mono font-bold mt-0.5 truncate">
                        - {formatRupiah(calculation.kewajibanTotal)}
                      </strong>
                    </div>

                    <div className="col-span-2 p-3 sm:p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/70 rounded-2xl border border-emerald-200/90 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block text-[11px] sm:text-xs font-bold text-emerald-950">
                          Harta Bersih (Tarakah)
                        </span>
                        <span className="text-[10px] text-emerald-700/80 hidden sm:block">Siap dibagikan kepada ahli waris</span>
                      </div>
                      <strong id="dispHartaBersih" className="font-mono text-sm sm:text-base font-black text-brand-900 whitespace-nowrap">
                        {formatRupiah(calculation.tarakah)}
                      </strong>
                    </div>
                  </div>

                  {calculation.asalMasalah && (
                    <div className="pt-0.5 flex items-center justify-between text-[11px] text-gray-500 font-medium px-1">
                      <span>Asal Masalah:</span>
                      <span className="font-mono font-bold text-gray-800">
                        {calculation.asalMasalah}
                        {calculation.tashihMasalah && (
                          <span className="text-brand-700 font-semibold ml-1">
                            (Tashih: {calculation.tashihMasalah})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Detailed Breakdown List Card */}
                <div className="bg-white text-gray-900 p-4 sm:p-6 rounded-3xl shadow-xl border border-emerald-400/30 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2.5 border-gray-100">
                    <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                      <span>Rincian Bagian Ahli Waris</span>
                    </h4>
                    <span
                      className="text-[11px] sm:text-xs bg-emerald-50 text-brand-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200"
                      id="totalPersenTerbagi"
                    >
                      {calculation.totalPercentStr}
                    </span>
                  </div>

                  <div
                    id="detailBagian"
                    className="space-y-2 sm:space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5 sm:pr-1"
                  >
                    {calculation.results.length === 0 ? (
                      <div className="text-center py-6 text-xs text-gray-500">
                        <i className="fa-solid fa-circle-info text-amber-500 mb-1 block text-base"></i>
                        Tidak ada ahli waris yang berhak menerima warisan atau data belum lengkap.
                      </div>
                    ) : (
                      calculation.results.map((r, i) => {
                        const totalFormatted = formatRupiah(r.totalRupiah);
                        const perPersonFormatted = formatRupiah(r.perPersonRupiah);
                        const hasMultiple = r.count > 1;

                        return (
                          <div
                            key={i}
                            className={`p-3 sm:p-3.5 rounded-2xl ${r.badgeClass} border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all hover:shadow-xs`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <strong className="text-xs sm:text-sm font-extrabold text-gray-900">
                                  {r.name}
                                </strong>
                                {r.jenisBagian && (
                                  <span className="text-[9px] px-1.5 py-0.5 bg-white/90 text-gray-600 font-semibold rounded border border-gray-200">
                                    {r.jenisBagian}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-brand-700 font-medium flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span>{r.ket}</span>
                                <span className="text-gray-400">•</span>
                                <span className="font-semibold">{r.pct}%</span>
                                {r.saham && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500 font-mono text-[10px]">
                                      Saham: {r.saham}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-1.5 sm:pt-0 border-gray-200/50 flex-shrink-0">
                              <span className="text-xs sm:text-sm font-mono font-black text-brand-900">
                                {totalFormatted}
                              </span>
                              {hasMultiple && (
                                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-white/95 px-1.5 py-0.5 rounded border border-emerald-200 shadow-2xs mt-0.5">
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
      </div>
    </section>
  );
};
