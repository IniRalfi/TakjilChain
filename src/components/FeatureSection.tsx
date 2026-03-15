import { ShieldCheck, UtensilsCrossed, HeartHandshake } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bagaimana Ini Bekerja?</h2>
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
  );
}
