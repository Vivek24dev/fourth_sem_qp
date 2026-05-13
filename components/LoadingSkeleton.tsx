export default function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-lg border border-white/10 bg-white/10"
        />
      ))}
    </div>
  );
}
