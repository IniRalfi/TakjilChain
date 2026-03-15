import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusKuota } from "@/generated/prisma/client";
import {
  ArrowRight,
  MapPin,
  Users,
  UtensilsCrossed,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listSemuaKuota = await prisma.kuotaHarian.findMany({
    where: { status: StatusKuota.OPEN },
    include: { masjid: true },
  });

  // Hapus Duplikat Masjid (Jika 1 masjid punya open kuota untuk 5 hari kedepan, tampilkan 1 saja dari hari terdekat/paling darurat)
  const mapUnik = new Map();
  for (const kuota of listSemuaKuota) {
    if (!mapUnik.has(kuota.masjidProfileId)) {
      mapUnik.set(kuota.masjidProfileId, kuota);
    } else {
      // Jika sudah ada, pilih mana yang paling sedikit terpenuhi (urutannya lebih kritis)
      const existing = mapUnik.get(kuota.masjidProfileId);
      const rasioBaru = kuota.kuotaTerpenuhi / kuota.kuotaTotal;
      const rasioLama = existing.kuotaTerpenuhi / existing.kuotaTotal;
      if (rasioBaru < rasioLama) {
        mapUnik.set(kuota.masjidProfileId, kuota);
      }
    }
  }

  // Ubah Map kembali ke array
  const listKuotaUnik = Array.from(mapUnik.values());

  // Urutkan List Unik berdasarkan urgensinya (dari yang paling butuh bantuan)
  const sortedByUrgency = listKuotaUnik.sort(
    (a, b) => a.kuotaTerpenuhi / a.kuotaTotal - b.kuotaTerpenuhi / b.kuotaTotal,
  );

  // Ambil 6 teratas, ubah ke angka lebih besar misal 9 kalau datamu nanti udah ratusan
  const displayedKuota = sortedByUrgency.slice(0, 9);

  return (
    <div className="space-y-24">
      {/* 🚀 HERO SECTION */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-28 overflow-hidden rounded-3xl bg-emerald-600 px-6 sm:px-12 mt-4 text-center">
        {/* Dekorasi Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/40 border border-emerald-400/30 text-emerald-50 text-xs sm:text-sm font-medium backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
            </span>
            Ramadhan 2026 Segera Tiba
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Jangan Biarkan Masjid <br className="hidden sm:block" />
            Kekurangan <span className="text-emerald-200">Takjil.</span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-50 max-w-2xl mx-auto leading-relaxed">
            Salurkan kebaikanmu tepat sasaran. TakjilChain menggunakan AI untuk mendistribusikan
            donasimu ke masjid yang <b>benar-benar membutuhkan</b> melalui UMKM lokal.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#daftar-masjid"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 hover:scale-105 transition-all shadow-xl shadow-emerald-900/20"
            >
              Mulai Sedekah <ArrowRight size={20} />
            </a>
            <Link
              href="/dashboard/umkm"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700/50 text-white border border-emerald-400/30 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-700 transition-all"
            >
              Gabung Jadi UMKM
            </Link>
          </div>
        </div>
      </section>

      {/* 💡 FITUR (KENAPA TAKJILCHAIN) */}
      <section className="py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Bagaimana Ini Bekerja?
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Solusi tuntas cegah mubazir saat berbuka puasa.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 px-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-b-emerald-500 border-x border-t border-gray-100 text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto rotate-3">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-bold text-xl text-gray-900">Tepat Sasaran</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Sistem membatasi donasi jika kuota suatu masjid sudah penuh, dialihkan otomatis ke
              masjid lain yang lebih membutuhkan.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-b-blue-500 border-x border-t border-gray-100 text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto -rotate-3">
              <UtensilsCrossed size={32} />
            </div>
            <h3 className="font-bold text-xl text-gray-900">Bantu UMKM Lokal</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Pesanan takjil langsung di-order secara otomatis ke dapur UMKM terdekat dengan sistem
              radius GPS yang pintar.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-b-amber-500 border-x border-t border-gray-100 text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto rotate-3">
              <HeartHandshake size={32} />
            </div>
            <h3 className="font-bold text-xl text-gray-900">100% Transparan</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Pantau langsung progres distribusi sedekahmu secara real-time hingga fisik takjil
              diantar dan diterima oleh Masjid.
            </p>
          </div>
        </div>
      </section>

      {/* 🕌 DAFTAR MASJID PRIORITAS */}
      <section id="daftar-masjid" className="scroll-mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 px-2 line-clamp-1">
          <div>
            <div className="inline-flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1 mb-3 rounded-full text-sm font-bold border border-rose-100 uppercase tracking-widest">
              <TrendingUp size={16} /> Urgent Area
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Butuh Bantuan Segera!
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-medium text-sm border border-emerald-100 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Real-time Update dari AI
          </div>
        </div>

        {displayedKuota.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-emerald-100 text-center space-y-4">
            <div className="text-6xl">🙌</div>
            <h3 className="text-2xl font-bold text-emerald-600">Alhamdulillah!</h3>
            <p className="text-gray-500 text-lg">
              Semua kebutuhan takjil hari ini sudah terpenuhi. Kamu bisa kembali lagi besok!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedKuota.map((kuota) => {
              const persentase = Math.min(
                100,
                Math.round((kuota.kuotaTerpenuhi / kuota.kuotaTotal) * 100),
              );

              return (
                <Link
                  key={kuota.id}
                  href={`/masjid/${kuota.masjid.id}?kuotaHarianId=${kuota.id}`}
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-emerald-500 transition-all duration-300 flex flex-col relative overflow-hidden"
                >
                  {/* Efek Garis Kiri ala Material */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-100 group-hover:bg-emerald-500 transition-colors duration-300"></div>

                  <div className="p-7 pl-8 space-y-6">
                    {/* Header Card */}
                    <div>
                      <h4 className="font-extrabold text-2xl text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
                        {kuota.masjid.nama}
                      </h4>
                      <div className="flex items-start gap-1.5 text-sm text-gray-500 mt-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <MapPin size={16} className="shrink-0 mt-0.5 text-red-500" />
                        <span className="line-clamp-2 leading-relaxed font-medium">
                          {kuota.masjid.alamat}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 text-xs text-gray-500 uppercase font-bold tracking-wider">
                        <span>Porsi Disarankan</span>
                        <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-base bg-emerald-50 px-2 py-1.5 rounded-lg">
                          {kuota.jenisRequest || "Takjil Bebas"}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-gray-500 uppercase font-bold tracking-wider">
                        <span>Estimasi Jamaah</span>
                        <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-base bg-blue-50 px-2 py-1.5 rounded-lg">
                          <Users size={16} className="opacity-60" /> {kuota.masjid.kapasitasJamaah}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Gede (Chunky) */}
                    <div className="pt-2">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          Target Porsi
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-emerald-600 tracking-tighter">
                            {kuota.kuotaTerpenuhi}{" "}
                            <span className="text-base text-gray-400 font-medium">
                              / {kuota.kuotaTotal}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Bar Background Tebel */}
                      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
                        {/* Fill Progress animatif */}
                        <div
                          className="h-full bg-emerald-500 rounded-r-full flex justify-end items-center px-2 group-hover:bg-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-500 relative"
                          style={{ width: `${persentase}%`, minWidth: "5%" }}
                        >
                          {/* Garis Kilap Animatif didalam progress */}
                          <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-150%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                      </div>
                      <p className="text-xs text-right mt-1.5 text-gray-400 font-medium">
                        Sedikit lagi terpenuhi ({persentase}%)
                      </p>
                    </div>
                  </div>

                  {/* Tombol Interaktif Unik */}
                  <div className="bg-emerald-50 px-8 py-5 flex items-center justify-between mt-auto border-t-2 border-dashed border-emerald-100 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-colors">
                    <span className="font-extrabold text-emerald-700 tracking-wide group-hover:text-white transition-colors">
                      SEDEKAH SEKARANG
                    </span>
                    <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                      <ArrowRight size={20} strokeWidth={3} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Tambahan animasi CSS keyframe lokal */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `,
        }}
      />
    </div>
  );
}
