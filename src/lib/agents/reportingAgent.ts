import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { StatusPesanan } from "@/generated/prisma/client";

// Inisialisasi Google Gemini dengan API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
      console.warn(
        `🤖 [Reporting Agent] Pesanan ${pesananId} belum CONFIRMED atau tidak ditemukan.`,
      );
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

    // 1. Buat prompt untuk dikirim ke Gemini
    const prompt = `
      Anda adalah "Agent Reporter" TakjilChain yang bertugas membuat laporan narasi donasi.
      Tulis satu paragraf singkat (maksimal 3-4 kalimat) yang menyentuh hati dan estetik untuk seorang donatur.
      Laporan ini akan dikirim via WhatsApp atau Email kepada mereka.

      Gunakan bahasa Indonesia yang sopan, islami, namun tetap terasa modern.
      Hindari penggunaan emoji yang terlalu banyak. Gunakan tone yang apresiatif dan bersyukur.

      Data Transaksi yang harus dimasukkan ke dalam narasi:
      - Nama Masjid Penerima: ${masjid.nama}
      - Jumlah Porsi Tersalurkan: ${pesanan.jumlahPorsi} porsi
      - UMKM Pembuat Takjil: ${umkm.namaUsaha}
      - Hari/Tanggal Buka Puasa: ${new Date(pesanan.kuotaHarian.tanggal).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      - Jenis Takjil (optional): ${pesanan.kuotaHarian.jenisRequest || "Takjil Menu Berbuka"}
      - Waktu Tiba di Masjid: ${waktuAntarStr} WIB

      Buatkan narasinya sekarang!
    `.trim();

    // 2. Panggil API Gemini (Pilih model gemini-1.5-flash untuk hasil teks cepat)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log(`🤖 [Reporting Agent] Menghasilkan narasi untuk Pesanan ${pesananId}...`);

    const result = await model.generateContent(prompt);
    const narasi = result.response.text().trim();

    console.log("🤖 [Reporting Agent] Narasi Selesai generated!");

    // 3. Simpan Narasi di tabel Donasi (berhubung satu pesanan bisa meng-fulfill satu donasi spesifik)
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
