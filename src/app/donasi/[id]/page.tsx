import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle2, HeartHandshake, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DonasiSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Lakukan polling ringan (atau ambil data saat ini)
  const donasi = await prisma.donasi.findUnique({
    where: { id },
    include: {
      kuotaHarian: { include: { masjid: true } },
    },
  });

  if (!donasi) return notFound();

  // Ini case saat donatur ngebuka halamannya langsung, nunggu AI nulis cerita
  const isPaid = donasi.status === "PAID";
  const hasNarasi = !!donasi.narasiAI;

  return (
    <div className="max-w-2xl mx-auto mt-12 space-y-6">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="mx-auto w-max mb-6">
          {isPaid ? (
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-main">
              <CheckCircle2 size={48} />
            </div>
          ) : (
            <div className="bg-amber-100 p-4 rounded-full text-amber-main animate-pulse">
              <HeartHandshake size={48} />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-charcoal mb-4">
          {isPaid ? "Alhamdulillah! Pembayaran Berhasil" : "Menunggu Pembayaran..."}
        </h1>
        <p className="text-charcoal-muted text-lg mb-8 max-w-md mx-auto">
          Terima kasih banyak orang baik. Anda telah menyumbangkan{" "}
          <strong className="text-emerald-main">{donasi.jumlahPorsi} porsi</strong> takjil untuk{" "}
          <strong>{donasi.kuotaHarian.masjid.nama}</strong>.
        </p>

        {/* Kotak Impact Report (Hasil Narasi AI) */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-left relative overflow-hidden">
          <h3 className="text-emerald-main font-bold flex items-center gap-2 mb-3">
            <Sparkles size={18} /> Impact Report (Real-time)
          </h3>

          {hasNarasi ? (
            <div className="prose prose-sm prose-emerald">
              <p className="text-charcoal leading-relaxed font-medium italic">
                "{donasi.narasiAI}"
              </p>
            </div>
          ) : (
            <div className="text-sm text-charcoal-muted">
              {isPaid
                ? "Sistem Logistik TakjilChain sedang mencarikan UMKM terbaik untuk pesanan Anda. Kami akan mengirimkan kisah/laporan distribusi di halaman ini segera setelah takjil tiba di masjid."
                : "Selesaikan pembayaran Anda di link Mayar untuk mengaktifkan logistik kami."}
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <a href="/" className="text-emerald-main font-medium hover:underline">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
