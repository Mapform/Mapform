import { Skeleton } from "@mapform/ui/components/skeleton";
import { cn } from "@mapform/lib/classnames";

export function BasicSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("z-10 flex flex-col gap-2", className)}>
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  );
}
