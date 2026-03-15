"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

// Import file logo
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 transition-transform group-hover:scale-105">
              <Image
                src={logo}
                alt="TakjilChain Logo"
                fill
                className="object-contain"
                sizes="56px"
              />
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight text-emerald-600">TakjilChain</h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors ${
                pathname === "/" ? "text-emerald-600" : "text-gray-600 hover:text-emerald-500"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/#daftar-masjid"
              className="text-sm font-semibold text-gray-600 hover:text-emerald-500 transition-colors"
            >
              Daftar Masjid
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <Link
              href="/dashboard/masjid"
              className={`text-sm font-semibold px-4 py-2 rounded-full transition border ${
                pathname.startsWith("/dashboard/masjid")
                  ? "bg-emerald-600 text-white border-transparent shadow-md shadow-emerald-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-emerald-600"
              }`}
            >
              Akses Pengurus
            </Link>
            <Link
              href="/dashboard/umkm"
              className={`text-sm font-semibold px-4 py-2 rounded-full transition border ${
                pathname.startsWith("/dashboard/umkm")
                  ? "bg-emerald-600 text-white border-transparent shadow-md shadow-emerald-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-emerald-600"
              }`}
            >
              Akses UMKM
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-emerald-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 flex flex-col gap-4 shadow-lg absolute w-full left-0">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`text-base font-semibold py-2 ${
              pathname === "/" ? "text-emerald-600" : "text-gray-700"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/#daftar-masjid"
            onClick={() => setIsOpen(false)}
            className="text-base font-semibold text-gray-700 py-2"
          >
            Daftar Masjid
          </Link>
          <hr className="border-gray-100" />
          <Link
            href="/dashboard/masjid"
            onClick={() => setIsOpen(false)}
            className={`text-base font-medium px-4 py-3 rounded-xl text-center border transition-colors ${
              pathname.startsWith("/dashboard/masjid")
                ? "bg-emerald-600 text-white border-transparent shadow-md"
                : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-emerald-600"
            }`}
          >
            Portal Pengurus Masjid
          </Link>
          <Link
            href="/dashboard/umkm"
            onClick={() => setIsOpen(false)}
            className={`text-base font-medium px-4 py-3 rounded-xl text-center border transition-colors ${
              pathname.startsWith("/dashboard/umkm")
                ? "bg-emerald-600 text-white border-transparent shadow-md"
                : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-emerald-600"
            }`}
          >
            Portal Mitra UMKM
          </Link>
        </div>
      )}
    </nav>
  );
}
