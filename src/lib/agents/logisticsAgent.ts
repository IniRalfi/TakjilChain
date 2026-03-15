import { prisma } from "@/lib/prisma";
import { findNearestUMKM } from "@/lib/routing";
import { createPesanan } from "@/lib/orders";
import { StatusPesanan } from "@/generated/prisma/client";

/**
 * LOGISTICS AGENT
 * Mencari pesanan yang WAITING lebih dari 30 menit.
 * Jika ditemukan, otomatis batalkan pesanan lama dan oper pesanan ke
 * UMKM terdekat berikutnya yang memiliki kapasitas.
 */
export async function runLogisticsAgent() {
  console.log("🤖 [Logistics Agent] Memulai pengecekan pesanan kadaluwarsa...");

  // Waktu saat ini dikurangi 30 menit
  const batasWaktu = new Date();
  batasWaktu.setMinutes(batasWaktu.getMinutes() - 30);

  // Cari semua pesanan WAITING yang sudah lewat dari batas waktu
  const pesananTelat = await prisma.pesanan.findMany({
    where: {
      status: StatusPesanan.WAITING,
      createdAt: { lt: batasWaktu },
    },
    include: {
      umkm: true,
      kuotaHarian: true,
    },
  });

  if (pesananTelat.length === 0) {
    console.log("🤖 [Logistics Agent] Tidak ada pesanan bermasalah. Semua aman.");
    return { success: true, reReroutedCount: 0 };
  }

  console.log(
    `🤖 [Logistics Agent] Menemukan ${pesananTelat.length} pesanan telat. Memulai re-routing...`,
  );
  let reReroutedCount = 0;

  for (const p of pesananTelat) {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Set pesanan lama menjadi REJECTED (karena timeout)
        await tx.pesanan.update({
          where: { id: p.id },
          data: { status: StatusPesanan.REJECTED },
        });

        // 2. Kembalikan sisa kapasitas UMKM yang lama
        await tx.umkmProfile.update({
          where: { id: p.umkmProfileId },
          data: { sisaKapasitas: { increment: p.jumlahPorsi } },
        });

        // 3. Batalkan sementara kuota masjid, karena createPesanan akan menambahkan lagi
        await tx.kuotaHarian.update({
          where: { id: p.kuotaHarianId },
          data: { kuotaTerpenuhi: { decrement: p.jumlahPorsi } },
        });
      });

      // 4. Cari history UMKM yang sudah pernah menolak/timeout pesanan ini
      // Kita lacak chain berdasarkan `pesananSebelumId`
      const riwayatUmkmIds: string[] = [p.umkmProfileId];
      let pesananSebelum = p.pesananSebelumId;
      while (pesananSebelum) {
        const pLama = await prisma.pesanan.findUnique({
          where: { id: pesananSebelum },
          select: { umkmProfileId: true, pesananSebelumId: true },
        });
        if (pLama) {
          riwayatUmkmIds.push(pLama.umkmProfileId);
          pesananSebelum = pLama.pesananSebelumId;
        } else {
          pesananSebelum = null;
        }
      }

      // 5. Cari UMKM alternatif (exclude semua yang ada di riwayat)
      const umkmBaru = await findNearestUMKM(
        p.kuotaHarian.masjidProfileId,
        p.jumlahPorsi,
        riwayatUmkmIds,
      );

      if (!umkmBaru) {
        console.error(
          `🤖 [Logistics Agent] GAGAL re-route pesanan ${p.id}. Tidak ada UMKM lain yang tersedia.`,
        );
        // Note: Dalam production sungguhan, kita send notifikasi ke Admin/Refund ke donatur.
        continue;
      }

      // 6. Buat pesanan baru ke UMKM yang baru, tambahkan tingkat Attempt
      const attemptBaru = p.attemptKe + 1;
      const pesananBaru = await createPesanan(
        p.kuotaHarianId,
        umkmBaru.umkmId,
        p.jumlahPorsi,
        p.donasiId ?? undefined, // Tetap hubungkan ke donasiId asal
        attemptBaru,
        p.id, // ID pesanan lama sebagai referensi
      );

      console.log(
        `🤖 [Logistics Agent] ✅ Re-route sukses: Dari ${p.umkm.namaUsaha} ➡️ ke ${umkmBaru.namaUsaha} (Pesanan ${pesananBaru.id})`,
      );
      reReroutedCount++;
    } catch (error) {
      console.error(`🤖 [Logistics Agent] Error saat re-routing pesanan ${p.id}:`, error);
    }
  }

  return { success: true, reReroutedCount };
}
