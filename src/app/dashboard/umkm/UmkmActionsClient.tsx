"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { terimaPesanan, tandaiSelesaiDiantar } from "@/lib/actions/umkm";
import { Loader2 } from "lucide-react";

import { useToast } from "@/components/ToastProvider";

export default function UmkmActionsClient({
  pesananId,
  umkmId,
  mode,
}: {
  pesananId: string;
  umkmId: string;
  mode: "TERIMA" | "SELESAI_ANTAR";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleTerima = async () => {
    setLoading(true);
    const res = await terimaPesanan(pesananId, umkmId);
    if (res.success) {
      toast("Order diterima! Selamat memasak.", "success");
      router.refresh();
    } else {
      toast("Gagal: " + res.error, "error");
      setLoading(false);
    }
  };

  const handleSelesaiAntar = async () => {
    setLoading(true);
    const res = await tandaiSelesaiDiantar(pesananId, umkmId);
    if (res.success) {
      toast("Status diperbarui. Menunggu konfirmasi Masjid.", "success");
      router.refresh();
    } else {
      toast("Gagal: " + res.error, "error");
      setLoading(false);
    }
  };

  if (mode === "TERIMA") {
    return (
      <button
        onClick={handleTerima}
        disabled={loading}
        className="w-full bg-charcoal text-white rounded-xl py-3 font-bold hover:bg-emerald-main transition disabled:opacity-70 flex justify-center"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Terima Order Ini"}
      </button>
    );
  }

  if (mode === "SELESAI_ANTAR") {
    return (
      <button
        onClick={handleSelesaiAntar}
        disabled={loading}
        className="w-full bg-emerald-main text-white rounded-xl py-3 font-bold hover:bg-emerald-light transition border-2 border-transparent disabled:opacity-70 flex justify-center"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Tandai Selesai Diantar"}
      </button>
    );
  }

  return null;
}
