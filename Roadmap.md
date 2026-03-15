# 🗺️ Roadmap Pengembangan: TakjilChain

> **Tagline:** Elevating Ramadan Charity with AI-Driven Supply Chain.
>
> **Misi:** Merevolusi distribusi sedekah takjil di Kota Pontianak dengan menghubungkan Donatur, Pengurus Masjid, dan UMKM Kuliner Lokal secara cerdas via Agentic AI.

**Tech Stack:**

- **Frontend & Backend:** Next.js 15+ (App Router) — TypeScript
- **Runtime:** Bun
- **Database:** PostgreSQL via Supabase (Serverless)
- **ORM:** Prisma
- **Infrastructure:** Vercel (Edge Functions & Hosting)
- **Payment Gateway:** Mayar API
- **AI Engine:** Google Gemini API (Free via Google AI Studio)

**Design System:** Modern-Spiritual Minimalist

| Token     | Value     | Fungsi                     |
| --------- | --------- | -------------------------- |
| Emerald   | `#065F46` | Warna primer, brand utama  |
| Off-White | `#F9FAFB` | Background halaman         |
| Charcoal  | `#111827` | Teks & kontras utama       |
| Amber     | `#F59E0B` | Aksen, CTA, status pending |

**Tipografi:** Inter / Geist Sans via `next/font/google`
**Skala MVP:** Uji coba hiperlokal — Kota Pontianak.

---

## ✅ Phase 0: Fondasi (SELESAI)

Setup awal proyek sudah berhasil dilakukan. Berikut checklist konfirmasi:

- [x] **Inisiasi Proyek Next.js 15+** dengan TypeScript & App Router.
- [x] **Bun** sebagai package manager & runtime.
- [x] **Prisma ORM** terpasang (`prisma/` folder ada).
- [x] **Environment File** (`.env`) sudah dikonfigurasi.
- [x] **ESLint & TypeScript** config sudah berjalan.

---

## 🗄️ Phase 1: Skema Database & Relasi (Supply Chain Core)

**Fokus:** Membangun arsitektur data yang merepresentasikan seluruh alur bisnis TakjilChain.

### 1.1 — Definisi Model Prisma

Buka `prisma/schema.prisma`. Definisikan model berikut:

- [x] **`User`** — Model autentikasi dasar.
  ```
  Field: id, name, email, role (Enum: DONATUR | PENGURUS_MASJID | UMKM), createdAt
  ```
- [x] **`Masjid`** — Profil & data kebutuhan masjid.
  ```
  Field: id, nama, alamat, koordinatLat, koordinatLng, userId (FK → User), kuotaHarian[]
  ```
- [x] **`KuotaHarian`** — Kebutuhan spesifik per hari Ramadhan (relasi ke Masjid).
  ```
  Field: id, masjidId (FK), tanggal, kuotaTotal, kuotaTerpenuhi, jenisRequest, status (Enum: OPEN | CLOSED | FULL)
  ```
- [x] **`UMKM`** — Profil kapasitas & lokasi penyedia takjil.
  ```
  Field: id, nama, alamat, koordinatLat, koordinatLng, kapasitasHarian, sisaKapasitas, userId (FK → User), saldo, pesanan[]
  ```
- [x] **`Donasi`** — Riwayat transaksi donatur melalui Mayar.
  ```
  Field: id, donaturId (FK → User), kuotaHarianId (FK), jumlahPorsi, totalHarga, status (Enum: PENDING | PAID | FAILED), mayarPaymentId, createdAt
  ```
- [x] **`Pesanan`** — Logistik order dari sistem ke UMKM.
  ```
  Field: id, kuotaHarianId (FK), umkmId (FK), jumlahPorsi, status (Enum: WAITING | ACCEPTED | REJECTED | DELIVERED | CONFIRMED), fotoEvidenceUrl, narasiAI, createdAt, updatedAt
  ```

### 1.2 — Sinkronisasi ke Database

- [x] Jalankan `bunx prisma db push` untuk mendorong skema ke Supabase.
- [x] Jalankan `bunx prisma generate` untuk men-generate Prisma Client.

