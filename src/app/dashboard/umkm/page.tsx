import { prisma } from "@/lib/prisma";
import UmkmDashboardClient from "./UmkmDashboardClient";

export default async function DashboardUmkmPage() {
  // 1. Ambil semua profil UMKM
  const allUmkms = await prisma.umkmProfile.findMany({
    include: { user: true },
  });

  const umkmAwal = allUmkms[0];

  if (!umkmAwal) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-dashed">
        <p className="text-gray-400">Data UMKM belum ada. Jalankan seeder dulu!</p>
      </div>
    );
  }

  // 2. Ambil SEMUA pesanan UMKM (Biar pas ganti tab, datanya langsung ada)
  const allPesanan = await prisma.pesanan.findMany({
    include: {
      kuotaHarian: { include: { masjid: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return <UmkmDashboardClient allUmkms={allUmkms} allPesanan={allPesanan} />;
}
