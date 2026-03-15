import { PrismaClient, Role, StatusKuota } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { donaturData } from "./data/donatur";
import { masjidData } from "./data/masjid";
import { umkmData } from "./data/umkm";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function hash(plain: string) {
  return Bun.password.hash(plain, { algorithm: "bcrypt", cost: 10 });
}

async function main() {
  console.log("🌱 Mulai seeding modular TakjilChain...\n");

  // --- CLEANUP ---
  await prisma.pesanan.deleteMany();
  await prisma.donasi.deleteMany();
  await prisma.kuotaHarian.deleteMany();
  await prisma.umkmProfile.deleteMany();
  await prisma.masjidProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Data lama dibersihkan.\n");

  const passwordDefault = await hash("password123");

  // 1. SEED DONATUR
  for (const d of donaturData) {
    await prisma.user.create({
      data: { ...d, password: passwordDefault, role: Role.DONATUR },
    });
  }
  console.log(`✅ ${donaturData.length} Donatur berhasil dibuat.`);

  // 2. SEED MASJID
  const masjidProfiles = [];
  for (const m of masjidData) {
    const user = await prisma.user.create({
      data: {
        ...m.user,
        password: passwordDefault,
        role: Role.PENGURUS_MASJID,
        masjidProfile: { create: m.profil },
      },
      include: { masjidProfile: true },
    });
    masjidProfiles.push(user.masjidProfile!);
  }
  console.log(`✅ ${masjidData.length} Masjid berhasil dibuat.`);

  // 3. SEED UMKM
  for (const u of umkmData) {
    await prisma.user.create({
      data: {
        ...u.user,
        password: passwordDefault,
        role: Role.UMKM,
        umkmProfile: { create: u.profil },
      },
    });
  }
  console.log(`✅ ${umkmData.length} UMKM berhasil dibuat.`);

  // 4. SEED KUOTA HARIAN (Simulasi Otomatis)
  console.log("\n📅 Menghasilkan kuota harian otomatis...");
  const baseDate = new Date("2026-03-02T00:00:00.000Z");

  for (const profile of masjidProfiles) {
    // Buat kuota untuk 3 hari pertama Ramadhan
    for (let i = 1; i <= 3; i++) {
      const tanggal = new Date(baseDate);
      tanggal.setDate(tanggal.getDate() + i);

      await prisma.kuotaHarian.create({
        data: {
          masjidProfileId: profile.id,
          tanggal,
          kuotaTotal: Math.floor(Math.random() * 100) + 50, // Porsi random 50-150
          hargaPerPorsi: 15000,
          jenisRequest: "Nasi Kotak",
          status: StatusKuota.OPEN,
        },
      });
    }
  }
  console.log("✅ Kuota harian berhasil di-generate.");
  console.log("\n🎉 Seeding Modular Selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
