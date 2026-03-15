import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[150px] font-black leading-none text-gray-200 dark:text-gray-800/50">
        404
      </h1>
      <div className="absolute rotate-12 rounded bg-emerald-600 px-2 py-1 text-sm font-bold tracking-widest text-white">
        PAGE NOT FOUND
      </div>

      <p className="mt-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
        Halaman Tidak Ditemukan 🕵️‍♂️
      </p>

      <p className="mt-4 max-w-lg text-lg text-gray-500 dark:text-gray-400">
        Maaf, halaman yang kamu tuju mungkin telah dihapus, namanya berubah, atau untuk sementara
        tidak tersedia.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-500/30 active:translate-y-0"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
