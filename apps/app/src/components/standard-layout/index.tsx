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
    <div className="relative flex-1">
      <div
        className={cn(
          "flex absolute overflow-hidden top-0 h-screen transition-all"
          // showNav ? "left-0" : "-left-[300px]"
        )}
      >
        <div className="w-screen flex-shrink-0 flex-1 flex">
          {/* NAV */}
          <div className="flex flex-col flex-shrink-0 gap-y-5 overflow-y-auto bg-stone-50 px-4 py-2 w-[300px] border-r">
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
    </div>
  );
}
