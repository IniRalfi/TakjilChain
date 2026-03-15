"use client";

import { useState } from "react";
import { konfirmasiTerima } from "@/lib/actions/masjid";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function KonfirmasiButton({
  pesananId,
  pengurusId,
}: {
  pesananId: string;
  pengurusId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleKonfirmasi = async () => {
    setLoading(true);
    const result = await konfirmasiTerima(pesananId, pengurusId);

    if (result.success) {
      toast("Takjil terkonfirmasi! AI sedang menulis laporan.", "success");
      router.refresh(); // Refresh halaman agar status badge berubah
    } else {
      toast("Gagal: " + result.error, "error");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleKonfirmasi}
      disabled={loading}
      className="w-full text-center py-3 bg-stone-900 text-white hover:bg-amber-500 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-sm shadow-stone-900/10 disabled:opacity-50 disabled:cursor-not-allowed group border border-stone-800 hover:border-amber-400"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Check size={14} className="group-hover:scale-125 transition-transform" />
      )}
      Terima Takjil
    </button>
  );
}
