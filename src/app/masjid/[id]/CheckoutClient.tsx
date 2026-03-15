"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CheckoutClient({
  kuotaHarianId,
  sisaPorsi,
  hargaPerPorsi,
  donaturId,
}: {
  kuotaHarianId: string;
  sisaPorsi: number;
  hargaPerPorsi: number;
  donaturId: string;
}) {
  const [jumlah, setJumlah] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalHarga = jumlah * hargaPerPorsi;

  const handleCheckout = async () => {
    if (jumlah <= 0 || jumlah > sisaPorsi) {
      setError(`Jumlah pesanan error. Minimal 1 porsi, maksimal ${sisaPorsi} porsi.`);
      return;
    }

    if (!donaturId) {
      setError("Data donatur tidak ditemukan. Pastikan sudah login.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kuotaHarianId,
          jumlahPorsi: jumlah,
          donaturId: donaturId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat link pembayaran.");
      }

      // Redirect langsung ke halaman Payment Mayar
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-charcoal">
          Berapa porsi yang ingin didonasikan?
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            max={sisaPorsi}
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-main transition font-medium text-charcoal"
          />
          <span className="text-charcoal-muted font-medium whitespace-nowrap bg-gray-100 px-4 py-3 rounded-xl">
            x Rp {hargaPerPorsi.toLocaleString("id-ID")}
          </span>
        </div>
        {error && <p className="text-rose-500 text-sm font-medium mt-1">{error}</p>}
      </div>

      <div className="bg-emerald-50 px-5 py-4 rounded-xl flex items-center justify-between border border-emerald-100/50">
        <span className="text-emerald-main font-medium">Total Donasi</span>
        <span className="text-xl font-bold text-emerald-main">
          Rp {totalHarga.toLocaleString("id-ID")}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || sisaPorsi <= 0}
        className="w-full bg-charcoal text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-main transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Memproses...
          </>
        ) : (
          <>
            Lanjutkan Pembayaran <ArrowRight size={20} />
          </>
        )}
      </button>

      <p className="text-xs text-center text-charcoal-muted mt-4">
        Pembayaran diproses secara aman oleh <b>Mayar.id</b>
      </p>
    </div>
  );
}
