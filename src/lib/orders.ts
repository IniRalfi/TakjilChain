import { prisma } from "./prisma";
import { StatusPesanan } from "../generated/prisma/client";
import { findNearestUMKM } from "./routing";

/**
 * Membuat Pesanan baru ke UMKM secara atomik.
 * Mengurangi sisaKapasitas UMKM dalam satu database transaction agar tidak ada race condition.
 */
export async function createPesanan(
  kuotaHarianId: string,
  umkmId: string,
  jumlahPorsi: number,
  attemptKe: number = 1,
  pesananSebelumId?: string,
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Lock & validasi kapasitas UMKM (cegah race condition)
    const umkm = await tx.umkmProfile.findUnique({
      where: { id: umkmId },
      select: { sisaKapasitas: true, namaUsaha: true },
    });

    if (!umkm) throw new Error("UMKM tidak ditemukan.");
    if (umkm.sisaKapasitas < jumlahPorsi) {
      throw new Error(
        `Kapasitas ${umkm.namaUsaha} tidak mencukupi. ` +
          `Butuh ${jumlahPorsi}, tersedia ${umkm.sisaKapasitas}.`,
      );
    }

    // 2. Kurangi kapasitas UMKM
    await tx.umkmProfile.update({
      where: { id: umkmId },
      data: { sisaKapasitas: { decrement: jumlahPorsi } },
    });

    // 3. Buat record Pesanan baru (logic kenaikan kuota masjid sudah dipindah ke checkout)
    const pesanan = await tx.pesanan.create({
      data: {
        kuotaHarianId,
        umkmProfileId: umkmId,
        jumlahPorsi,
        status: StatusPesanan.WAITING,
        attemptKe,
        pesananSebelumId,
      },
    });

    return pesanan;
  });
}

/**
 * Entry point utama setelah donasi PAID.
 * Jalankan Smart Routing lalu buat Pesanan.
 */
export async function prosesDonasiPaid(donasiId: string) {
  const donasi = await prisma.donasi.findUnique({
    where: { id: donasiId },
    include: {
      kuotaHarian: { include: { masjid: true } },
    },
  });

  if (!donasi) throw new Error("Donasi tidak ditemukan.");
  if (donasi.status !== "PAID") throw new Error("Donasi belum berstatus PAID.");

  const masjidProfileId = donasi.kuotaHarian.masjidProfileId;
  const umkmTerpilih = await findNearestUMKM(masjidProfileId, donasi.jumlahPorsi);

  if (!umkmTerpilih) {
    console.error(`[ROUTING] Tidak ada UMKM tersedia untuk donasi ${donasiId}`);
    return null;
  }

  const pesanan = await createPesanan(
    donasi.kuotaHarianId,
    umkmTerpilih.umkmId,
    donasi.jumlahPorsi,
  );

  console.log(
    `[ROUTING] Pesanan ${pesanan.id} → ${umkmTerpilih.namaUsaha} ` +
      `(${umkmTerpilih.jarakKm} km dari masjid)`,
  );

  return pesanan;
}
