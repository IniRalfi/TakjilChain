import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      {/* Sketsa/Gambar 404 */}
      <div className="mb-8 relative group">
        <div className="text-[12rem] font-black leading-none text-gray-100 select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-emerald-900/10 border border-gray-100 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <Map size={64} className="text-emerald-500" />
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-black text-gray-900 sm:text-4xl tracking-tight">
        Wah, Tersesat ya? 🕵️‍♂️
      </h1>

      <p className="mt-4 max-w-md text-lg text-gray-600 font-medium leading-relaxed">
        Halaman yang kamu cari nggak ada di peta kami. Mungkin lagi diservis atau jalannya ditutup.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:-translate-y-1 active:translate-y-0"
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
