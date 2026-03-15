import { prisma } from "@/lib/prisma";
import { StatusPesanan } from "@/generated/prisma/client";
import { runAIWithFailover } from "@/lib/ai-handler";

const DEFAULT_NARASI =
  "Takjil telah sukses dan aman diantar ke tujuan! Terima kasih atas sedekah Anda yang sangat berarti bagi jamaah.";

export async function generateNarasiAI(pesananId: string) {
  try {
    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pesananId },
      include: {
        kuotaHarian: { include: { masjid: true } },
        umkm: true,
      },
    });

    if (!pesanan || pesanan.status !== StatusPesanan.CONFIRMED) {
      console.warn(`🤖 [Reporting Agent] Pesanan ${pesananId} belum CONFIRMED.`);
      return null;
    }

    const { masjid } = pesanan.kuotaHarian;
    const { umkm } = pesanan;

    const waktuAntarStr = pesanan.deliveredAt
      ? new Date(pesanan.deliveredAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "beberapa saat sebelum waktu berbuka";

    const userPrompt = `
      Anda adalah "Agent Reporter" TakjilChain yang bertugas membuat laporan narasi donasi.
      Tulis satu paragraf singkat (maksimal 3-4 kalimat) yang menyentuh hati dan estetik untuk seorang donatur.
      
      Gunakan bahasa Indonesia yang sopan, islami, namun tetap terasa modern.
      Hindari emoji berlebihan. Tone: apresiatif dan bersyukur.

      DATA WAJIB MASUK:
      - Masjid: ${masjid.nama}
      - Jumlah: ${pesanan.jumlahPorsi} porsi
      - UMKM: ${umkm.namaUsaha}
      - Waktu Tiba: ${waktuAntarStr} WIB
    `.trim();

    // Menggunakan AI Core Handler dengan Failover
    const narasi = await runAIWithFailover(userPrompt, DEFAULT_NARASI);

    // Simpan ke database
    if (pesanan.donasiId) {
      await prisma.donasi.update({
        where: { id: pesanan.donasiId },
        data: { narasiAI: narasi },
      });
    }

    return narasi;
  } catch (error) {
    console.error("🤖 [Reporting Agent] UNEXPECTED ERROR:", error);
    return null;
  }
}
