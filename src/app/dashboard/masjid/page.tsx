import { prisma } from "@/lib/prisma";
import { StatusPesanan } from "@/generated/prisma/client";
import { CheckCircle2, Clock, MapPin, Package } from "lucide-react";
import KonfirmasiButton from "./KonfirmasiButton";
import { askForecastingAgent } from "@/lib/agents/forecastingAgent";

export const dynamic = "force-dynamic";

export default async function DashboardMasjidPage() {
  // Simulasi Auth: Ambil salah satu user Pengurus Masjid
  const userPengurus = await prisma.user.findFirst({
    where: { role: "PENGURUS_MASJID" },
    include: {
      masjidProfile: true, // Pastikan include masjidnya
    },
  });

  if (!userPengurus || !userPengurus.masjidProfile) {
    return (
      <div className="p-8 text-center text-rose-500">Anda tidak punya akses pengurus masjid.</div>
    );
  }

  const masjidProfileId = userPengurus.masjidProfile.id;

  // 1. Dapatkan daftar Pesanan yang menuju masjid ini (ambil lewat kuotaHarian)
  const pesananMasuk = await prisma.pesanan.findMany({
    where: {
      kuotaHarian: { masjidProfileId: masjidProfileId },
    },
    include: {
      umkm: true,
      kuotaHarian: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Tanya AI Forecasting (Misal ini hari ke-15 Ramadhan)
  const saranAI = await askForecastingAgent(masjidProfileId, 15);

  return (
    <div className="space-y-8">
      {/* Header Profile Dashboard */}
      <div className="bg-emerald-main text-white p-8 rounded-3xl shadow-md">
        <h1 className="text-3xl font-extrabold mb-2">Dashboard Pengurus</h1>
        <p className="opacity-90 text-lg flex items-center gap-2">
          <MapPin size={20} /> {userPengurus.masjidProfile.nama}
        </p>
      </div>

      {/* AI Insight Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full opacity-50 -z-0"></div>
        <div className="relative z-10">
          <h3 className="text-amber-main font-bold text-lg mb-2 flex items-center gap-2">
            ✨ AI Demand Forecast
          </h3>
          <p className="text-charcoal-muted leading-relaxed font-medium">"{saranAI}"</p>
        </div>
      </div>

      {/* Tabel Status Takjil */}
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-4">Kiriman Takjil Hari Ini</h2>

        {pesananMasuk.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center shadow-sm">
            <p className="text-charcoal-muted">Belum ada donasi takjil yang masuk hari ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pesananMasuk.map((pesanan) => (
              <div
                key={pesanan.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
              >
                <div className="flex gap-4 items-start">
                  <div className="bg-emerald-50 p-3 rounded-xl text-emerald-main shrink-0">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal">{pesanan.umkm.namaUsaha}</h4>
                    <p className="text-sm text-charcoal-muted mt-1">
                      {pesanan.jumlahPorsi} Porsi • Menu:{" "}
                      {pesanan.kuotaHarian.jenisRequest || "Bebas"}
                    </p>
                    <p className="text-xs text-charcoal-muted bg-gray-50 inline-block px-2 py-1 rounded mt-2">
                      ID: {pesanan.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                  {/* Status Badge */}
                  {pesanan.status === StatusPesanan.WAITING && (
                    <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                      <Clock size={12} /> Menunggu UMKM
                    </span>
                  )}
                  {pesanan.status === StatusPesanan.ACCEPTED && (
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold w-max">
                      Diproses UMKM
                    </span>
                  )}
                  {pesanan.status === StatusPesanan.DELIVERED && (
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold w-max">
                      Dalam Pengiriman / Telah Tiba
                    </span>
                  )}
                  {pesanan.status === StatusPesanan.CONFIRMED && (
                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                      <CheckCircle2 size={12} /> Selesai Diterima
                    </span>
                  )}
                  {pesanan.status === StatusPesanan.REJECTED && (
                    <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold w-max">
                      Dibatalkan / Re-route
                    </span>
                  )}

                  {/* Tombol Aksi (Hanya muncul jika statusnya DELIVERED) */}
                  {pesanan.status === StatusPesanan.DELIVERED && (
                    <KonfirmasiButton pesananId={pesanan.id} pengurusId={userPengurus.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
