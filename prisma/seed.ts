import { PrismaClient, Role, StatusKuota } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Helper: hash password pakai Bun built-in ───────────────
async function hash(plain: string) {
  return Bun.password.hash(plain, { algorithm: "bcrypt", cost: 10 });
}

async function main() {
  console.log("🌱 Mulai seeding data TakjilChain...\n");

  // ──────────────────────────────────────────────────────────
  // CLEANUP — hapus data lama agar seed bisa dijalankan ulang
  // ──────────────────────────────────────────────────────────
  await prisma.pesanan.deleteMany();
  await prisma.donasi.deleteMany();
  await prisma.kuotaHarian.deleteMany();
  await prisma.umkmProfile.deleteMany();
  await prisma.masjidProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Data lama dibersihkan.\n");

  // ──────────────────────────────────────────────────────────
  // 1. DONATUR
  // ──────────────────────────────────────────────────────────
  const donaturData = [
    { name: "Ahmad Fauzi", email: "ahmad@takjilchain.id" },
    { name: "Siti Rahmah", email: "siti@takjilchain.id" },
    { name: "Budi Santoso", email: "budi@takjilchain.id" },
  ];

  const donaturList = [];
  for (const d of donaturData) {
    const user = await prisma.user.create({
      data: {
        ...d,
        password: await hash("password123"),
        role: Role.DONATUR,
      },
    });
    donaturList.push(user);
    console.log(`✅ Donatur: ${user.name}`);
  }

  // ──────────────────────────────────────────────────────────
  // 2. PENGURUS MASJID + PROFIL MASJID
  //    Koordinat GPS betulan dari masjid di Pontianak
  // ──────────────────────────────────────────────────────────
  const masjidData = [
    {
      user: { name: "Ustadz Hasan", email: "mujahidin@takjilchain.id" },
      profil: {
        nama: "Masjid Raya Mujahidin",
        alamat: "Jl. Jend. Ahmad Yani, Pontianak Selatan",
        kecamatan: "Pontianak Selatan",
        koordinatLat: -0.0284,
        koordinatLng: 109.3234,
        kapasitasJamaah: 500,
      },
    },
    {
      user: { name: "Ustadz Ridwan", email: "jami@takjilchain.id" },
      profil: {
        nama: "Masjid Jami' Sultan Syarif Abdurrahman",
        alamat: "Jl. Tanjungpura, Pontianak Kota",
        kecamatan: "Pontianak Kota",
        koordinatLat: -0.0178,
        koordinatLng: 109.3373,
        kapasitasJamaah: 800,
      },
    },
    {
      user: { name: "Ustadz Darmawan", email: "attaqwa@takjilchain.id" },
      profil: {
        nama: "Masjid At-Taqwa",
        alamat: "Jl. Sungai Raya Dalam, Pontianak Tenggara",
        kecamatan: "Pontianak Tenggara",
        koordinatLat: -0.0523,
        koordinatLng: 109.3312,
        kapasitasJamaah: 300,
      },
    },
    {
      user: { name: "Ustadz Malik", email: "alikhlas@takjilchain.id" },
      profil: {
        nama: "Masjid Al-Ikhlas",
        alamat: "Jl. Imam Bonjol, Pontianak Timur",
        kecamatan: "Pontianak Timur",
        koordinatLat: -0.0391,
        koordinatLng: 109.3612,
        kapasitasJamaah: 250,
      },
    },
  ];

  const masjidProfileList = [];
  for (const m of masjidData) {
    const user = await prisma.user.create({
      data: {
        name: m.user.name,
        email: m.user.email,
        password: await hash("password123"),
        role: Role.PENGURUS_MASJID,
        masjidProfile: { create: m.profil },
      },
      include: { masjidProfile: true },
    });
    masjidProfileList.push(user.masjidProfile!);
    console.log(`✅ Masjid: ${m.profil.nama}`);
  }

  // ──────────────────────────────────────────────────────────
  // 3. UMKM + PROFIL USAHA
  //    Tersebar di sekitar masjid-masjid di atas
  // ──────────────────────────────────────────────────────────
  const umkmData = [
    {
      user: { name: "Ibu Fatimah", email: "dapurfatimah@takjilchain.id", phone: "08123456001" },
      profil: {
        nama: "Ibu Fatimah",
        namaUsaha: "Dapur Bu Fatimah",
        alamat: "Jl. Veteran No. 12, Pontianak Selatan",
        kecamatan: "Pontianak Selatan",
        koordinatLat: -0.0301,
        koordinatLng: 109.3251,
        kapasitasHarian: 150,
        sisaKapasitas: 150,
        hargaPerPorsi: 15000,
      },
    },
    {
      user: { name: "Pak Arifin", email: "kateringapollo@takjilchain.id", phone: "08123456002" },
      profil: {
        nama: "Pak Arifin",
        namaUsaha: "Katering Apollo",
        alamat: "Jl. Gajahmada No. 45, Pontianak Kota",
        kecamatan: "Pontianak Kota",
        koordinatLat: -0.0198,
        koordinatLng: 109.3395,
        kapasitasHarian: 200,
        sisaKapasitas: 200,
        hargaPerPorsi: 15000,
      },
    },
    {
      user: { name: "Ibu Nuraini", email: "dapurnuraini@takjilchain.id", phone: "08123456003" },
      profil: {
        nama: "Ibu Nuraini",
        namaUsaha: "Dapur Bu Nuraini",
        alamat: "Jl. Sungai Raya Dalam No. 7, Pontianak Tenggara",
        kecamatan: "Pontianak Tenggara",
        koordinatLat: -0.0541,
        koordinatLng: 109.3298,
        kapasitasHarian: 100,
        sisaKapasitas: 100,
        hargaPerPorsi: 14000,
      },
    },
    {
      user: { name: "Pak Supriadi", email: "kateringbarokah@takjilchain.id", phone: "08123456004" },
      profil: {
        nama: "Pak Supriadi",
        namaUsaha: "Katering Barokah",
        alamat: "Jl. Tanjungpura No. 88, Pontianak Kota",
        kecamatan: "Pontianak Kota",
        koordinatLat: -0.0165,
        koordinatLng: 109.3358,
        kapasitasHarian: 250,
        sisaKapasitas: 250,
        hargaPerPorsi: 16000,
      },
    },
    {
      user: { name: "Ibu Marlina", email: "bumarlina@takjilchain.id", phone: "08123456005" },
      profil: {
        nama: "Ibu Marlina",
        namaUsaha: "Warung Bu Marlina",
        alamat: "Jl. Imam Bonjol No. 23, Pontianak Timur",
        kecamatan: "Pontianak Timur",
        koordinatLat: -0.0408,
        koordinatLng: 109.3628,
        kapasitasHarian: 80,
        sisaKapasitas: 80,
        hargaPerPorsi: 13000,
      },
    },
  ];

  for (const u of umkmData) {
    await prisma.user.create({
      data: {
        name: u.user.name,
        email: u.user.email,
        phone: u.user.phone,
        password: await hash("password123"),
        role: Role.UMKM,
        umkmProfile: { create: u.profil },
      },
    });
    console.log(`✅ UMKM: ${u.profil.namaUsaha}`);
  }

  // ──────────────────────────────────────────────────────────
  // 4. KUOTA HARIAN
  //    Simulasi kebutuhan takjil untuk beberapa hari Ramadhan
  //    Referensi: Ramadhan 2026 mulai ~2 Maret 2026
  // ──────────────────────────────────────────────────────────
  console.log("\n📅 Membuat data KuotaHarian...");

  const baseDate = new Date("2026-03-02T00:00:00.000Z"); // H-1 Ramadhan

  const kuotaConfig = [
    // [masjidIndex, hariKe, kuotaTotal, jenisRequest]
    [0, 1, 80, "Nasi Kotak"],
    [0, 2, 80, "Nasi Kotak"],
    [0, 13, 100, "Nasi Kotak + Es Buah"],
    [0, 14, 120, "Nasi Kotak"], // Malam Jumat
    [1, 1, 150, "Bebas"],
    [1, 2, 150, "Bebas"],
    [1, 14, 200, "Nasi Kotak"], // Malam Jumat
    [2, 1, 60, "Kue Basah"],
    [2, 2, 60, "Kue Basah"],
    [3, 1, 50, "Nasi Kotak"],
    [3, 2, 50, "Nasi Kotak"],
  ] as const;

  for (const [idx, hariKe, kuotaTotal, jenisRequest] of kuotaConfig) {
    const tanggal = new Date(baseDate);
    tanggal.setDate(tanggal.getDate() + hariKe);

    await prisma.kuotaHarian.create({
      data: {
        masjidProfileId: masjidProfileList[idx].id,
        tanggal,
        kuotaTotal,
        hargaPerPorsi: 15000,
        jenisRequest,
        status: StatusKuota.OPEN,
      },
    });
  }
  console.log(`✅ ${kuotaConfig.length} KuotaHarian berhasil dibuat.`);

  // ──────────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────────
  console.log("\n🎉 Seeding selesai!");
  console.log("─────────────────────────────────");
  console.log(`👤 ${donaturList.length} Donatur`);
  console.log(`🕌 ${masjidProfileList.length} Masjid`);
  console.log(`🍱 ${umkmData.length} UMKM`);
  console.log(`📅 ${kuotaConfig.length} KuotaHarian`);
  console.log("─────────────────────────────────");
  console.log("💡 Login semua akun pakai password: password123");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
