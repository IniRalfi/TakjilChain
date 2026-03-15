import { prisma } from "./prisma";

// ─── Haversine Formula ────────────────────────────────────────
// Menghitung jarak (km) antara dua titik koordinat GPS
function hitungJarak(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Smart Routing ────────────────────────────────────────────

interface HasilRouting {
  umkmId: string;
  namaUsaha: string;
  jarakKm: number;
  sisaKapasitas: number;
}

/**
 * Mencari UMKM terdekat dari sebuah Masjid yang
 * kapasitasnya masih mencukupi untuk memenuhi pesanan.
 *
 * @param masjidProfileId - ID profil masjid yang butuh takjil
 * @param jumlahPorsi     - Jumlah porsi yang dibutuhkan
 * @param excludeUmkmIds  - Daftar UMKM yang sudah di-reject (untuk re-routing)
 * @returns UMKM terpilih, atau null jika tidak ada yang tersedia
 */
export async function findNearestUMKM(
  masjidProfileId: string,
  jumlahPorsi: number,
  excludeUmkmIds: string[] = [],
): Promise<HasilRouting | null> {
  // 1. Ambil koordinat masjid
  const masjid = await prisma.masjidProfile.findUnique({
    where: { id: masjidProfileId },
    select: { koordinatLat: true, koordinatLng: true },
  });

  if (!masjid) throw new Error(`Masjid ${masjidProfileId} tidak ditemukan.`);

  // 2. Ambil semua UMKM yang kapasitasnya mencukupi & belum di-exclude
  const umkmList = await prisma.umkmProfile.findMany({
    where: {
      sisaKapasitas: { gte: jumlahPorsi },
      id: { notIn: excludeUmkmIds },
    },
    select: {
      id: true,
      namaUsaha: true,
      koordinatLat: true,
      koordinatLng: true,
      sisaKapasitas: true,
      ratingRataRata: true,
    },
  });

  if (umkmList.length === 0) return null;

  // 3. Hitung jarak masing-masing UMKM ke masjid
  const umkmDenganJarak = umkmList.map((u) => ({
    umkmId: u.id,
    namaUsaha: u.namaUsaha,
    jarakKm: hitungJarak(masjid.koordinatLat, masjid.koordinatLng, u.koordinatLat, u.koordinatLng),
    sisaKapasitas: u.sisaKapasitas,
    rating: u.ratingRataRata,
  }));

  // 4. Sort: jarak terdekat dulu, jika sama → rating tertinggi
  umkmDenganJarak.sort((a, b) =>
    a.jarakKm !== b.jarakKm ? a.jarakKm - b.jarakKm : b.rating - a.rating,
  );

  const terpilih = umkmDenganJarak[0];
  return {
    umkmId: terpilih.umkmId,
    namaUsaha: terpilih.namaUsaha,
    jarakKm: Math.round(terpilih.jarakKm * 100) / 100,
    sisaKapasitas: terpilih.sisaKapasitas,
  };
}
