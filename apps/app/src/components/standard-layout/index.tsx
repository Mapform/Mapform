import { Suspense } from "react";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { Switcher } from "./switcher";
import { Tabs } from "./tabs";
import {
  StandardLayoutProvider,
  type StandardLayoutProviderProps,
} from "./context";

export function StandardLayout({
  children,
  topContent,
  bottomContent,
  drawerContent,
  currentWorkspaceSlug,
  ...rest
}: {
  children: React.ReactNode;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
} & StandardLayoutProviderProps) {
  return (
    <StandardLayoutProvider
      currentWorkspaceSlug={currentWorkspaceSlug}
      drawerContent={drawerContent}
      {...rest}
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
        <Tabs>{children}</Tabs>
      </div>

      {drawerContent ? (
        <div className="flex flex-col w-[300px] flex-shrink-0 px-4 py-2 border-l">
          {drawerContent}
        </div>
      ) : null}
    </StandardLayoutProvider>
  );
}
