"use client";

import { useState } from "react";
import { konfirmasiTerima } from "@/lib/actions/masjid";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KonfirmasiButton({
  pesananId,
  pengurusId,
}: {
  pesananId: string;
  pengurusId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleKonfirmasi = async () => {
    setLoading(true);
    const result = await konfirmasiTerima(pesananId, pengurusId);

    if (result.success) {
      alert(
        "✅ Takjil berhasil dikonfirmasi tiba. UMKM dibayar, dan AI sedang menulis laporan untuk donatur.",
      );
      router.refresh(); // Refresh halaman agar status badge berubah
    } else {
      alert("❌ Gagal: " + result.error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleKonfirmasi}
      disabled={loading}
      className="bg-emerald-main text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-light transition flex items-center gap-2 shadow-sm disabled:opacity-70"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
      Konfirmasi Terima
    </button>
  );
}
