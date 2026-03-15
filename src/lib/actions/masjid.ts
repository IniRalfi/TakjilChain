"use server";

import { prisma } from "@/lib/prisma";
import { StatusPesanan } from "@/generated/prisma/client";

/**
 * Server Action: Masjid mengkonfirmasi bahwa takjil sudah diterima.
 * Ini men-trigger pencairan dana ke saldo UMKM.
 *
 * @param pesananId - ID pesanan yang ingin dikonfirmasi
 * @param pengurusId - ID user pengurus masjid (untuk otorisasi)
 */
export async function konfirmasiTerima(pesananId: string, pengurusId: string) {
  // 1. Ambil pesanan & validasi kepemilikan
  const pesanan = await prisma.pesanan.findUnique({
    where: { id: pesananId },
    include: {
      kuotaHarian: { include: { masjid: true } },
      umkm: true,
    },
  });

  if (!pesanan) {
    return { success: false, error: "Pesanan tidak ditemukan." };
  }

  // 2. Pastikan pengurus yang konfirmasi adalah pengurus masjid yang benar
  if (pesanan.kuotaHarian.masjid.userId !== pengurusId) {
    return { success: false, error: "Tidak diizinkan mengkonfirmasi pesanan ini." };
  }

  // 3. Pastikan pesanan sudah berstatus DELIVERED (UMKM sudah upload foto)
  if (pesanan.status !== StatusPesanan.DELIVERED) {
    return {
      success: false,
      error: "Pesanan belum berstatus DELIVERED. Tunggu UMKM upload foto bukti terlebih dahulu.",
    };
  }

  // 4. Jalankan dalam transaction: update status + cairkan dana ke UMKM
  try {
    await prisma.$transaction(async (tx) => {
      // Update pesanan → CONFIRMED
      await tx.pesanan.update({
        where: { id: pesananId },
        data: {
          status: StatusPesanan.CONFIRMED,
          confirmedAt: new Date(),
        },
      });

      // Hitung dana yang harus dicairkan
      const danaCair = pesanan.jumlahPorsi * pesanan.umkm.hargaPerPorsi;

      // Tambah saldo UMKM
      await tx.umkmProfile.update({
        where: { id: pesanan.umkmProfileId },
        data: { saldo: { increment: danaCair } },
      });
    });

    console.log(
      `[KONFIRMASI] Pesanan ${pesananId} CONFIRMED. ` +
        `Dana Rp${(pesanan.jumlahPorsi * pesanan.umkm.hargaPerPorsi).toLocaleString("id-ID")} ` +
        `→ saldo ${pesanan.umkm.namaUsaha}`,
    );

    // TODO Phase 3: Trigger AI Narrative Reporting di sini
    // await generateNarasiAI(pesanan.id);

    return { success: true, pesananId };
  } catch (error) {
    console.error("[KONFIRMASI] Error:", error);
    return { success: false, error: "Gagal mengkonfirmasi pesanan." };
  }
}
