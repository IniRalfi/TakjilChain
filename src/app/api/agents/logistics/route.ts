import { NextResponse } from "next/server";
import { runLogisticsAgent } from "@/lib/agents/logisticsAgent";

// Endpoint khusus yang akan dipanggil oleh Vercel Cron Job
export async function GET(req: Request) {
  try {
    // Keamanan Opsional:
    // Kamu bisa menggunakan header authorization khusus dari Vercel
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasil = await runLogisticsAgent();

    return NextResponse.json(hasil);
  } catch (error) {
    console.error("Error saat menjalankan cron job logistics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
