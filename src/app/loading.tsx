import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative w-48 h-48 mb-8 animate-bounce transition-all duration-1000 ease-in-out">
        {/* Kamu bisa ganti src ini dengan path gambar lenteramu */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full"></div>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Placeholder jika belum ada gambar, bisa diganti Image component */}
          <div className="text-7xl animate-pulse">🏮</div>
        </div>
      </div>

      <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
        Menyiapkan Keberkahan...
      </h2>
      <p className="text-gray-500 font-medium max-w-xs mx-auto">
        Tunggu sebentar, AI kami sedang mencarikan rute distribusi terbaik.
      </p>

      {/* Skeleton / Progress bar tipis */}
      <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-emerald-500 animate-[loading_1.5s_infinite] w-1/2"></div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `,
        }}
      />
    </div>
  );
}
