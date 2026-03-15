import { prisma } from "@/lib/prisma";
import { StatusKuota } from "@/generated/prisma/client";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import MasjidListSection from "@/components/MasjidListSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listSemuaKuota = await prisma.kuotaHarian.findMany({
    where: { status: StatusKuota.OPEN },
    include: { masjid: true },
  });

  // Hapus Duplikat Masjid (Jika 1 masjid punya open kuota untuk 5 hari kedepan, tampilkan 1 saja dari hari terdekat/paling darurat)
  const mapUnik = new Map();
  for (const kuota of listSemuaKuota) {
    if (!mapUnik.has(kuota.masjidProfileId)) {
      mapUnik.set(kuota.masjidProfileId, kuota);
    } else {
      // Jika sudah ada, pilih mana yang paling sedikit terpenuhi (urutannya lebih kritis)
      const existing = mapUnik.get(kuota.masjidProfileId);
      const rasioBaru = kuota.kuotaTerpenuhi / kuota.kuotaTotal;
      const rasioLama = existing.kuotaTerpenuhi / existing.kuotaTotal;
      if (rasioBaru < rasioLama) {
        mapUnik.set(kuota.masjidProfileId, kuota);
      }
    }
  }

  // Ubah Map kembali ke array
  const listKuotaUnik = Array.from(mapUnik.values());

  // Urutkan List Unik berdasarkan urgensinya (dari yang paling butuh bantuan)
  const sortedByUrgency = listKuotaUnik.sort(
    (a, b) => a.kuotaTerpenuhi / a.kuotaTotal - b.kuotaTerpenuhi / b.kuotaTotal,
  );

  // Ambil 9 teratas buat page muka (front-page)
  const displayedKuota = sortedByUrgency.slice(0, 9);

  return (
    <div className="space-y-24">
      {/* Komponen Hero */}
      <HeroSection />

      {/* Komponen Deskripsi/How It Works */}
      <FeatureSection />

      {/* Komponen List Card Masjid. Oper data yang udah difilter bersih dari Prisma */}
      <MasjidListSection displayedKuota={displayedKuota} />
    </div>
  );
}
