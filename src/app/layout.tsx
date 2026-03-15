import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

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
    <html lang="id" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-screen bg-gray-50/50 text-gray-900 antialiased selection:bg-emerald-500 selection:text-white flex flex-col`}
      >
        <Navbar />
        {/* Konten utama membentang secara flex 1 agar footer selalu di bawah */}
        <main className="flex-1 w-full max-w-6xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
