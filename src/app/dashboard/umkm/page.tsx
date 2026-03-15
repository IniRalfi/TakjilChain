import { prisma } from "@/lib/prisma";
import UmkmDashboardClient from "./UmkmDashboardClient";
import { withSafePrisma } from "@/lib/safe-prisma";

export const dynamic = "force-dynamic";

export default async function DashboardUmkmPage() {
  // Gunakan Safe Prisma Wrapper untuk menghindari error cold start/sync di Next.js
  const { allUmkms, allPesanan } = await withSafePrisma(async () => {
    const [umkms, pesanan] = await Promise.all([
      prisma.umkmProfile.findMany({
        include: { user: true },
      }),
      prisma.pesanan.findMany({
        include: {
          kuotaHarian: { include: { masjid: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { allUmkms: umkms, allPesanan: pesanan };
  });

  if (allUmkms.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-stone-200">
        <p className="text-stone-400 font-bold italic uppercase tracking-widest text-xs">
          Data UMKM belum tersedia
        </p>
      </div>
    );
  }

  return <UmkmDashboardClient allUmkms={allUmkms} allPesanan={allPesanan} />;
}
