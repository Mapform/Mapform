"use client";

import { Skeleton } from "@mapform/ui/components/skeleton";
import WorkspaceLayout from "./workspace-layout";

export default function Loading() {
  return (
    <WorkspaceLayout orgSlug="" workspaceId="" workspaceSlug="">
      <div className="flex flex-wrap gap-4">
        <Skeleton className="w-72 h-[180px] rounded-xl" />
        <Skeleton className="w-72 h-[180px] rounded-xl" />
      </div>
    </WorkspaceLayout>
  );
}
