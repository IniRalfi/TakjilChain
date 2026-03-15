"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Package,
  Clock,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  Utensils,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import KonfirmasiButton from "./KonfirmasiButton";

export default function DashboardClientWrapper({
  allMasjids,
  allPesanan,
}: {
  allMasjids: any[];
  allPesanan: any[];
}) {
  const [activeMasjid, setActiveMasjid] = useState(allMasjids[0]);

  // 🔥 FIX BUG: Filter pesanan berdasarkan masjid yang aktif (Biar nggak bocor ke masjid lain)
  const filteredPesanan = useMemo(() => {
    return allPesanan.filter((p) => p.kuotaHarian.masjidProfileId === activeMasjid.id);
  }, [activeMasjid, allPesanan]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-6 pb-20">
      {/* 🏛️ SOFT SELECTOR */}
      <div className="flex flex-wrap items-center gap-3 p-2 bg-stone-100/80 backdrop-blur-md rounded-2xl w-full border border-stone-200/50">
        {allMasjids.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMasjid(m)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 flex-grow sm:flex-grow-0 justify-center ${
              activeMasjid.id === m.id
                ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                : "text-stone-500 hover:text-amber-600 bg-white sm:bg-transparent border border-stone-200 sm:border-transparent"
            }`}
          >
            <MapPin size={16} className={activeMasjid.id === m.id ? "opacity-100" : "opacity-40"} />
            {m.nama}
          </button>
        ))}
      </div>

      {/* 🟠 HARMONIOUS HEADER (Gradient Lembut) */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-50 to-orange-100 p-10 md:p-12 border border-amber-200/50 shadow-sm">
        {/* Subtle Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 blur-[80px] rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
                <MapPin size={28} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700/70">
                Manajemen Masjid
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-stone-900 italic tracking-tight mb-3">
              Dashboard Pengurus
            </h1>
            <p className="text-stone-500 font-medium max-w-md leading-relaxed text-base italic">
              "Khidmat melayani jamaah, mengelola berkah takjil setiap harinya."
            </p>
          </div>

          {/* Card Info (Warna Solid tapi Soft) */}
          <div className="bg-white p-8 rounded-[2rem] min-w-[300px] border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg w-fit mb-4 border border-amber-100">
              <span className="font-black text-[10px] tracking-widest uppercase">
                {activeMasjid.nama}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 mb-2 uppercase text-[10px] font-black tracking-widest">
              <TrendingUp size={14} /> Kapasitas Jamaah
            </div>
            <div className="text-4xl font-black text-stone-900 tracking-tighter">
              {activeMasjid.kapasitasJamaah || 0}{" "}
              <span className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1 block">
                Jiwa Per Hari
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 📦 ORDER LIST */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-900 tracking-tight px-2">
              Kiriman Takjil Hari Ini
            </h2>

            <div className="grid gap-4">
              {filteredPesanan.length === 0 ? (
                <div className="bg-stone-50 p-16 rounded-[2.5rem] border border-stone-100 text-center">
                  <Package size={32} className="text-stone-200 mx-auto mb-4" />
                  <p className="text-stone-400 font-bold italic">Belum ada donasi takjil masuk.</p>
                </div>
              ) : (
                filteredPesanan.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-white p-7 rounded-[2.5rem] border border-stone-100 shadow-sm hover:border-amber-200 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                      <div className="flex gap-4 items-center flex-1 w-full">
                        <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors shrink-0">
                          <Package size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="px-3 py-1 bg-stone-900 text-white text-[9px] font-black rounded-lg uppercase">
                              {p.jumlahPorsi} Porsi
                            </div>
                            <span className="text-[10px] font-bold text-stone-300 tracking-widest uppercase">
                              #{p.id.slice(0, 8)}
                            </span>
                          </div>
                          <h4 className="text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                            {p.umkm.namaUsaha}
                          </h4>
                          <p className="text-stone-400 text-xs font-medium uppercase tracking-tight flex items-center gap-1">
                            <Utensils size={12} /> Kebutuhan: {p.kuotaHarian.jenisRequest}
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3 border-t md:border-t-0 md:border-l border-stone-50 pt-4 md:pt-0 md:pl-6">
                        <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg">
                          {p.status}
                        </div>

                        {/* 🛠️ FIX: Tombol Konfirmasi Pesanan */}
                        <div className="w-full md:min-w-[160px]">
                          {p.status === "DELIVERED" ? (
                            <KonfirmasiButton pesananId={p.id} pengurusId={activeMasjid.userId} />
                          ) : p.status === "CONFIRMED" ? (
                            <div className="text-center py-3 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
                              <CheckCircle2 size={14} /> Berhasil Diterima
                            </div>
                          ) : (
                            <div className="text-center py-3 bg-stone-50 text-stone-400 text-[10px] font-bold rounded-xl border border-stone-100 flex items-center justify-center gap-2">
                              <Clock size={14} /> Menunggu Proses
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 📊 SIDEBAR (Minimalist) */}
        <div className="space-y-6">
          <AIInsightBox masjidId={activeMasjid.id} />
        </div>
      </div>
    </div>
  );
}

function AIInsightBox({ masjidId }: { masjidId: string }) {
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setInsight(
        "AI mendeteksi potensi lonjakan jamaah esok hari karena prediksi cuaca cerah & malam libur. Disarankan menambah 20 porsi cadangan.",
      );
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [masjidId]);

  return (
    <div className="bg-stone-950 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
        <Sparkles size={60} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest mb-6 italic">
          <div className="p-2 bg-stone-900 rounded-xl">
            <BrainCircuit size={20} />
          </div>
          AI Forecasting Insight
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-2.5 bg-stone-800 rounded-full w-full"></div>
            <div className="h-2.5 bg-stone-800 rounded-full w-5/6"></div>
          </div>
        ) : (
          <p className="text-stone-400 text-sm leading-relaxed font-medium italic">"{insight}"</p>
        )}

        <button className="mt-8 w-full py-4 bg-stone-900/50 hover:bg-amber-500 text-stone-300 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group border border-stone-800 hover:border-amber-400">
          Detail Rekomendasi{" "}
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
}
