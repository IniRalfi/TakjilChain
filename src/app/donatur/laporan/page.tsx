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
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LaporanDampakPage() {
  // Ambil semua donasi yang sudah PAID
  // (Idealnya difilter by User ID jika sudah ada Auth)
  const listDonasi = await prisma.donasi.findMany({
    where: { status: "PAID" },
    include: {
      kuotaHarian: { include: { masjid: true } },
      pesanan: { include: { umkm: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 mt-6">
      {/* 🟠 HEADER */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-stone-950 p-10 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
                <Heart size={28} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/70">
                Kontribusi Anda
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tight mb-3">
              Laporan Dampak.
            </h1>
            <p className="text-stone-400 font-medium max-w-md leading-relaxed text-base italic">
              "Terima kasih telah menjadi bagian dari kebaikan. Pantau setiap butir nasi yang Anda
              sumbangkan."
            </p>
          </div>

          <div className="bg-stone-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-stone-800 min-w-[280px]">
            <div className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">
              Total Kebaikan
            </div>
            <div className="text-4xl font-black text-amber-500 tracking-tighter">
              {listDonasi.reduce((acc, curr) => acc + curr.jumlahPorsi, 0)}
              <span className="text-xs text-stone-500 font-bold uppercase tracking-widest ml-2 italic">
                Porsi Terbagi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 LIST DONASI */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-stone-900 tracking-tight px-2 italic">
          Jejak Sedekah Anda
        </h2>

        {listDonasi.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-stone-100 text-center shadow-sm">
            <Heart size={48} className="text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 font-bold italic">Anda belum memiliki riwayat donasi.</p>
            <Link
              href="/#daftar-masjid"
              className="mt-6 inline-block px-8 py-3 bg-amber-500 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all"
            >
              Mulai Donasi
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {listDonasi.map((d) => {
              const statusMapping = {
                WAITING: {
                  label: "Mencari UMKM",
                  icon: Search,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                },
                ACCEPTED: {
                  label: "UMKM Memasak",
                  icon: ChefHat,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                },
                DELIVERED: {
                  label: "Dalam Pengantaran",
                  icon: Truck,
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
                CONFIRMED: {
                  label: "Tiba di Masjid",
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                },
              };

              const currentStatus = d.pesanan
                ? statusMapping[d.pesanan.status as keyof typeof statusMapping]
                : {
                    label: "Menyiapkan Logistik",
                    icon: Clock,
                    color: "text-stone-400",
                    bg: "bg-stone-50",
                  };

              return (
                <div
                  key={d.id}
                  className="group bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:border-amber-200 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-8 justify-between lg:items-center">
                    {/* Info Utama */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-4 py-1.5 rounded-full ${currentStatus.bg} ${currentStatus.color} text-[10px] font-black uppercase tracking-widest flex items-center gap-2`}
                        >
                          <currentStatus.icon size={12} />
                          {currentStatus.label}
                        </div>
                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
                          #{d.id.slice(-8)}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-2xl font-black text-stone-900 group-hover:text-amber-600 transition-colors italic">
                          {d.kuotaHarian.masjid.nama}
                        </h4>
                        <div className="flex items-center gap-2 text-stone-400 text-xs font-medium mt-1">
                          <MapPin size={14} className="text-stone-300" />
                          {d.kuotaHarian.masjid.alamat}
                        </div>
                      </div>

                      <div className="flex gap-8 border-t border-stone-50 pt-4">
                        <div>
                          <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                            Jumlah
                          </p>
                          <p className="text-lg font-black text-stone-900 italic">
                            {d.jumlahPorsi} Porsi
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                            Tanggal
                          </p>
                          <p className="text-lg font-black text-stone-900 italic">
                            {new Date(d.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                        {d.pesanan && (
                          <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                              Mitra UMKM
                            </p>
                            <p className="text-lg font-black text-stone-900 italic">
                              {d.pesanan.umkm.namaUsaha}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tombol Aksi & Tracker Detail */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      <Link
                        href={`/donasi/${d.id}`}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-stone-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-md shadow-stone-900/10 group/btn"
                      >
                        Lihat Live Tracker{" "}
                        <ChevronRight
                          size={14}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Link>

                      {d.narasiAI && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 relative overflow-hidden">
                          <Sparkles
                            size={14}
                            className="absolute top-2 right-2 text-amber-400 opacity-50"
                          />
                          <p className="text-[10px] text-amber-700 font-bold leading-relaxed italic">
                            "AI telah menulis laporan dampak untuk donasi ini."
                          </p>
                        </div>
                      )}
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
