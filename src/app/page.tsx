import { prisma } from "@/lib/prisma";
import { StatusKuota } from "@/generated/prisma/client";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import MasjidListSection from "@/components/MasjidListSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Ambil semua kuota OPEN dan urutkan dari tanggal terdekat
  const listSemuaKuota = await prisma.kuotaHarian.findMany({
    where: { status: StatusKuota.OPEN },
    include: { masjid: true },
    orderBy: { tanggal: "asc" },
  });

  // Hapus Duplikat Masjid (Ambil hanya 1 hari terdekat per masjid)
  const mapUnik = new Map();
  for (const kuota of listSemuaKuota) {
    if (!mapUnik.has(kuota.masjidProfileId)) {
      mapUnik.set(kuota.masjidProfileId, kuota);
    }
    // Jika sudah ada, abaikan, karena kita sudah urutkan by tanggal asc
    // jadi yang pertama masuk map pasti yang paling dekat harinya.
  }

  // Ubah Map kembali ke array
  const listKuotaUnik = Array.from(mapUnik.values());

  // Urutkan List Unik berdasarkan urgensinya (dari yang paling butuh bantuan / rasio terkecil)
  // Untuk di homepage, kita bisa sort by terpenuhi (paling kritis di atas)
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
