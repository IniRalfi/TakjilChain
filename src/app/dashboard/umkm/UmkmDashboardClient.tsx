"use client";

import { useState, useMemo } from "react";
import {
  ChefHat,
  Wallet,
  Store,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  Utensils,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import UmkmActionsClient from "./UmkmActionsClient";

export default function UmkmDashboardClient({
  allUmkms,
  allPesanan,
}: {
  allUmkms: any[];
  allPesanan: any[];
}) {
  const [activeUmkm, setActiveUmkm] = useState(allUmkms[0]);

  const filteredPesanan = useMemo(() => {
    return allPesanan.filter((p) => p.umkmProfileId === activeUmkm.id);
  }, [activeUmkm, allPesanan]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-6 pb-20">
      {/* 🏛️ SOFT SELECTOR (Background adem) */}
      <div className="flex items-center gap-3 p-1.5 bg-stone-100/80 backdrop-blur-md rounded-2xl w-fit border border-stone-200/50 max-w-full overflow-x-auto no-scrollbar">
        {allUmkms.map((u) => (
          <button
            key={u.id}
            onClick={() => setActiveUmkm(u)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
              activeUmkm.id === u.id
                ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                : "text-stone-500 hover:text-amber-600"
            }`}
          >
            <Store size={16} className={activeUmkm.id === u.id ? "opacity-100" : "opacity-40"} />
            {u.namaUsaha}
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
                <ChefHat size={28} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700/70">
                Mitra Produksi
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-stone-900 italic tracking-tight mb-3">
              Dapur Berkah
            </h1>
            <p className="text-stone-500 font-medium max-w-md leading-relaxed text-base italic">
              Kelola pesanan takjil untuk jamaah dengan penuh keberkahan.
            </p>
          </div>

          {/* Card Saldo (Warna Solid tapi Soft) */}
          <div className="bg-white p-8 rounded-[2rem] min-w-[300px] border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 mb-2 uppercase text-[10px] font-black tracking-widest">
              <Wallet size={14} /> Total Saldo
            </div>
            <div className="text-4xl font-black text-stone-900 tracking-tighter">
              Rp {activeUmkm.saldo.toLocaleString("id-ID")}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
              <TrendingUp size={12} /> Dana Siap Cair
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 📦 ORDER LIST */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-900 tracking-tight px-2">Pesanan Aktif</h2>

            <div className="grid gap-4">
              {filteredPesanan.length === 0 ? (
                <div className="bg-stone-50 p-16 rounded-[2.5rem] border border-stone-100 text-center">
                  <Package size={32} className="text-stone-200 mx-auto mb-4" />
                  <p className="text-stone-400 font-bold italic">Belum ada pesanan masuk.</p>
                </div>
              ) : (
                filteredPesanan.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-white p-7 rounded-[2.5rem] border border-stone-100 shadow-sm hover:border-amber-200 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                      <div className="flex gap-4 items-center flex-1">
                        <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors shrink-0">
                          <Utensils size={24} />
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
                            {p.kuotaHarian.masjid.nama}
                          </h4>
                          <p className="text-stone-400 text-xs font-medium flex items-center gap-1">
                            <MapPin size={12} /> {p.kuotaHarian.masjid.alamat.split(",")[0]}
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3 border-t md:border-t-0 md:border-l border-stone-50 pt-4 md:pt-0 md:pl-6">
                        <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg">
                          {p.status}
                        </div>
                        <div className="w-full md:min-w-[160px]">
                          {p.status === "WAITING" && (
                            <UmkmActionsClient
                              pesananId={p.id}
                              umkmId={activeUmkm.id}
                              mode="TERIMA"
                            />
                          )}
                          {p.status === "ACCEPTED" && (
                            <UmkmActionsClient
                              pesananId={p.id}
                              umkmId={activeUmkm.id}
                              mode="SELESAI_ANTAR"
                            />
                          )}
                          {p.status === "DELIVERED" && (
                            <div className="text-center py-3 bg-stone-50 text-stone-400 text-[10px] font-bold rounded-xl border border-stone-100">
                              Menunggu Masjid
                            </div>
                          )}
                          {p.status === "CONFIRMED" && (
                            <div className="text-center py-3 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
                              <CheckCircle2 size={14} /> Selesai
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
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6 px-1">
              Kapasitas Produksi
            </h3>
            <div className="flex items-end gap-2 mb-4 px-1">
              <span className="text-5xl font-black text-stone-900">{activeUmkm.sisaKapasitas}</span>
              <span className="text-sm font-bold text-stone-300 mb-2 uppercase">Porsi Sisa</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${(activeUmkm.sisaKapasitas / 200) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-stone-950 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Sparkles size={60} />
            </div>
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 italic">
              Insight Dapur
            </h3>
            <p className="text-stone-400 text-sm font-medium leading-relaxed italic">
              "Ramadhan ini dapurmu sangat produktif! 100% pesanan terkonfirmasi sukses."
            </p>
            <button className="mt-6 flex items-center gap-2 text-xs font-black text-amber-500 hover:text-white transition-colors">
              Lihat Statistik <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
