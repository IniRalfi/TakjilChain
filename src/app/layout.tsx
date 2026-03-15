import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Menggunakan font Inter untuk kesan tech-savvy & clean
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TakjilChain | Elevating Ramadan Charity",
  description: "Platform AI-Driven untuk Distribusi Sedekah Takjil di Kota Pontianak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* Tambahkan suppressHydrationWarning di sini */}
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen bg-offwhite text-charcoal antialiased selection:bg-emerald-main selection:text-white`}
      >
        {/* Navbar Global Sederhana (Glassmorphism) */}
        <nav className="fixed top-0 w-full z-50 glass shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-main text-2xl">🌙</span>
              <h1 className="font-bold text-xl tracking-tight text-emerald-main">TakjilChain</h1>
            </div>
            {/* Navigasi Placeholder */}
            <div className="text-sm font-medium text-charcoal-muted hidden md:flex gap-6">
              <a href="/" className="hover:text-emerald-main transition">
                Beranda
              </a>
              <a href="/dashboard/masjid" className="hover:text-emerald-main transition">
                Pengurus
              </a>
              <a href="/dashboard/umkm" className="hover:text-emerald-main transition">
                UMKM
              </a>
            </div>
          </div>
        </nav>

        {/* Padding top agar konten tidak tertabrak fixed navbar */}
        <main className="pt-24 pb-12 px-4 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
