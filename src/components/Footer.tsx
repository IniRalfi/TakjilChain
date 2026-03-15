import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <h2 className="font-extrabold text-xl tracking-tight text-emerald-600">
                TakjilChain
              </h2>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Platform penyaluran sedekah takjil berbasis AI. Memberdayakan UMKM lokal dan
              memastikan kebutuhan masjid di Pontianak terpenuhi tanpa pemborosan.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Pintasan Akses</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-emerald-600">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="#daftar-masjid"
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
            </ul>
          </div>

          <div className="space-y-4">
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
          <p className="mt-2 md:mt-0">Dibuat dengan 💚 di Pontianak</p>
        </div>
      </div>
    </footer>
  );
}
