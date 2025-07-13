import { Skeleton } from "@mapform/ui/components/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="z-10 flex flex-col gap-2">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  );
}
