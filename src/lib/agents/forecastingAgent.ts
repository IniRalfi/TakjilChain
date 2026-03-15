import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

// Inisialisasi Google Gemini dengan API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function askForecastingAgent(masjidProfileId: string, hariRamadhanKe: number) {
  try {
    const masjid = await prisma.masjidProfile.findUnique({
      where: { id: masjidProfileId },
      include: { kuotaHarian: true },
    });

    if (!masjid) return "Pilih masjid yang valid untuk melihat saran.";

    // Kita butuh hari dalam minggu contoh ('Senin', 'Selasa', 'Jumat')
    // Data dummy: mulai ramadhan kita setting ke-1 jatuh pada hari Senin
    const d = new Date(2026, 2, 2); // 2 Maret 2026 = 1 Ramadhan
    d.setDate(d.getDate() + hariRamadhanKe - 1);
    const namaHari = d.toLocaleDateString("id-ID", { weekday: "long" });

    // 1. Buat prompt untuk dikirim ke Gemini
    const prompt = `
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

      Contoh Respon 1: "Malam Jumat selalu ramai, jamaah biasanya bertambah 30%. Kami sarankan kuota 150 porsi untuk antisipasi pendatang."
      Contoh Respon 2: "Ini malam ganjil Lailatul Qadar. Pasang kuota 350 porsi (70% kapasitas maksimal) karena banyak i'tikaf."

      Analisa sekarang:
    `.trim();

    // 2. Panggil API Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const prediksiAI = result.response.text().trim();

    console.log(
      `🤖 [Forecasting] Saran untuk Masjid ${masjid.nama} di hari ke-${hariRamadhanKe}:\n${prediksiAI}`,
    );

    return prediksiAI;
  } catch (error) {
    console.error("🤖 [Forecasting Agent] GAGAL generate saran:", error);
    return "Tidak dapat mengambil saran dari AI saat ini. Hubungi administrator.";
  }
}
