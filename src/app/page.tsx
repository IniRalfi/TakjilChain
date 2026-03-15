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
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listKuota = await prisma.kuotaHarian.findMany({
    where: { status: StatusKuota.OPEN },
    include: { masjid: true },
  });

  const sortedByUrgency = listKuota.sort(
    (a, b) => a.kuotaTerpenuhi / a.kuotaTotal - b.kuotaTerpenuhi / b.kuotaTotal,
  );
  const displayedKuota = sortedByUrgency.slice(0, 6);

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

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto rotate-3">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-bold text-xl text-gray-900">Tepat Sasaran</h3>
            <p className="text-gray-500 leading-relaxed">
              Sistem membatasi donasi jika kuota suatu masjid sudah penuh, dialihkan ke masjid lain.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto -rotate-3">
              <UtensilsCrossed size={28} />
            </div>
            <h3 className="font-bold text-xl text-gray-900">Bantu UMKM Lokal</h3>
            <p className="text-gray-500 leading-relaxed">
              Pesanan takjil langsung di-order secara otomatis ke dapur UMKM terdekat dari lokasi
              masjid.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto rotate-3">
              <HeartHandshake size={28} />
            </div>
            <h3 className="font-bold text-xl text-gray-900">Transparan</h3>
            <p className="text-gray-500 leading-relaxed">
              Pantau langsung progres distribusi sedekahmu hingga takjil fisik diantar ke lokasi.
            </p>
          </div>
        </div>
      </section>

      {/* 🕌 DAFTAR MASJID PRIORITAS */}
      <section id="daftar-masjid" className="scroll-mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Prioritas Hari Ini 🚨
            </h2>
            <p className="text-gray-500 text-lg mt-2 max-w-xl">
              Daftar masjid yang kekurangan takjil terbanyak. Bantuanmu sangat berarti bagi jamaah
              mereka.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-medium text-sm border border-emerald-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Real-time Update
          </div>
        </div>

        {displayedKuota.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-emerald-100 text-center space-y-4">
            <div className="text-6xl">🙌</div>
            <h3 className="text-2xl font-bold text-emerald-600">Alhamdulillah!</h3>
            <p className="text-gray-500 text-lg">
              Semua kebutuhan takjil hari ini sudah terpenuhi. Terima kasih dermawan!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedKuota.map((kuota) => {
              const persentase = Math.min(
                100,
                Math.round((kuota.kuotaTerpenuhi / kuota.kuotaTotal) * 100),
              );

              return (
                <Link
                  key={kuota.id}
                  href={`/masjid/${kuota.masjid.id}?kuotaHarianId=${kuota.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="p-6 space-y-5">
                    {/* Header Card */}
                    <div>
                      <h4 className="font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {kuota.masjid.nama}
                      </h4>
                      <div className="flex items-start gap-1.5 text-sm text-gray-500 mt-2">
                        <MapPin size={16} className="shrink-0 mt-0.5 text-emerald-500" />
                        <span className="line-clamp-2 leading-snug">{kuota.masjid.alamat}</span>
                      </div>
                    </div>

                    {/* Stats Ringkas */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium">
                        <Users size={16} />
                        {kuota.masjid.kapasitasJamaah}
                      </div>
                      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {kuota.jenisRequest || "Takjil Bebas"}
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Terkumpul
                          </p>
                          <p className="text-xl font-bold text-emerald-600 leading-none">
                            {kuota.kuotaTerpenuhi}{" "}
                            <span className="text-sm font-medium text-gray-400">
                              / {kuota.kuotaTotal} porsi
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">{persentase}%</span>
                        </div>
                      </div>

                      {/* Bar Line */}
                      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full group-hover:bg-emerald-400 transition-all duration-500 ease-out"
                          style={{ width: `${persentase}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Faux Button (Biar bisa diklik satu card full) */}
                  <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-100 flex items-center justify-between text-emerald-600 font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-colors mt-auto">
                    <span>Donasi Sekarang</span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
