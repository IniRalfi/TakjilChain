"use server";

import { prisma } from "@/lib/prisma";
import { StatusPesanan } from "@/generated/prisma/client";

export async function terimaPesanan(pesananId: string, umkmId: string) {
  const pesanan = await prisma.pesanan.findUnique({ where: { id: pesananId } });

  if (!pesanan || pesanan.umkmProfileId !== umkmId) {
    return { success: false, error: "Pesanan tidak valid." };
  }

  // Hanya bisa menerima jika masih WAITING
  if (pesanan.status !== StatusPesanan.WAITING) {
    return { success: false, error: "Pesanan ini sudah diproses atau kadaluwarsa." };
  }

  try {
    await prisma.pesanan.update({
      where: { id: pesananId },
      data: {
        status: StatusPesanan.ACCEPTED,
        acceptedAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memproses." };
  }
}

export async function tolakPesanan(pesananId: string, umkmId: string) {
  // Biar lebih simpel, kalau UMKM nolak, kita set statusnya kembali WAITING untuk ditarik agen AI.
  // Tapi idealnya, umkm bisa skip, lalu Logistics Agent otomatis mencari tujuan baru.
  return {
    success: false,
    error: "Fitur tolak manual belum diaktifkan, biarkan Logistics Agent memindahkannya (30mnt).",
  };
}

export async function tandaiSelesaiDiantar(pesananId: string, umkmId: string) {
  const pesanan = await prisma.pesanan.findUnique({ where: { id: pesananId } });

  if (!pesanan || pesanan.umkmProfileId !== umkmId) {
    return { success: false, error: "Pesanan tidak valid." };
  }

  // Hanya bisa ditandai selesai jika sebelumnya ACCEPTED
  if (pesanan.status !== StatusPesanan.ACCEPTED) {
    return { success: false, error: "Pesanan harus berstatus ACCEPTED terlebih dahulu." };
  }

  try {
    await prisma.pesanan.update({
      where: { id: pesananId },
      data: {
        status: StatusPesanan.DELIVERED,
        deliveredAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memproses." };
  }
}
