"use client"; // Error page HARUS client component di Next.js

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke sistem monitoring (opsional)
    console.error("Terjadi error aplikasi:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-10 w-10 text-red-600 dark:text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Oops! Ada yang salah 😢
      </h2>

      {/* Menampilkan pesan error asli jika ada, kalau tidak pakai default message */}
      <p className="mb-8 max-w-lg text-gray-600 dark:text-gray-400 text-lg">
        {error.message ||
          "Telah terjadi kesalahan sistem yang tidak terduga pada server kami. Tim kami sedang berusaha memperbaikinya."}
      </p>

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
        <button
          onClick={() => reset()} // Coba render ulang component yang error
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-95"
        >
          Coba Muat Ulang
        </button>
        <Link
          href="/"
          className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 active:scale-95"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
