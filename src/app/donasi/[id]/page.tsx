import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  ChefHat,
  Truck,
  Building2,
  Search,
  Check,
} from "lucide-react";
import Link from "next/link";
import { withSafePrisma } from "@/lib/safe-prisma";

export const dynamic = "force-dynamic";

export default async function DonasiSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Gunakan Safe Prisma Wrapper agar tidak timeout saat cold start/sync
  const { donasi, pesanan } = await withSafePrisma(async () => {
    const d = await prisma.donasi.findUnique({
      where: { id },
      include: {
        kuotaHarian: { include: { masjid: true } },
      },
    });

    if (!d) return { donasi: null, pesanan: null };

    const p = await prisma.pesanan.findFirst({
      where: { donasiId: d.id },
      include: { umkm: true },
      orderBy: { createdAt: "desc" },
    });

    return { donasi: d, pesanan: p };
  });

  if (!donasi) return notFound();

  const isPaid = donasi.status === "PAID";
  const hasNarasi = !!donasi.narasiAI;

  // Logic Phase Tracker
  const phases = [
    {
      id: "PAYMENT",
      label: "Donasi Diterima",
      icon: CheckCircle2,
      active: isPaid,
      completed: isPaid,
      desc: "Dana sudah masuk sistem.",
    },
    {
      id: "ROUTING",
      label: "Mencari UMKM",
      icon: Search,
      active: isPaid && !pesanan,
      completed: !!pesanan,
      desc: "AI sedang mencarikan UMKM terdekat.",
    },
    {
      id: "COOKING",
      label: "Proses Dapur",
      icon: ChefHat,
      active: pesanan?.status === "WAITING" || pesanan?.status === "ACCEPTED",
      completed: pesanan?.status === "DELIVERED" || pesanan?.status === "CONFIRMED",
      desc: pesanan?.umkm?.namaUsaha || "Menunggu UMKM konfirmasi.",
    },
    {
      id: "DELIVERY",
      label: "Pengantaran",
      icon: Truck,
      active: pesanan?.status === "DELIVERED",
      completed: pesanan?.status === "CONFIRMED",
      desc: "Takjil sedang menuju masjid.",
    },
    {
      id: "ARRIVED",
      label: "Tiba di Masjid",
      icon: Building2,
      active: pesanan?.status === "CONFIRMED",
      completed: pesanan?.status === "CONFIRMED",
      desc: "Sudah diterima pengurus.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-20 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 🟢 HERO CARD */}
      <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-sm border border-stone-100 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
          <HeartHandshake size={200} />
        </div>

        <div className="relative z-10">
          <div className="mx-auto w-max mb-8">
            {isPaid ? (
              <div className="bg-amber-500 p-5 rounded-3xl text-white shadow-xl shadow-amber-200">
                <CheckCircle2 size={48} />
              </div>
            ) : (
              <div className="bg-stone-100 p-5 rounded-3xl text-stone-400 animate-pulse">
                <HeartHandshake size={48} />
              </div>
            )}
          </div>

          <h1 className="text-4xl font-black text-stone-900 italic tracking-tight mb-4 text-balance">
            {isPaid ? "Alhamdulillah! Berkah Diterima" : "Terima Kasih, Sedang Diproses..."}
          </h1>
          <p className="text-stone-500 font-medium text-lg mb-8 max-w-xl mx-auto leading-relaxed italic">
            "Sedekah Anda sebanyak{" "}
            <span className="text-amber-600 font-black">{donasi.jumlahPorsi} porsi</span> sedang
            dalam perjalanan menjadi kebahagiaan bagi jamaah{" "}
            <span className="text-stone-900 font-bold">{donasi.kuotaHarian.masjid.nama}</span>."
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-stone-400 tracking-widest">
                Live Tracker Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📍 REAL-TIME TRACKER (Timeline style) */}
      <div className="bg-stone-950 p-8 md:p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800">
              <Truck size={24} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tight">Perjalanan Takjil Anda</h2>
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                Pantau distribusi secara langsung
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-6 relative">
            <div className="hidden md:block absolute top-[26px] left-[10%] right-[10%] h-[2px] bg-stone-800" />

            {phases.map((phase) => (
              <div
                key={phase.id}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${
                    phase.completed
                      ? "bg-amber-500 border-amber-400 text-white scale-110"
                      : phase.active
                        ? "bg-stone-900 border-amber-500 text-amber-500 animate-pulse"
                        : "bg-stone-900 border-stone-800 text-stone-600"
                  }`}
                >
                  {phase.completed ? <Check size={28} /> : <phase.icon size={24} />}
                </div>

                <div className="mt-6">
                  <h4
                    className={`text-sm font-black italic transition-colors ${phase.active || phase.completed ? "text-white" : "text-stone-600"}`}
                  >
                    {phase.label}
                  </h4>
                  <p
                    className={`text-[10px] font-bold mt-1 uppercase tracking-tighter leading-tight ${phase.completed ? "text-amber-500/70" : "text-stone-500"}`}
                  >
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✨ IMPACT REPORT BOX */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/50 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1 space-y-4">
            <h3 className="text-amber-600 font-black text-xs flex items-center gap-2 uppercase tracking-[0.2em] italic">
              <Sparkles size={18} className="fill-amber-500" />
              Impact Report by AI Agent
            </h3>

            {hasNarasi ? (
              <div className="space-y-4">
                <p className="text-stone-900 text-2xl font-black leading-tight italic tracking-tighter">
                  "{donasi.narasiAI}"
                </p>
                <div className="pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center shadow-sm">
                    <Sparkles size={16} className="text-amber-500" />
                  </div>
                  <p className="text-xs font-bold text-stone-500 leading-tight">
                    Laporan ini dibuat otomatis oleh{" "}
                    <span className="text-stone-900 underline decoration-amber-500 decoration-2">
                      Reporting Agent AI
                    </span>{" "}
                    berdasarkan bukti foto dari lapangan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-amber-200/30">
                <p className="text-stone-500 font-medium leading-relaxed italic text-balance">
                  {isPaid
                    ? "Logistik TakjilChain sedang bekerja di balik layar. Begitu takjil tiba di masjid, AI kami akan menuliskan rincian distribusi dan dampaknya khusus untuk Anda di sini."
                    : "Selesaikan pembayaran untuk mengaktifkan pelaporan real-time."}
                </p>
              </div>
            )}
          </div>

          <div className="w-full md:w-64 shrink-0 bg-white p-6 rounded-[2.5rem] border border-amber-200 shadow-sm shadow-amber-200/20">
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 italic">
              Penerima Manfaat
            </div>
            <p className="font-black text-stone-900 italic text-lg leading-tight mb-4">
              {donasi.kuotaHarian.masjid.nama}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black">
                {donasi.jumlahPorsi} Porsi
              </div>
              <div className="px-3 py-1 bg-stone-100 text-stone-500 rounded-lg text-[10px] font-black uppercase">
                Takjil Buka
              </div>
            </div>
            <Link
              href="/donatur/laporan"
              className="block w-full text-center py-4 bg-stone-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all duration-300"
            >
              Lihat Riwayat Donasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
