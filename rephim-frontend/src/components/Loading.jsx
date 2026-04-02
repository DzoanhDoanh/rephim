export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[#E50914] animate-spin" />
      </div>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#1c1b1b]">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-2.5 space-y-2">
        <div className="h-4 skeleton rounded w-4/5" />
        <div className="h-3 skeleton rounded w-3/5" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => <MovieCardSkeleton key={i} />)}
    </div>
  );
}
