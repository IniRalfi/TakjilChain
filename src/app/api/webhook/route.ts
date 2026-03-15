import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { StatusDonasi } from "@/generated/prisma/client";
import { prosesDonasiPaid } from "@/lib/orders";

// ─── POST /api/webhook/mayar ──────────────────────────────────
// Menerima notifikasi real-time dari Mayar saat ada perubahan
// status pembayaran. Endpoint ini WAJIB aman dari spoofing.

function verifikasiSignature(payload: string, signature: string): boolean {
  const secret = process.env.MAYAR_WEBHOOK_SECRET!;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  // timingSafeEqual mencegah timing attack
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-mayar-signature") ?? "";

  // 1. Verifikasi signature HMAC dari Mayar
  if (!verifikasiSignature(rawBody, signature)) {
    console.warn("[WEBHOOK] Signature tidak valid!");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log(`[WEBHOOK] Event diterima: ${event.event}`);

  // 2. Tangani event berdasarkan tipe
  try {
    switch (event.event) {
      case "PAYMENT_PAID": {
        const mayarPaymentId = event.data.id as string;
        const paidAt = event.data.paidAt as string;

        // Cari donasi berdasarkan Mayar Payment ID
        const donasi = await prisma.donasi.findUnique({
          where: { mayarPaymentId },
        });

        if (!donasi) {
          console.warn(`[WEBHOOK] Donasi dengan mayarPaymentId ${mayarPaymentId} tidak ditemukan.`);
          break;
        }

        if (donasi.status === StatusDonasi.PAID) {
          console.log(`[WEBHOOK] Donasi ${donasi.id} sudah berstatus PAID, skip.`);
          break;
        }

        // Update status donasi → PAID
        await prisma.donasi.update({
          where: { id: donasi.id },
          data: {
            status: StatusDonasi.PAID,
            mayarPaidAt: new Date(paidAt),
          },
        });

        console.log(`[WEBHOOK] Donasi ${donasi.id} → PAID ✅`);

        // Trigger Smart Routing → buat Pesanan ke UMKM
        const pesanan = await prosesDonasiPaid(donasi.id);
        if (pesanan) {
          console.log(`[WEBHOOK] Pesanan ${pesanan.id} berhasil dibuat → UMKM notif segera.`);
        }
        break;
      }

      case "PAYMENT_FAILED":
      case "PAYMENT_EXPIRED": {
        const mayarPaymentId = event.data.id as string;

        await prisma.donasi.updateMany({
          where: { mayarPaymentId },
          data: { status: StatusDonasi.FAILED },
        });

        console.log(`[WEBHOOK] Donasi ${mayarPaymentId} → FAILED ❌`);
        break;
      }

      default:
        console.log(`[WEBHOOK] Event ${event.event} tidak ditangani, skip.`);
    }
  } catch (error) {
    console.error("[WEBHOOK] Error saat proses event:", error);
    // Return 200 tetap agar Mayar tidak retry terus
    return NextResponse.json({ received: true, error: "Processing error" });
  }

  return NextResponse.json({ received: true });
}
