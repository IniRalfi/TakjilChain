export default function Loading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Ring spinner luar */}
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-solid border-emerald-500 border-t-transparent"></div>
        {/* Lingkaran dalam berkedip */}
        <div className="h-10 w-10 animate-pulse rounded-full bg-emerald-500/30"></div>
      </div>
    </div>
  );
}
