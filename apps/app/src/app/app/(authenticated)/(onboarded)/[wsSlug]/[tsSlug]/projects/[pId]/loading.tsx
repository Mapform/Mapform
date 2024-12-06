import { Skeleton } from "@mapform/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 p-4">
      <div className="s w-[392px] pl-8">
        <div className="pace-y-3 p-4 pt-0">
          <Skeleton className="h-[140px] w-full rounded-lg" />
          <div className="mt-2 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
      <Skeleton className="flex-1 rounded-xl" />
    </div>
  );
}
