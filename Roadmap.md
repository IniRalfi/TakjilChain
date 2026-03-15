# 🗺️ Roadmap Pengembangan: TakjilChain

**Platform AI-Driven untuk Distribusi Takjil dan Manajemen Rantai Pasok Sedekah**

**Tech Stack:** Next.js (Fullstack), TypeScript, Tailwind CSS, Prisma ORM, Supabase (PostgreSQL), Vercel.
**Skala MVP:** Uji coba hiperlokal (Kota Pontianak).

---

## 🏁 Phase 1: Inisiasi & Setup Environment

Fokus: Menyiapkan fondasi _repository_ dan menghubungkan proyek lokal dengan _database cloud_.

- [ ] **Desain UI/UX (Figma):** Buat _wireframe_ dan _mockup_ kasar untuk 3 halaman utama (Donatur, Masjid, UMKM) menggunakan palet warna _Emerald Green_, _Off-White_, dan _Charcoal_.
- [ ] **Setup Supabase:** Buat proyek baru di [Supabase](https://supabase.com). Dapatkan `DATABASE_URL` dan `DIRECT_URL`.
- [ ] **Inisiasi Proyek:** Buka terminal, jalankan `npx create-next-app@latest takjilchain` (Pilih: TypeScript, Tailwind, App Router).
- [ ] **Setup ORM:** Masuk ke _folder_ `takjilchain`, jalankan `npm install prisma --save-dev` lalu `npx prisma init`.
- [ ] **Konfigurasi Environment:** Masukkan URL dari Supabase dan API Key Mayar (mode _sandbox_/testing) ke dalam file `.env`.

## 🗄️ Phase 2: Skema Database & Relasi (Supply Chain Core)

Fokus: Membangun arsitektur data yang sanggup menangani alur donasi dan kapasitas logistik UMKM.

- [ ] **Definisi Model Prisma:** Buka `prisma/schema.prisma`. _Prompt_ AI untuk membuatkan tabel:
  - `User` (Role: Donatur, Pengurus_Masjid, UMKM).
  - `Masjid` (Relasi ke User, field: `nama`, `lokasi_koordinat`, `kuota_harian`, `kuota_terpenuhi`).
  - `UMKM` (Relasi ke User, field: `nama`, `lokasi_koordinat`, `kapasitas_harian`, `sisa_kapasitas`).
  - `Donasi` (Pencatatan uang masuk via Mayar).
  - `Pesanan` (Logistik: status pengiriman dari UMKM ke Masjid).
- [ ] **Push ke Database:** Eksekusi `npx prisma db push` di terminal untuk menerapkan skema ke Supabase.
- [ ] **Seeding Data Dummy:** Buat _script_ `seed.ts` untuk mengisi data 3-5 Masjid dan UMKM fiktif yang tersebar di area Pontianak untuk keperluan _testing_.

## ⚙️ Phase 3: Core Logic & API Mayar (Backend via Server Actions)

Fokus: Menulis logika _routing_ pesanan dan integrasi pembayaran.

- [ ] **Fungsi Alokasi (Smart Routing):** _Prompt_ AI untuk membuat _Server Action_ di Next.js. Logikanya: Cari UMKM terdekat dari Masjid (kalkulasi jarak koordinat) yang `sisa_kapasitas`-nya masih mencukupi untuk memenuhi pesanan.
- [ ] **Integrasi Mayar (Generate Link):** Buat _endpoint_ `/api/checkout` yang memanggil API Mayar. Saat donatur memasukkan nominal, sistem membalas dengan _Payment Link_ unik.
- [ ] **Webhook Mayar (Opsional/Lanjutan):** Buat _endpoint_ untuk mendengarkan status pembayaran (Jika status = _PAID_, otomatis jalankan Fungsi Alokasi ke UMKM).

## 🎨 Phase 4: Frontend Development (Vibecoding UI)

Fokus: Menerjemahkan desain dari Figma menjadi komponen antarmuka yang fungsional.

- [ ] **Halaman Landing Page (Donatur):** Buat komponen _Card_ menggunakan Tailwind untuk menampilkan daftar Masjid yang kuotanya berstatus _Underfunded_.
- [ ] **Dashboard Masjid:** Halaman super _clean_ untuk _update_ `kuota_harian`.
- [ ] **Dashboard UMKM:** Halaman berisi tabel pesanan masuk (_Accept/Reject_) dan tombol unggah foto bukti pengiriman.
- [ ] **Integrasi UI ke Server Actions:** Hubungkan tombol-tombol di _frontend_ dengan fungsi _backend_ yang dibuat di Phase 3.

## 🤖 Phase 5: AI Agent & Polishing

Fokus: Mengaktifkan fitur "Agentic AI" sesuai syarat lomba.

- [ ] **Setup AI Provider:** Dapatkan API Key dari Gemini (Google AI Studio) atau OpenAI, masukkan ke `.env`.
- [ ] **Auto-Reporting Logic:** Buat _cron job_ sederhana atau eksekusi manual (via tombol admin) yang menarik data `Pesanan` dengan status 'Selesai'.
- [ ] **Generate Vibe Report:** Instruksikan AI untuk menulis laporan singkat yang estetik dan personal (contoh: _"Alhamdulillah, 50 porsi takjil dari UMKM Ibu Budi telah sampai di Masjid At-Taqwa berkat donasi Anda..."_).
- [ ] **Uji Coba Menyeluruh (End-to-End):** Lakukan simulasi dari donasi, pembayaran (Mayar testing), order masuk ke UMKM, sampai _report_ AI keluar.

## 🚀 Phase 6: Deployment & Submit Karya

Fokus: Membawa aplikasi ke _production_ secara gratis dan otomatis.

- [ ] **Git Push:** _Commit_ dan _push_ semua kode (termasuk _folder_ Prisma) ke repositori GitHub.
- [ ] **Deploy ke Vercel:** Hubungkan Vercel dengan repositori GitHub.
- [ ] **Set Environment Variables:** Salin semua isi `.env` lokal ke pengaturan _Environment Variables_ di Vercel.
- [ ] **Testing Production:** Buka _link_ Vercel, pastikan semua fitur dan _database_ berjalan lancar.
- [ ] **Dokumentasi & Submit:** Rekam video _screen recording_ (proses _vibecoding_ dan demo aplikasi). _Submit_ _link_ Vercel dan video ke portal Mayar!
