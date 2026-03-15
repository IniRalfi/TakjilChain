import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Heart,
  ChevronRight,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  Search,
  Truck,
  Building2,
  ChefHat,
  PackageCheck,
  History,
} from "lucide-react";
import { withSafePrisma } from "@/lib/safe-prisma";

export const dynamic = "force-dynamic";

export default async function LaporanDampakPage() {
  // Ambil semua donasi yang sudah PAID dengan Safe Prisma Wrapper
  const listDonasi = await withSafePrisma(async () => {
    return await prisma.donasi.findMany({
      where: { status: "PAID" },
      include: {
        kuotaHarian: { include: { masjid: true } },
        pesanan: { include: { umkm: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 mt-6 px-4">
      {/* 🏛️ HEADER / HERO (Premium Dark Style) */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-stone-900 p-8 md:p-14 shadow-2xl border border-stone-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 rounded-2xl border border-stone-700 shadow-inner">
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                Impact Summary
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
              Jejak <span className="text-amber-500">Kebaikan.</span>
            </h1>
            <p className="text-stone-400 font-medium max-w-md leading-relaxed text-lg italic">
              "Terima kasih telah membersamai perjuangan UMKM dan memakmurkan Masjid di bulan suci."
            </p>
          </div>

          <div className="bg-stone-800/40 backdrop-blur-xl p-8 rounded-[3rem] border border-stone-700/50 flex flex-col items-center justify-center min-w-[260px] shadow-2xl">
            <div className="p-4 bg-amber-500 rounded-full mb-4 shadow-lg shadow-amber-500/20">
              <Heart size={32} className="text-white fill-white" />
            </div>
            <div className="text-center">
              <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">
                Total Porsi Dibagi
              </p>
              <div className="text-5xl font-black text-white tracking-tighter">
                {listDonasi.reduce((acc, curr) => acc + curr.jumlahPorsi, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 LIST SECTION */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
              <History size={20} />
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight italic">
              Riwayat Donasi
            </h2>
          </div>
        </div>

        {listDonasi.length === 0 ? (
          <div className="bg-white p-24 rounded-[3.5rem] border border-stone-100 text-center shadow-sm">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageCheck size={32} className="text-stone-200" />
            </div>
            <p className="text-stone-400 font-bold italic text-lg">
              Anda belum memiliki riwayat donasi.
            </p>
            <Link
              href="/#daftar-masjid"
              className="mt-8 inline-flex items-center gap-3 px-10 py-4 bg-stone-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-stone-200"
            >
              Mulai Sedekah <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {listDonasi.map((d) => {
              const statusMapping = {
                WAITING: {
                  label: "Mencari UMKM",
                  icon: Search,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  border: "border-amber-100",
                },
                ACCEPTED: {
                  label: "Proses Dapur",
                  icon: ChefHat,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  border: "border-amber-100",
                },
                DELIVERED: {
                  label: "Pengantaran",
                  icon: Truck,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  border: "border-blue-100",
                },
                CONFIRMED: {
                  label: "Sudah Sampai",
                  icon: CheckCircle2,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                  border: "border-emerald-100",
                },
              };

              const currentStatus = d.pesanan
                ? statusMapping[d.pesanan.status as keyof typeof statusMapping]
                : {
                    label: "In-Queue",
                    icon: Clock,
                    color: "text-stone-400",
                    bg: "bg-stone-50",
                    border: "border-stone-100",
                  };

              return (
                <div
                  key={d.id}
                  className="group bg-white p-2 rounded-[3.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500"
                >
                  <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10">
                    {/* Visual Status Left */}
                    <div className="flex flex-col items-center justify-center gap-4 py-8 px-10 bg-stone-50 rounded-[3rem] min-w-[180px] border border-stone-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors duration-500">
                      <div
                        className={`p-5 rounded-[2rem] shadow-sm ${currentStatus.bg} ${currentStatus.color}`}
                      >
                        <currentStatus.icon size={36} />
                      </div>
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest text-center ${currentStatus.color}`}
                      >
                        {currentStatus.label}
                      </p>
                    </div>

                    {/* Content Center */}
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">
                          ID: #{d.id.slice(-8).toUpperCase()}
                        </span>
                        {d.narasiAI && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100 shadow-sm animate-pulse">
                            <Sparkles size={12} className="text-amber-500" />
                            <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest italic">
                              AI Report Ready
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-3xl font-black text-stone-900 group-hover:text-amber-600 transition-colors italic tracking-tighter leading-tight">
                          {d.kuotaHarian.masjid.nama}
                        </h4>
                        <div className="flex items-center gap-2 text-stone-400 text-sm font-medium italic">
                          <MapPin size={16} className="text-amber-500/50" />
                          {d.kuotaHarian.masjid.alamat}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-stone-50">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">
                            Jumlah
                          </p>
                          <p className="text-xl font-black text-stone-900 italic tracking-tighter">
                            {d.jumlahPorsi} <span className="text-xs uppercase">Porsi</span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">
                            Kontribusi
                          </p>
                          <p className="text-xl font-black text-stone-900 italic tracking-tighter">
                            Rp {d.totalHarga.toLocaleString("id-ID")}
                          </p>
                        </div>
                        {d.pesanan && (
                          <div className="space-y-1 col-span-2 lg:col-span-1">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">
                              Mitra Produksi
                            </p>
                            <p className="text-lg font-black text-stone-900 italic tracking-tighter truncate">
                              {d.pesanan.umkm.namaUsaha}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        <Link
                          href={`/donasi/${d.id}`}
                          className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 bg-stone-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-stone-200 group/btn"
                        >
                          Buka Live Tracker{" "}
                          <ChevronRight
                            size={16}
                            className="group-hover/btn:translate-x-1 transition-transform"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
