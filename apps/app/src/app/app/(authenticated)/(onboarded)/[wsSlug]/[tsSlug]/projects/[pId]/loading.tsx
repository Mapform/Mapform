import { Skeleton } from "@mapform/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="p-4">
      <div className="w-[360px] space-y-3 pl-8">
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
