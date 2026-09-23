export function SkeletonBlock({ className = "" }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function TripCardSkeleton() {
  return (
    <div className="rounded-[20px] overflow-hidden border border-line bg-white">
      <SkeletonBlock className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-1/2" />
        <SkeletonBlock className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function RowSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TripCardSkeleton key={i} />
      ))}
    </div>
  );
}
