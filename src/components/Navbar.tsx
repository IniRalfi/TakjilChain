"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🌙</span>
            <h1 className="font-extrabold text-xl tracking-tight text-emerald-600">TakjilChain</h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="#daftar-masjid"
              className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Daftar Masjid
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <Link
              href="/dashboard/masjid"
              className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition"
            >
              Akses Pengurus
            </Link>
            <Link
              href="/dashboard/umkm"
              className="text-sm font-semibold text-gray-700 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition"
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
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 flex flex-col gap-4 shadow-lg absolute w-full left-0">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-base font-semibold text-gray-700 py-2"
          >
            Beranda
          </Link>
          <Link
            href="#daftar-masjid"
            onClick={() => setIsOpen(false)}
            className="text-base font-semibold text-gray-700 py-2"
          >
            Daftar Masjid
          </Link>
          <hr className="border-gray-100" />
          <Link
            href="/dashboard/masjid"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl text-center"
          >
            Portal Pengurus Masjid
          </Link>
          <Link
            href="/dashboard/umkm"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-gray-700 border border-gray-200 px-4 py-3 rounded-xl text-center"
          >
            Portal Mitra UMKM
          </Link>
        </div>
      )}
    </nav>
  );
}
