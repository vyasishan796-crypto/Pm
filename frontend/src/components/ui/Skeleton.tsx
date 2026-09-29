import { classNames } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export default function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={classNames("skeleton", className)} style={{ height: "16px" }} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={classNames("rounded-[16px] border p-5 space-y-3", className)} style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-card)" }}>
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-1/4" />
    </div>
  );
}
