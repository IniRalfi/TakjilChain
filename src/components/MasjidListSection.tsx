import Link from "next/link";
import { ArrowRight, MapPin, Users, Utensils, Zap } from "lucide-react";

export default function MasjidListSection({ displayedKuota }: { displayedKuota: any[] }) {
  return (
    <section id="daftar-masjid" className="scroll-mt-32">
      {/* HEADER SECTION - LEBIH CLEAN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 px-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-orange-600 bg-orange-50 px-3 py-1.5 mb-4 rounded-full text-xs font-bold border border-orange-100 uppercase tracking-widest">
            <Zap size={14} className="fill-orange-600" />
            Spot Prioritas
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
            Butuh Bantuan Segera.
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-full font-semibold text-sm border border-gray-200 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Live Sync
        </div>
      </div>

      {displayedKuota.length === 0 ? (
        <div className="bg-white p-14 rounded-3xl border border-gray-100 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            Alhamdulillah, Semua Terpenuhi!
          </h3>
          <p className="text-gray-500 text-lg">
            Masya Allah, seluruh kuota takjil hari ini sudah lengkap. Yuk kembali lagi besok!
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
                className="group flex flex-col bg-white rounded-3xl border border-gray-200/60 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 overflow-hidden"
              >
                {/* BAGIAN ATAS CARD (Putih Bersih) */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Status Kebutuhan */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Masih Dibutuhkan
                    </div>
                  </div>

                  {/* Info Masjid */}
                  <h4 className="text-2xl font-black text-gray-900 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                    {kuota.masjid.nama}
                  </h4>
                  <div className="flex items-start gap-2 text-gray-500 text-sm mb-8">
                    <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{kuota.masjid.alamat}</span>
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
                        <Utensils size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Menu
                        </p>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {kuota.jenisRequest || "Bebas"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Jamaah
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {kuota.masjid.kapasitasJamaah}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-auto border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">
                          {kuota.kuotaTerpenuhi}
                        </span>
                        <span className="text-sm font-semibold text-gray-400">
                          {" "}
                          / {kuota.kuotaTotal} porsi
                        </span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{persentase}%</span>
                    </div>

                    {/* Bar Tipis Clean */}
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-[1200ms] ease-out relative"
                        style={{ width: `${persentase}%`, minWidth: "4%" }}
                      >
                        {/* Efek Garis Kilap minimalis di ujung bar */}
                        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/40 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="p-4 pt-0">
                  <div className="w-full py-4 rounded-2xl bg-gray-50 text-emerald-700 font-bold text-sm text-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                    Bantu Masjid Ini <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
