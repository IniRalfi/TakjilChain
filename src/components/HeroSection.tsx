import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
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
  );
}
