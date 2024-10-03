"use client";

import { Suspense, useState } from "react";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { Switcher } from "./switcher";
import { Tabs, type TabsProps } from "./tabs";
import { cn } from "@mapform/lib/classnames";

export function StandardLayout({
  topContent,
  bottomContent,
  drawerContent,
  currentWorkspaceSlug,
  ...tabProps
}: {
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  currentWorkspaceSlug?: string;
  drawerContent?: React.ReactNode;
  children: React.ReactNode;
} & Pick<TabsProps, "action" | "children" | "pathNav" | "tabs">) {
  const [showNav, setShowNav] = useState(true);

  return (
    <div
      className={cn(
        "flex flex-1 overflow-hidden transition-all",
        !showNav ? "ml-[-300px]" : drawerContent ? "mr-[-300px]" : "mr-0"
      )}
    >
      <div className="flex-1 overflow-hidden flex">
        {/* NAV */}
        <div className="flex flex-col gap-y-5 overflow-y-auto bg-stone-50 px-4 py-2 w-[300px] border-r">
          <nav className="flex flex-1 flex-col">
            <Suspense fallback={<Skeleton className="h-7 w-full rounded" />}>
              <Switcher currentWorkspaceSlug={currentWorkspaceSlug} />
            </Suspense>
            {topContent}
            <div className="mt-auto">{bottomContent}</div>
          </nav>
        </div>

        {/* TOP BAR */}
        <Tabs showNav={showNav} setShowNav={setShowNav} {...tabProps} />
      </div>

      {drawerContent ? (
        <div className="flex flex-col w-[300px] flex-shrink-0 px-4 py-2 border-l">
          {drawerContent}
        </div>
      ) : null}
    </div>
  );
}