### 1.3 — Seeding Data Dummy

- [x] Buat `prisma/seed.ts` dengan data:
  - 3–5 Masjid fiktif dengan koordinat GPS betulan di Pontianak.
  - 5–8 UMKM fiktif tersebar di sekitar masjid tersebut.
  - 1 user per role untuk keperluan testing (Donatur, Pengurus, UMKM).
- [x] Jalankan `bunx prisma db seed`.

---

## ⚙️ Phase 2: Core Backend — Server Actions & API Routes

**Fokus:** Logika bisnis utama: smart routing, pembayaran, dan webhook.

### 2.1 — Smart Routing Algorithm

- [x] Buat fungsi `findNearestUMKM(masjidId, jumlahPorsi)` di `src/lib/routing.ts`.
  - Ambil koordinat Masjid dari DB.
  - Ambil semua UMKM yang `sisaKapasitas >= jumlahPorsi`.
  - Hitung jarak menggunakan **Haversine Formula**.
  - Return UMKM dengan jarak terpendek & sisa kapasitas terbanyak.
- [x] Buat fungsi `createPesanan(kuotaHarianId, umkmId, jumlahPorsi)` di `src/lib/orders.ts`.
  - Kurangi `sisaKapasitas` UMKM secara atomik (gunakan Prisma `$transaction`).
  - Update `kuotaTerpenuhi` di model `KuotaHarian`.
  - Ubah status `KuotaHarian` → `FULL` jika `kuotaTerpenuhi >= kuotaTotal`.

### 2.2 — Integrasi Mayar API

- [x] Buat `src/app/api/checkout/route.ts`.
  - **Input:** `kuotaHarianId`, `jumlahPorsi`, `donaturData`.
  - **Proses:** Hitung total harga, buat record `Donasi` status `PENDING`, panggil Mayar API generate _Payment Link_.
  - **Output:** Return URL _Payment Link_ Mayar untuk redirect di frontend.
- [x] Buat `src/app/api/webhook/mayar/route.ts`.
  - Verifikasi signature HMAC dari Mayar untuk keamanan.
  - Jika event `PAYMENT_PAID`: update `Donasi` → `PAID`, trigger `createPesanan`.
  - Jika event `PAYMENT_FAILED`: update `Donasi` → `FAILED`.

### 2.3 — Confirmation System (Masjid)

- [x] Buat Server Action `konfirmasiTerima(pesananId)` di `src/lib/actions/masjid.ts`.
  - Update status `Pesanan` → `CONFIRMED`.
  - Tambah jumlah dana ke field `saldo` UMKM secara atomik.
  - Trigger Narrative Reporting Agent (Phase 3.2).

---

## 🤖 Phase 3: Agentic AI Engine

**Fokus:** Mengaktifkan fitur AI yang benar-benar _otonom_ — bukan sekadar chatbot.

