import { prisma } from "@/lib/prisma";
import { runAIWithFailover } from "@/lib/ai-handler";

export async function askForecastingAgent(masjidProfileId: string, hariRamadhanKe: number) {
  try {
    const masjid = await prisma.masjidProfile.findUnique({
      where: { id: masjidProfileId },
      include: { kuotaHarian: true },
    });

    if (!masjid) return "Pilih masjid yang valid untuk melihat saran.";

    // Data hari
    const d = new Date();
    d.setDate(d.getDate() + hariRamadhanKe - 1);
    const namaHari = d.toLocaleDateString("id-ID", { weekday: "long" });

    const userPrompt = `
      Anda adalah "Agent Data Analyst Masjid" di TakjilChain.
      Tugas Anda adalah merekomendasikan jumlah kuota takjil kepada Pengurus Masjid berdasarkan tipe hari dan historis jumlah jamaah.
      Jawab dalam 1 paragraf pendek (maksimal 2 kalimat) langsung ke inti rekomendasi. Jangan gunakan kata pengantar.

      Konteks Data:
      - Nama Masjid: ${masjid.nama}
      - Kapasitas Maksimal Masjid: ${masjid.kapasitasJamaah || 500} orang
      - Hari yang ditanyakan: Ramadhan Ke-${hariRamadhanKe} (${namaHari})

      Panduan Analisa Anda:
      a) Jika jatuh pada hari Jumat, hari Sabtu, atau Ahad: sarankan naikkan kuota (30% - 40% dari kapasitas).
      b) Jika malam ke-21 hingga ke-27 Ramadhan (Lailatul Qadar): naikkan signifikan (60%-70% kapasitas).
      c) Jika hari biasa: sarankan standar (10-20% kapasitas).

      Analisa sekarang:
    `.trim();

    const fallback =
      "Berdasarkan kapasitas masjid, kami menyarankan kuota standar 10-20% untuk hari ini.";

    // Pakai AI Core Handler biar anti-mati
    const prediksiAI = await runAIWithFailover(userPrompt, fallback);

    console.log(`🤖 [Forecasting] Saran Cerdas Dihasilkan untuk ${masjid.nama}`);

    return prediksiAI;
  } catch (error) {
    console.error("🤖 [Forecasting Agent] ERROR:", error);
    return "Sedang mengkalkulasikan saran analisis cerdas...";
  }
}
