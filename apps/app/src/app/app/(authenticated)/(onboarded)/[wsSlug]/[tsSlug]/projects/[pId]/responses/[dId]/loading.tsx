import { Skeleton } from "@mapform/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2 p-4">
      <Skeleton className="h-[20px] w-[100px]" />
      <Skeleton className="h-[32px] w-full" />
      <Skeleton className="h-[32px] w-full" />
      <Skeleton className="h-[32px] w-full" />
    </div>
  );
}
