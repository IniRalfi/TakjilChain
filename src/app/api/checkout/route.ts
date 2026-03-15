import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StatusDonasi } from "@/generated/prisma/client";
import { prosesDonasiPaid } from "@/lib/orders";

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

    const kuota = await prisma.kuotaHarian.findUnique({
      where: { id: kuotaHarianId },
      include: { masjid: true },
    });

    if (!kuota || kuota.status !== "OPEN") {
      return NextResponse.json({ error: "Kuota tidak valid atau sudah penuh." }, { status: 400 });
    }

    const sisaKuota = kuota.kuotaTotal - kuota.kuotaTerpenuhi;
    if (jumlahPorsi > sisaKuota) {
      return NextResponse.json({ error: `Hanya tersisa ${sisaKuota} porsi.` }, { status: 409 });
    }

    const totalHarga = jumlahPorsi * kuota.hargaPerPorsi;

    // --- 1. Buat record Donasi ---
    // Karena MODE BYPASS (Demo), kita langsung anggap PAID agar flow langsung berlanjut
    const donasi = await prisma.donasi.create({
      data: {
        donaturId,
        kuotaHarianId,
        jumlahPorsi,
        totalHarga,
        status: StatusDonasi.PAID, // Langsung PAID
        mayarPaymentId: "mock-" + Date.now(),
        mayarPaymentUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/donasi/mock`,
      },
    });

    // --- 2. BYPASS: Langsung trigger alur pencarian UMKM (asumsikan Webhook Mayar sukses)
    try {
      await prosesDonasiPaid(donasi.id);
      console.log(`[MOCK BYPASS] Pesanan dari donasi ${donasi.id} berhasil di-route ke UMKM`);
    } catch (routeError) {
      console.error("[MOCK BYPASS] Gagal routing pesanan:", routeError);
    }

    // --- 3. URL Redirect Dummy ---
    // Arahkan otomatis si user ke halaman konfirmasi donasi
    const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/donasi/${donasi.id}`;

    return NextResponse.json({ paymentUrl, donasiId: donasi.id });
  } catch (error) {
    console.error("[CHECKOUT] Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
