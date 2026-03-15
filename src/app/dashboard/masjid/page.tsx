import { prisma } from "@/lib/prisma";
import DashboardClientWrapper from "./DashboardClientWrapper";

export default async function MasjidDashboard() {
  // 1. Ambil semua profil masjid
  const allMasjids = await prisma.masjidProfile.findMany();

  // 2. Handle kalau data masih kosong
  if (allMasjids.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-dashed">
        <p className="text-gray-400">Data masjid belum di-seed. Jalankan seeder dulu ya!</p>
      </div>
    );
  }

  // 3. Ambil SEMUA pesanan (Kita filter di Client biar responsif pas ganti masjid)
  const allPesanan = await prisma.pesanan.findMany({
    include: {
      umkm: true,
      kuotaHarian: {
        include: { masjid: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <DashboardClientWrapper allMasjids={allMasjids} allPesanan={allPesanan} />;
}
