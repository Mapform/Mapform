"use client";

import { Skeleton } from "@mapform/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-wrap gap-4">
      <Skeleton className="w-72 h-[180px] rounded-xl" />
      <Skeleton className="w-72 h-[180px] rounded-xl" />
    </div>
  );
}
