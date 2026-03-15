"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCcw, Power } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [countdown, setCountdown] = useState(5);
  const isPrismaError =
    error.message.includes("Prisma") ||
    error.message.includes("invocation") ||
    error.message.includes("ETIMEDOUT");

  useEffect(() => {
    console.error("TakjilChain Error Log:", error);

    // Auto-retry once if it's a transient connection error
    if (isPrismaError) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // reset(); // We could auto-reset, but let's keep it manual for now to avoid loops
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [error, isPrismaError]);

  const handleHardReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="mb-8 p-8 bg-rose-50 rounded-[2.5rem] text-rose-500 border border-rose-100 shadow-inner relative overflow-hidden group">
        <div className="absolute inset-0 bg-rose-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <AlertTriangle size={56} strokeWidth={2.5} className="relative z-10" />
      </div>

      <h2 className="text-4xl font-black text-stone-900 italic tracking-tighter">
        Sistem Sedang Rehat! ☕
      </h2>

      <p className="mt-6 max-w-lg text-lg text-stone-500 font-medium leading-relaxed italic">
        {isPrismaError
          ? "Koneksi ke pangkalan data (Database) sedang padat atau baru saja terbangun dari tidur. Ini normal di lingkungan pengembangan."
          : "Ada kendala teknis yang menghalangi rantai kebaikan ini. Jangan khawatir, data Anda aman."}
      </p>

      <div className="mt-4 p-4 bg-stone-950 rounded-2xl border border-stone-800 inline-block">
        <code className="text-[10px] text-amber-500 font-black uppercase tracking-widest leading-none">
          ERR_STAMP: {new Date().getTime().toString(36).toUpperCase()}
        </code>
        <p className="text-[10px] text-stone-500 font-bold mt-1 overflow-hidden text-ellipsis max-w-xs px-2 italic">
          {error.message.slice(0, 100)}...
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-500 px-10 py-5 text-sm font-black text-white shadow-xl shadow-amber-200 transition-all hover:bg-amber-600 hover:-translate-y-1 active:translate-y-0"
        >
          <RefreshCcw
            size={18}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          MUAT ULANG HALAMAN {countdown > 0 && isPrismaError && `(${countdown})`}
        </button>

        <button
          onClick={handleHardReload}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-stone-200 bg-white px-10 py-5 text-sm font-black text-stone-700 transition-all hover:bg-stone-50 hover:border-stone-300"
        >
          <Power size={18} className="text-rose-500" />
          PAKSA REFRESH
        </button>
      </div>

      <p className="mt-8 text-xs text-stone-400 font-bold uppercase tracking-[0.2em] italic">
        TakjilChain Safe Sync Mode
      </p>
    </div>
  );
}
