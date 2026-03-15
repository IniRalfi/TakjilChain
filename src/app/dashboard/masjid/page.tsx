import { prisma } from "@/lib/prisma";
import DashboardClientWrapper from "./DashboardClientWrapper";
import { withSafePrisma } from "@/lib/safe-prisma";

export const dynamic = "force-dynamic";

export default async function MasjidDashboard() {
  // Gunakan Safe Prisma Wrapper untuk menghindari error cold start/sync di Next.js
  const { allMasjids, allPesanan } = await withSafePrisma(async () => {
    const [masjids, pesanan] = await Promise.all([
      prisma.masjidProfile.findMany(),
      prisma.pesanan.findMany({
        include: {
          umkm: true,
          kuotaHarian: {
            include: { masjid: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { allMasjids: masjids, allPesanan: pesanan };
  });

  if (allMasjids.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-stone-200">
        <p className="text-stone-400 font-bold italic uppercase tracking-widest text-xs">
          Data masjid belum tersedia
        </p>
      </div>
    );
  }

  return <DashboardClientWrapper allMasjids={allMasjids} allPesanan={allPesanan} />;
}
