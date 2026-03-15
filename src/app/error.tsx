"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("TakjilChain Error Log:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 p-6 bg-rose-50 rounded-full text-rose-500 border border-rose-100">
        <AlertTriangle size={48} strokeWidth={2.5} />
      </div>

      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Rantai Terputus! 🆘</h2>

      <p className="mt-4 max-w-lg text-lg text-gray-600 font-medium leading-relaxed">
        Ada masalah teknis yang bikin sistem kami macet sebentar.
        <span className="block text-sm text-rose-500 font-mono mt-2 opacity-70">
          [{error.message || "Internal System Sync Error"}]
        </span>
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-black hover:-translate-y-1 active:translate-y-0"
        >
          <RefreshCcw size={18} /> Coba Muat Ulang
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
        >
          Lapor Masalah
        </Link>
      </div>
    </div>
  );
}
