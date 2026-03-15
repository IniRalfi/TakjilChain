import { prisma } from "@/lib/prisma";
import { StatusKuota } from "@/generated/prisma/client";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import MasjidListSection from "@/components/MasjidListSection";
import { withSafePrisma } from "@/lib/safe-prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Ambil semua kuota OPEN dengan mekanisme Safe-Prisma (Retry & Delay)
  const listSemuaKuota = await withSafePrisma(async () => {
    return await prisma.kuotaHarian.findMany({
      where: { status: StatusKuota.OPEN },
      include: { masjid: true },
      orderBy: { tanggal: "asc" },
    });
  });

  // Hapus Duplikat Masjid (Ambil hanya 1 hari terdekat per masjid)
  const mapUnik = new Map();
  for (const kuota of listSemuaKuota) {
    if (!mapUnik.has(kuota.masjidProfileId)) {
      mapUnik.set(kuota.masjidProfileId, kuota);
    }
  }

  // Ubah Map kembali ke array
  const listKuotaUnik = Array.from(mapUnik.values());

  // Urutkan List Unik berdasarkan urgensinya (dari yang paling butuh bantuan / rasio terkecil)
  const sortedByUrgency = listKuotaUnik.sort(
    (a, b) => a.kuotaTerpenuhi / a.kuotaTotal - b.kuotaTerpenuhi / b.kuotaTotal,
  );

  // Ambil 9 teratas buat page muka (front-page)
  const displayedKuota = sortedByUrgency.slice(0, 9);

  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      <HeroSection />
      <FeatureSection />
      <MasjidListSection displayedKuota={displayedKuota} />
    </div>
  );
}