**AI Provider:** Google Gemini API — gratis via [Google AI Studio](https://aistudio.google.com/).

```bash
bun add @google/generative-ai
```

### 3.1 — Logistics Agent (Auto Re-Route)

- [x] Buat `src/lib/agents/logisticsAgent.ts`.
  - Dijalankan sebagai **Vercel Cron Job** setiap 5 menit (konfigurasi di `vercel.json`).
  - Logic: Cari semua `Pesanan` dengan status `WAITING` yang `createdAt`-nya sudah > 30 menit.
  - Untuk setiap pesanan tersebut: panggil `findNearestUMKM` (exclude UMKM yang sudah `REJECTED`), buat `Pesanan` baru ke UMKM berikutnya, tandai pesanan lama → `REJECTED`.
- [x] Tambahkan konfigurasi cron di `vercel.json`:
  ```json
  {
    "crons": [{ "path": "/api/agents/logistics", "schedule": "*/5 * * * *" }]
  }
  ```

### 3.2 — Narrative Reporting Agent

- [x] Buat `src/lib/agents/reportingAgent.ts`.
  - **Input:** Data `Pesanan` yang baru `CONFIRMED` (nama masjid, nama UMKM, jenis takjil, jumlah porsi, waktu antar).
  - **Proses:** Kirim data ke Gemini API dengan prompt yang terstruktur untuk menghasilkan narasi emosional dalam Bahasa Indonesia.
  - **Output:** Simpan narasi ke field `narasiAI` di tabel `Pesanan` + tampilkan di halaman donatur.
  - Contoh output AI:
    > _"Alhamdulillah, berkat donasi Anda, 50 paket Es Blewah dari Dapur Bu Nita telah sampai di Masjid Mujahidin tepat 20 menit sebelum Adzan Maghrib berkumandang. Semoga menjadi amal jariyah yang mengalir tiada henti."_

### 3.3 — Demand Forecasting Agent

- [x] Buat `src/lib/agents/forecastingAgent.ts`.
  - Analisa historis `KuotaHarian` (pola hari Jumat, malam ke-21, ke-27 Ramadhan, dll.).
  - Kirim data ke Gemini untuk generate rekomendasi peningkatan kuota.
  - Tampilkan sebagai _Insight Card_ di Dashboard Pengurus Masjid.
  - Contoh output: _"Berdasarkan data tahun lalu, jamaah diprediksi meningkat 40% pada malam ke-27 Ramadhan. Pertimbangkan menambah kuota menjadi 140 porsi."_

---

## 🎨 Phase 4: Frontend Development (UI/UX)

**Fokus:** Menerjemahkan design system ke komponen yang fungsional, indah, dan responsif.

### 4.1 — Setup Design System

- [ ] Konfigurasi `tailwind.config.ts`: tambahkan palet warna custom (emerald `#065F46`, amber `#F59E0B`, charcoal `#111827`).
- [ ] Install & konfigurasi font Inter di `src/app/layout.tsx` via `next/font/google`.
- [ ] Buat komponen reusable di `src/components/ui/`: `Button`, `Card`, `Badge`, `ProgressBar`, `Modal`, `Spinner`.
- [ ] Setup glassmorphism style untuk Navbar di `src/components/layout/Navbar.tsx`.

### 4.2 — Halaman Donatur (`/`)

- [ ] **Hero Section** — Tagline, sub-deskripsi, dan CTA utama "Lihat Masjid yang Butuh Takjil".
- [ ] **Daftar Masjid (Urgency List)** — Card list masjid yang kuotanya belum terpenuhi hari ini, diurutkan dari persentase kuota terendah (paling butuh) ke tertinggi.
  - Setiap card: nama masjid, alamat, progress bar kuota, tombol "Donasi Sekarang".
- [ ] **Halaman Detail Masjid** (`/masjid/[id]`) — Informasi lengkap, progress bar kuota real-time, slider/input jumlah porsi, kalkulasi harga otomatis, tombol checkout.
- [ ] **Halaman Konfirmasi / Impact Report** (`/donasi/[id]`) — Tampilkan AI Narrative Report setelah pesanan terkonfirmasi. Tambahkan tombol share ke WhatsApp.

### 4.3 — Dashboard Pengurus Masjid (`/dashboard/masjid`)

- [ ] **Autentikasi** — Login page dengan Supabase Auth (role: `PENGURUS_MASJID`).
- [ ] **Manajemen Kuota** — Kalender Ramadhan interaktif untuk mengeset kuota per hari. Input jenis takjil (opsional, misal: "Nasi Kotak", "Kue Basah").
- [ ] **Live Status Board** — Tampilkan status real-time: donasi masuk, UMKM yang bertugas, status pengiriman per pesanan.
- [ ] **Tombol Konfirmasi** — Satu tombol besar "Takjil Diterima ✅" yang men-trigger settlement dana ke UMKM.
- [ ] **Insight AI Card** — Rekomendasi dari Forecasting Agent (tambah kuota saat malam spesial, dll.).

### 4.4 — Dashboard UMKM (`/dashboard/umkm`)

- [ ] **Autentikasi** — Login page dengan Supabase Auth (role: `UMKM`).
- [ ] **Order Management** — Tabel pesanan masuk dengan countdown 30 menit, tombol `Terima` dan `Tolak`.
- [ ] **Manajemen Kapasitas** — Input limit produksi harian. Progress bar visual sisa kapasitas hari ini.
- [ ] **Upload Bukti** — Form upload foto setelah mengantarkan takjil (simpan ke Supabase Storage).
- [ ] **Dompet UMKM** — Tampilkan total saldo terkumpul + tombol "Cairkan Dana" (integrasi Mayar Disbursement API).

---

## 🚀 Phase 5: Deployment & Submit Karya

**Fokus:** Membawa aplikasi ke production secara gratis dan otomatis.

- [ ] **Git Push** — Commit semua kode (termasuk folder `prisma/`) ke repositori GitHub. Pastikan `.env` ada di `.gitignore`.
- [ ] **Deploy ke Vercel** — Hubungkan Vercel dengan repositori GitHub (auto-deploy on push to `main`).
- [ ] **Set Environment Variables** di Vercel Dashboard:
  - `DATABASE_URL` & `DIRECT_URL` (dari Supabase)
  - `MAYAR_API_KEY` & `MAYAR_WEBHOOK_SECRET`
  - `GEMINI_API_KEY` (dari Google AI Studio)
  - `NEXTAUTH_SECRET` & `NEXTAUTH_URL`
- [ ] **Testing End-to-End Production** — Simulasi alur lengkap:
  1. Masjid input kuota
  2. Donatur bayar via Mayar (mode sandbox)
  3. Order otomatis ke UMKM (Smart Routing)
  4. UMKM upload foto bukti
  5. Masjid konfirmasi diterima
  6. AI generate & kirim laporan narasi ke donatur
  7. Dana cair ke rekening UMKM
- [ ] **Dokumentasi & Submit** — Rekam screen recording proses demo. Submit link Vercel + video ke portal Mayar!

---

## 📊 Alur Kerja Lengkap (Workstream)

```
[Masjid]        → Input kebutuhan: "100 porsi untuk H-15 Ramadhan"
[Donatur]       → Buka app, lihat daftar masjid, bayar via Mayar (QRIS / E-Wallet / Transfer)
[Mayar Webhook] → Notifikasi PAID diterima → trigger Smart Routing
[Sistem]        → Cari UMKM terdekat via Haversine Formula + cek kapasitas
[UMKM]          → Terima notifikasi order, klik "Terima" (ada countdown 30 menit)
[AI Agent]      → Jika tidak respons 30 menit → auto re-route ke UMKM berikutnya
[UMKM]          → Masak → antar ke masjid → upload foto bukti via app
[Masjid]        → Klik "Takjil Diterima ✅" sebagai konfirmasi final
[AI Agent]      → Generate laporan narasi emosional → tampilkan & bagikan ke Donatur
[Mayar]         → Dana escrow dicairkan ke rekening / e-wallet UMKM
```

---

## 🎯 Prioritas MVP (Quick Win untuk Lomba!)

Fokus ke fitur yang paling _WOW_ dan punya nilai demo tertinggi bagi juri:

| Prioritas | Fitur                                 | Alasan                                   |
| --------- | ------------------------------------- | ---------------------------------------- |
| 🔴 **P0** | Smart Routing + Checkout Mayar        | Inti bisnis, harus jalan di demo         |
| 🔴 **P0** | AI Narrative Reporting (Gemini)       | Bukti nyata "Agentic AI" ke juri         |
| 🟡 **P1** | Dashboard UMKM (Order + Upload)       | Proof of concept siklus penuh            |
| 🟡 **P1** | Dashboard Masjid (Kuota + Konfirmasi) | Melengkapi alur bisnis end-to-end        |
| 🟢 **P2** | Auto Re-route Logistics (Cron Job)    | Fitur Agentic yang paling keren & otonom |
| 🟢 **P2** | Demand Forecasting Agent              | Nilai plus jika ada waktu tersisa        |
| ⚪ **P3** | Real-time Map (Geo-Iftar Discovery)   | Polish & wow factor, bukan keharusan MVP |
