import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { StatusPesanan } from "@/generated/prisma/client";

// Inisialisasi Google Gemini dengan API Key
const ai = new GoogleGenAI({
  apiKey: process.env["GEMINI_API_KEY"],
});

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

    // 1. Buat prompt
    const userPrompt = `
      Anda adalah "Agent Reporter" TakjilChain yang bertugas membuat laporan narasi donasi.
      Tulis satu paragraf singkat (maksimal 3-4 kalimat) yang menyentuh hati dan estetik untuk seorang donatur.
      Laporan ini akan dikirim via WhatsApp atau Email kepada mereka.

      Gunakan bahasa Indonesia yang sopan, islami, namun tetap terasa modern.
      Hindari penggunaan emoji yang terlalu banyak. Gunakan tone yang apresiatif dan bersyukur.

      Data Transaksi yang harus dimasukkan ke dalam narasi:
      - Nama Masjid Penerima: ${masjid.nama}
      - Jumlah Porsi Tersalurkan: ${pesanan.jumlahPorsi} porsi
      - UMKM Pembuat Takjil: ${umkm.namaUsaha}
      - Waktu Tiba di Masjid: ${waktuAntarStr} WIB

      Buatkan narasinya sekarang!
    `.trim();

    console.log(`🤖 [Reporting Agent] Menghasilkan narasi untuk Pesanan ${pesananId}...`);

    // 2. Panggil API Gemini dengan SDK terbaru (@google/genai)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });

    const narasi = response.text || "Takjil telah sukses dan aman diantar ke tujuan!";

    console.log("🤖 [Reporting Agent] Narasi Selesai generated!");

    // 3. Simpan Narasi
    const donasiTerkait = await prisma.donasi.findFirst({
      where: {
        kuotaHarianId: pesanan.kuotaHarianId,
        jumlahPorsi: pesanan.jumlahPorsi,
        status: "PAID",
      },
    });

    if (donasiTerkait) {
      await prisma.donasi.update({
        where: { id: donasiTerkait.id },
        data: { narasiAI: narasi },
      });
      console.log(`🤖 [Reporting Agent] Sukses menyimpan narasi ke Donasi ${donasiTerkait.id}.`);
    }

    return narasi;
  } catch (error) {
    console.error("🤖 [Reporting Agent] GAGAL generate narasi AI:", error);
    return null;
  }
}
