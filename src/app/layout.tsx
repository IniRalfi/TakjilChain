import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LenisScroll from "@/components/LenisScroll"; // <--- 1. Import Lenis
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

// 1. Import pattern image di sini
import patternImage from "@/assets/pattern.png";

// Menggunakan font Inter untuk kesan tech-savvy & clean
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TakjilChain | Berbagi Takjil Cerdas",
  description: "Platform AI-Driven untuk Distribusi Sedekah Takjil di Kota Pontianak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* 2. Pasang pattern image via inline-style dan body tag */}
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen text-gray-900 antialiased selection:bg-emerald-500 selection:text-white flex flex-col relative`}
        style={{
          backgroundImage: `url(${patternImage.src})`,
          backgroundRepeat: "repeat", // Membuat ia jadi repeating pattern
          backgroundSize: "300px", // Atur ukurannya supaya gak kekecilan/kebesaran
          backgroundAttachment: "fixed", // Biar kalau scroll pattern-ya diem (efek parallax cool)
        }}
      >
        <ToastProvider>
          <LenisScroll />
          <div className="fixed inset-0 bg-gray-50/70 pointer-events-none -z-10"></div>
          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
