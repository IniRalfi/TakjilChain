import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StatusDonasi } from "@/generated/prisma/client";

// ─── POST /api/checkout ───────────────────────────────────────
// Menerima request donasi, membuat record Donasi PENDING,
// dan mengembalikan Payment Link dari Mayar API.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kuotaHarianId, jumlahPorsi, donaturId } = body;

    // --- Validasi input ---
    if (!kuotaHarianId || !jumlahPorsi || !donaturId) {
      return NextResponse.json(
        { error: "kuotaHarianId, jumlahPorsi, dan donaturId wajib diisi." },
        { status: 400 },
      );
    }

    // --- Ambil data kuota & validasi masih OPEN ---
    const kuota = await prisma.kuotaHarian.findUnique({
      where: { id: kuotaHarianId },
      include: { masjid: true },
    });

    if (!kuota) {
      return NextResponse.json({ error: "Kuota tidak ditemukan." }, { status: 404 });
    }
    if (kuota.status !== "OPEN") {
      return NextResponse.json({ error: "Kuota sudah penuh atau ditutup." }, { status: 409 });
    }

    const sisaKuota = kuota.kuotaTotal - kuota.kuotaTerpenuhi;
    if (jumlahPorsi > sisaKuota) {
      return NextResponse.json({ error: `Hanya tersisa ${sisaKuota} porsi.` }, { status: 409 });
    }

    const totalHarga = jumlahPorsi * kuota.hargaPerPorsi;

    // --- Buat record Donasi PENDING ---
    const donasi = await prisma.donasi.create({
      data: {
        donaturId,
        kuotaHarianId,
        jumlahPorsi,
        totalHarga,
        status: StatusDonasi.PENDING,
      },
    });

    // --- Generate Payment Link via Mayar API ---
    const mayarResponse = await fetch("https://mayar.id/api/v1/payment-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
      },
      body: JSON.stringify({
        name: `Donasi Takjil - ${kuota.masjid.nama}`,
        amount: totalHarga,
        currency: "IDR",
        description:
          `Donasi ${jumlahPorsi} porsi takjil untuk ${kuota.masjid.nama} ` +
          `pada ${new Date(kuota.tanggal).toLocaleDateString("id-ID")}`,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/donasi/${donasi.id}`,
        metadata: {
          donasiId: donasi.id,
          kuotaHarianId,
          donaturId,
        },
      }),
    });

    if (!mayarResponse.ok) {
      // Rollback: hapus donasi jika Mayar gagal
      await prisma.donasi.delete({ where: { id: donasi.id } });
      const errData = await mayarResponse.json();
      console.error("[MAYAR] Gagal buat payment link:", errData);
      return NextResponse.json({ error: "Gagal membuat link pembayaran." }, { status: 502 });
    }

    const mayarData = await mayarResponse.json();
    const paymentUrl: string = mayarData.data?.paymentUrl ?? mayarData.paymentUrl;

    // --- Simpan Payment ID & URL dari Mayar ---
    await prisma.donasi.update({
      where: { id: donasi.id },
      data: {
        mayarPaymentId: mayarData.data?.id ?? mayarData.id,
        mayarPaymentUrl: paymentUrl,
      },
    });

    return NextResponse.json({ paymentUrl, donasiId: donasi.id });
  } catch (error) {
    console.error("[CHECKOUT] Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
