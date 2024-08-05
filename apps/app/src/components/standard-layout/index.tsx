import { Suspense } from "react";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { Switcher } from "./switcher";

export function StandardLayout({
  topContent,
  bottomContent,
  currentOrgSlug,
  children,
}: {
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  currentOrgSlug?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-1">
        {/* NAV */}
        <div className="flex flex-col gap-y-5 overflow-y-auto bg-stone-50 p-6 w-[300px] border-r">
          <nav className="flex flex-1 flex-col">
            <Suspense fallback={<Skeleton className="h-7 w-full rounded" />}>
              <Switcher currentOrgSlug={currentOrgSlug} />
            </Suspense>
            {topContent}
            <div className="mt-auto">{bottomContent}</div>
          </nav>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}
