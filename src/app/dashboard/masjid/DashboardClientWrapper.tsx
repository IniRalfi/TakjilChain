"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Package,
  Clock,
  TrendingUp,
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  Utensils,
  ChevronRight,
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

  // Bug Fix: Filter pesanan berdasarkan masjid yang aktif (Biar nggak sama semua)
  const filteredPesanan = useMemo(() => {
    return allPesanan.filter((p) => p.kuotaHarian.masjidProfileId === activeMasjid.id);
  }, [activeMasjid, allPesanan]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-6 pb-20">
      {/* 🏛️ SOFT SELECTOR */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar">
        {allMasjids.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMasjid(m)}
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border whitespace-nowrap ${
              activeMasjid.id === m.id
                ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200"
                : "bg-white text-stone-400 border-stone-100 hover:border-amber-200"
            }`}
          >
            {m.nama}
          </button>
        ))}
      </div>

      {/* 🌑 DARK PREMIUM HEADER (Sesuai gaya UMKM) */}
      <div className="relative group overflow-hidden rounded-[3rem] bg-stone-900 p-10 md:p-14 text-white shadow-2xl shadow-stone-900/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                <MapPin size={32} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">
                Manajemen Masjid
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 leading-none">
              Dashboard Pengurus
            </h1>
            <p className="text-stone-400 font-medium max-w-md leading-relaxed text-lg italic">
              "Khidmat melayani jamaah, mengelola berkah takjil setiap harinya."
            </p>
          </div>

          <div className="bg-stone-800/50 backdrop-blur-md border border-stone-700 p-8 rounded-[2.5rem] min-w-[300px]">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full w-fit mb-4">
              <span className="font-bold text-[10px] tracking-widest uppercase">
                {activeMasjid.nama}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 mb-2 uppercase text-[10px] font-black tracking-widest">
              <TrendingUp size={14} /> Kapasitas Jamaah
            </div>
            <div className="text-4xl font-black tracking-tighter">
              {activeMasjid.kapasitasJamaah || 0}{" "}
              <span className="text-sm text-stone-500 italic">Jiwa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* LIST PESANAN */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight px-2 flex items-center gap-2">
              <Package className="text-amber-500" /> Kiriman Takjil Hari Ini
            </h2>

            <div className="grid gap-4">
              {filteredPesanan.length === 0 ? (
                <div className="bg-stone-50 p-20 rounded-[3rem] border-2 border-dashed border-stone-200 text-center">
                  <p className="text-stone-400 font-bold italic">
                    Belum ada donasi takjil masuk untuk hari ini.
                  </p>
                </div>
              ) : (
                filteredPesanan.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-white p-7 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500"
                  >
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                      <div className="flex gap-5 items-center flex-1 w-full">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors duration-500 shrink-0">
                          <Utensils size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-3 py-1 bg-stone-900 text-white text-[9px] font-black rounded-lg uppercase">
                              {p.jumlahPorsi} Porsi
                            </span>
                            <span className="text-[10px] font-bold text-stone-300 tracking-widest uppercase">
                              #{p.id.slice(0, 8)}
                            </span>
                          </div>
                          <h4 className="text-xl font-black text-stone-900">{p.umkm.namaUsaha}</h4>
                          <p className="text-stone-400 text-xs font-medium uppercase tracking-tight">
                            Jenis: {p.kuotaHarian.jenisRequest}
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 text-center md:text-right">
                        <div className="mb-4">
                          <span className="text-[10px] font-black text-stone-300 uppercase block mb-1 tracking-widest">
                            Status
                          </span>
                          <span
                            className={`text-xs font-black uppercase tracking-widest ${p.status === "CONFIRMED" ? "text-emerald-600" : "text-amber-600"}`}
                          >
                            {p.status}
                          </span>
                        </div>

                        {/* 🛠️ FIX: Tombol Konfirmasi Pesanan */}
                        <div className="w-full md:min-w-[180px]">
                          {p.status === "DELIVERED" ? (
                            <KonfirmasiButton pesananId={p.id} pengurusId={activeMasjid.userId} />
                          ) : p.status === "CONFIRMED" ? (
                            <div className="py-3 px-4 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 border border-emerald-100">
                              <CheckCircle2 size={14} /> Berhasil Diterima
                            </div>
                          ) : (
                            <div className="py-3 px-4 bg-stone-50 text-stone-400 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                              <Clock size={14} /> {p.status}
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

        {/* 🤖 SIDEBAR */}
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
    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest mb-6">
          <div className="p-2 bg-amber-50 rounded-xl">
            <BrainCircuit size={20} />
          </div>
          AI Forecasting Insight
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-2.5 bg-stone-100 rounded-full w-full"></div>
            <div className="h-2.5 bg-stone-100 rounded-full w-5/6"></div>
          </div>
        ) : (
          <p className="text-stone-500 text-sm leading-relaxed font-medium italic">"{insight}"</p>
        )}

        <button className="mt-8 w-full py-4 bg-stone-900 text-white hover:bg-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group">
          Detail Rekomendasi{" "}
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
}
