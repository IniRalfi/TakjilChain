import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Users, Info } from "lucide-react";
import CheckoutClient from "./CheckoutClient";

// Props params di Next.js 15+ berupa Promise
export default async function DetailMasjidPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kuotaHarianId?: string }>;
}) {
  const { id } = await params;
  const { kuotaHarianId } = await searchParams;

  // 1. Ambil data masjid dan kuota
  const masjid = await prisma.masjidProfile.findUnique({
    where: { id },
    include: {
      user: true,
      kuotaHarian: {
        where: kuotaHarianId ? { id: kuotaHarianId } : { status: "OPEN" },
        take: 1,
      },
    },
  });

  if (!masjid) return notFound();

  // 2. Ambil user Donatur dari database (untuk simulasi Auth / MVP)
  const donaturDummy = await prisma.user.findFirst({
    where: { role: "DONATUR" },
  });

  const kuota = masjid.kuotaHarian[0];
  if (!kuota) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-charcoal">Alhamdulillah 🙏</h2>
        <p className="text-charcoal-muted mt-2">
          Masjid ini sedang tidak membutuhkan takjil tambahan untuk hari yang dipilih.
        </p>
      </div>
    );
  }

  const sisaPorsi = kuota.kuotaTotal - kuota.kuotaTerpenuhi;

  return (
    <div className="max-w-xl mx-auto space-y-8 mt-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 px-8 py-8">
        <h1 className="text-3xl font-extrabold text-charcoal mb-2">{masjid.nama}</h1>
        <div className="flex items-start gap-2 text-charcoal-muted mb-6">
          <MapPin size={18} className="shrink-0 mt-0.5 text-emerald-main" />
          <p className="leading-relaxed">{masjid.alamat}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-emerald-main" />
            <span className="font-medium text-charcoal">{masjid.kapasitasJamaah} Jamaah</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={16} className="text-emerald-main" />
            <span className="font-medium text-charcoal">Kontak: {masjid.user.phone || "-"}</span>
          </div>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-emerald-100 relative overflow-hidden">
        {/* Dekorasi visual */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-70"></div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-charcoal">Bantu Penuhi Takjil</h2>
          <p className="text-charcoal-muted mt-2">
            Dibutuhkan <b>{sisaPorsi} porsi</b> lagi untuk menu{" "}
            <span className="text-amber-main font-semibold bg-amber-50 px-2 py-0.5 rounded">
              {kuota.jenisRequest || "Takjil Bebas"}
            </span>
          </p>
        </div>

        {/* Client Component untuk Form Pembayaran */}
        <CheckoutClient
          kuotaHarianId={kuota.id}
          sisaPorsi={sisaPorsi}
          hargaPerPorsi={kuota.hargaPerPorsi}
          donaturId={donaturDummy?.id || ""}
        />
      </div>
    </div>
  );
}
