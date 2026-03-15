import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusKuota } from "@/generated/prisma/client";
import { ArrowRight, MapPin, Users } from "lucide-react";

export const dynamic = "force-dynamic"; // Pastikan vercel tidak meng-cache data ini

export default async function HomePage() {
  // Ambil kuota yang masih OPEN.
  // (Karena kita pakai data dummy Ramadhan di masa depan, kita ambil semuanya yang OPEN dulu untuk diurutkan)
  const listKuota = await prisma.kuotaHarian.findMany({
    where: {
      status: StatusKuota.OPEN,
    },
    include: {
      masjid: true,
    },
  });

  // Algoritma Urgency: Urutkan dari persentase terkecil (paling butuh bantuan) ke terbesar
  const sortedByUrgency = listKuota.sort((a, b) => {
    const persentaseA = a.kuotaTerpenuhi / a.kuotaTotal;
    const persentaseB = b.kuotaTerpenuhi / b.kuotaTotal;
    return persentaseA - persentaseB;
  });

  // Ambil 6 teratas untuk ditampilkan di landing page
  const displayedKuota = sortedByUrgency.slice(0, 6);

  return (
    <div className="space-y-16">
      {/* 🚀 HERO SECTION */}
      <section className="text-center pt-16 pb-8 space-y-6">
        <h2 className="text-4xl md:text-6xl font-extrabold text-charcoal tracking-tight leading-tight">
          Berbagi Takjil,
          <br />
          <span className="text-emerald-main">Tepat Sasaran.</span>
        </h2>
        <p className="text-lg text-charcoal-muted max-w-2xl mx-auto">
          Elevating Ramadan Charity with AI-Driven Supply Chain. Tidak ada lagi masjid yang
          kelebihan atau kekurangan takjil di Pontianak.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <a
            href="#daftar-masjid"
            className="inline-flex items-center gap-2 bg-emerald-main text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-light transition-colors shadow-sm"
          >
            Lihat Masjid <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* 🕌 URGENCY LIST SECTION */}
      <section id="daftar-masjid" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-charcoal">Daftar Masjid Prioritas</h3>
            <p className="text-charcoal-muted text-sm mt-1">
              Diurutkan berdasarkan urgensi kekurangan takjil terbanyak.
            </p>
          </div>
          <span className="bg-amber-100/50 border border-amber-200 text-amber-main px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 w-max">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-main opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-main"></span>
            </span>
            Live Updates
          </span>
        </div>

        {displayedKuota.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-emerald-main font-medium text-lg">Alhamdulillah! 🙏</p>
            <p className="text-charcoal-muted mt-2">
              Semua kebutuhan takjil saat ini sudah terpenuhi.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedKuota.map((kuota) => {
              const persentase = Math.min(
                100,
                Math.round((kuota.kuotaTerpenuhi / kuota.kuotaTotal) * 100),
              );

              return (
                <div
                  key={kuota.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md hover:border-emerald-light/30 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header Card */}
                    <div>
                      <h4 className="font-bold text-lg text-charcoal line-clamp-1 group-hover:text-emerald-main transition-colors">
                        {kuota.masjid.nama}
                      </h4>
                      <div className="flex items-start gap-1 text-sm text-charcoal-muted mt-1.5">
                        <MapPin size={16} className="shrink-0 mt-0.5 opacity-70" />
                        <span className="line-clamp-2 leading-relaxed">{kuota.masjid.alamat}</span>
                      </div>
                    </div>

                    {/* Info Tambahan */}
                    <div className="flex items-center justify-between text-sm py-2">
                      <span className="text-charcoal-muted flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                        <Users size={14} className="opacity-70 text-emerald-main" />
                        {kuota.masjid.kapasitasJamaah} Jamaah
                      </span>
                      <span className="font-medium text-amber-main bg-amber-50 px-2 py-1 rounded-md">
                        {kuota.jenisRequest || "Bebas"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-emerald-main flex items-center gap-1">
                          {kuota.kuotaTerpenuhi} Porsi
                          <span className="text-xs font-normal text-charcoal-muted">Selesai</span>
                        </span>
                        <span className="text-charcoal-muted">Target: {kuota.kuotaTotal}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-emerald-main h-2.5 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${persentase}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="pt-6 mt-auto">
                    <Link
                      href={`/masjid/${kuota.masjid.id}?kuotaHarianId=${kuota.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-charcoal text-white px-4 py-2.5 rounded-xl font-medium hover:bg-emerald-main transition shadow-sm"
                    >
                      Bantu Penuhi <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
