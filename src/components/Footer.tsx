import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 pt-16 pb-8 mt-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          <div className="space-y-4 text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="relative w-20 h-20">
                <Image
                  src={logo}
                  alt="TakjilChain Logo"
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
              <h2 className="font-extrabold text-xl tracking-tight">
                <span className="text-emerald-600">Takjil</span>
                <span className="text-amber-500">Chain</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed md:max-w-sm mx-auto md:mx-0">
              Platform penyaluran sedekah takjil berbasis AI. Memberdayakan UMKM lokal dan
              memastikan kebutuhan masjid di Pontianak terpenuhi tanpa pemborosan.
            </p>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-bold text-gray-900">Pintasan Akses</h3>
            <ul className="space-y-2 inline-block md:block text-left">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-emerald-600">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/#daftar-masjid"
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  Salurkan Donasi
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/masjid"
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  Login Masjid
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/umkm"
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  Login UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/donatur/laporan"
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  Laporan Dampak
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-bold text-gray-900">Hubungi Kami</h3>
            <p className="text-sm text-gray-500">
              Punya pertanyaan mengenai program kami atau ingin mendaftarkan Masjid/UMKM barumu?
            </p>
            <a
              href="mailto:halo@takjilchain.id"
              className="inline-block text-sm font-semibold text-emerald-600 hover:underline"
            >
              halo@takjilchain.id
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} TakjilChain. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Dibuat dengan 💚 oleh @iniralfi [rafli] di Pontianak</p>
        </div>
      </div>
    </footer>
  );
}
