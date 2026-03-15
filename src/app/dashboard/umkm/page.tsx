import { prisma } from "@/lib/prisma";
import { StatusPesanan } from "@/generated/prisma/client";
import { MapPin, ChefHat } from "lucide-react";
import UmkmActionsClient from "./UmkmActionsClient";

export const dynamic = "force-dynamic";

export default async function DashboardUmkmPage() {
  // Simulasi Auth: Ambil salah satu user UMKM
  const userUmkm = await prisma.user.findFirst({
    where: { role: "UMKM" },
    include: { umkmProfile: true },
  });

  if (!userUmkm || !userUmkm.umkmProfile) {
    return <div className="p-8 text-center text-rose-500">Akses ditolak. Anda bukan UMKM.</div>;
  }

  const umkmProfileId = userUmkm.umkmProfile.id;

  // Dapatkan daftar Pesanan yang masuk ke UMKM ini
  const pesananMasuk = await prisma.pesanan.findMany({
    where: { umkmProfileId: umkmProfileId },
    include: {
      kuotaHarian: { include: { masjid: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 mt-8">
      {/* Header Profile Dashboard */}
      <div className="bg-amber-main text-white p-8 rounded-3xl shadow-md border border-amber-500">
        <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
          <ChefHat size={32} /> Dashboard UMKM
        </h1>
        <p className="opacity-90 text-lg flex items-center gap-2">
          {userUmkm.umkmProfile.namaUsaha}
        </p>
      </div>

      <div className="flex gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-max">
          <p className="text-charcoal-muted text-sm font-medium">Saldo Dompet</p>
          <p className="text-2xl font-bold text-emerald-main mt-1">
            Rp {userUmkm.umkmProfile.saldo.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-max">
          <p className="text-charcoal-muted text-sm font-medium">Sisa Kapasitas</p>
          <p className="text-2xl font-bold text-amber-main mt-1">
            {userUmkm.umkmProfile.sisaKapasitas} Porsi
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-4">Daftar Orderan Takjil</h2>

        {pesananMasuk.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center shadow-sm">
            <p className="text-charcoal-muted">Belum ada pesanan yang masuk.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {pesananMasuk.map((pesanan) => (
              <div
                key={pesanan.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-50 text-emerald-main text-xs font-bold px-2 py-1 rounded">
                      {pesanan.jumlahPorsi} Porsi
                    </span>
                    <span className="text-xs text-charcoal-muted bg-gray-50 px-2 py-1 rounded">
                      ID: {pesanan.id.slice(0, 8)}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-charcoal mb-1">
                    Tujuan: {pesanan.kuotaHarian.masjid.nama}
                  </h4>
                  <p className="text-sm text-charcoal-muted flex items-start gap-1">
                    <MapPin size={16} className="shrink-0 mt-0.5" />
                    {pesanan.kuotaHarian.masjid.alamat}
                  </p>

                  <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-charcoal-muted mb-1">Status Pembayaran</p>
                    <p className="font-bold text-emerald-main text-sm">
                      Sudah Dibayar Donatur (Siap Proses)
                    </p>
                  </div>
                </div>

                {/* Bagian Actions / Status Badge */}
                <div className="mt-6">
                  {pesanan.status === StatusPesanan.WAITING && (
                    <UmkmActionsClient
                      pesananId={pesanan.id}
                      umkmId={umkmProfileId}
                      mode="TERIMA"
                    />
                  )}
                  {pesanan.status === StatusPesanan.ACCEPTED && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                        Harap segera dimasak dan diantar ke masjid.
                      </p>
                      <UmkmActionsClient
                        pesananId={pesanan.id}
                        umkmId={umkmProfileId}
                        mode="SELESAI_ANTAR"
                      />
                    </div>
                  )}
                  {pesanan.status === StatusPesanan.DELIVERED && (
                    <span className="block w-full text-center bg-gray-100 text-charcoal-muted px-4 py-3 rounded-lg text-sm font-bold">
                      Menunggu Konfirmasi Masjid
                    </span>
                  )}
                  {pesanan.status === StatusPesanan.CONFIRMED && (
                    <span className="block w-full text-center bg-emerald-100 text-emerald-700 px-4 py-3 rounded-lg text-sm font-bold">
                      Selesai! Dana Telah Cair
                    </span>
                  )}
                  {pesanan.status === StatusPesanan.REJECTED && (
                    <span className="block w-full text-center bg-rose-100 text-rose-700 px-4 py-3 rounded-lg text-sm font-bold">
                      Dibatalkan
                    </span>
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
