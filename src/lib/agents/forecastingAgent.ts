import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { prisma } from "@/lib/prisma";

// Inisalisasi SDK Google Gemini Baru
const ai = new GoogleGenAI({
  apiKey: process.env["GEMINI_API_KEY"],
});

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

    // 1. Buat prompt untuk dikirim ke Gemini
    const userPrompt = `
      Anda adalah "Agent Data Analyst Masjid" di TakjilChain.
      Tugas Anda adalah merekomendasikan jumlah kuota takjil kepada Pengurus Masjid berdasarkan tipe hari dan historis jumlah jamaah.
      Jawab dalam 1 paragraf pendek (maksimal 2 kalimat) langsung ke inti rekomendasi. Jangan gunakan kata pengantar.

      Konteks Data:
      - Nama Masjid: ${masjid.nama}
      - Kapasitas Maksimal Masjid: ${masjid.kapasitasJamaah || 500} orang
      - Hari yang ditanyakan: Ramadhan Ke-${hariRamadhanKe} (${namaHari})

      Panduan Analisa Anda:
      a) Jika jatuh pada hari Jumat, hari Sabtu, atau Ahad: sarankan untuk menaikkan kuota porsi karena biasanya jamaah meningkat. Rekomendasi 30% - 40% dari kapasitas maksimal.
      b) Jika malam ke-21 hingga ke-27 Ramadhan (Lailatul Qadar): sarankan naikkan kuota signifikan hingga 60%-70% maksimal kapasitas, jenis makanan lebih bervariasi.
      c) Jika hari biasa (Senin - Kamis awal): sarankan standar (10-20% kapasitas) karena biasanya warga lebih memilih berbuka di rumah.

      Analisa sekarang:
    `.trim();

    // 2. Panggil API Gemini dengan SDK @google/genai terbaru
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });

    const prediksiAI = response.text || "Tidak ada saran dari AI saat ini.";

    console.log(`🤖 [Forecasting] Saran untuk Masjid ${masjid.nama}:\n${prediksiAI}`);

    return prediksiAI;
  } catch (error) {
    console.error("🤖 [Forecasting Agent] GAGAL generate saran:", error);
    return "Sedang mengkalkulasikan saran analisis cerdas...";
  }
}
