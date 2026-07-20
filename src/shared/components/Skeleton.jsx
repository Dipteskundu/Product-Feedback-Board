function Skeleton({ className = '', width, height, rounded = 'rounded' }) {
  return (
    <div
      className={`animate-pulse-soft bg-border ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-6 h-4" />
        </div>
        <div className="flex-1 space-y-3">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-5/6 h-3" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-lg hidden sm:block" />
      </div>
    </div>
  );
}

function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 text-center space-y-2">
      <Skeleton className="w-12 h-10 mx-auto" />
      <Skeleton className="w-20 h-4 mx-auto" />
    </div>
  );
}

export { Skeleton, CardSkeleton, ListSkeleton, StatSkeleton };
export default Skeleton;
