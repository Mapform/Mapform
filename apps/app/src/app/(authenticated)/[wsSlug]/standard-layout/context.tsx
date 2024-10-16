"use client";

import { cn } from "@mapform/lib/classnames";
import { useParams, usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { CurrentUserWorkspaceMemberships } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import type { WorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-directory";

export type StandardLayoutContext = {
  drawerRef: React.RefObject<HTMLDivElement>;
  workspaceSlug: string;
  showNav: boolean;
  toggleNav: () => void;
  showDrawer: boolean;
  toggleDrawer: () => void;
  navSlot?: React.ReactNode;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
  workspaceMemberships: CurrentUserWorkspaceMemberships;
};

export type StandardLayoutProviderProps = {
  children: React.ReactNode;
  workspaceSlug: string;
  navSlot?: React.ReactNode;
};

export const StandardLayoutContext = createContext<StandardLayoutContext>(
  {} as StandardLayoutContext
);
export const useStandardLayout = () => useContext(StandardLayoutContext);

export function StandardLayoutProvider({
  children,
  workspaceSlug,
  navSlot,
  workspaceDirectory,
  workspaceMemberships,
}: {
  workspaceMemberships: CurrentUserWorkspaceMemberships;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
} & StandardLayoutProviderProps) {
  const params = useParams<{
    pId?: string;
  }>();
  /**
   * This array can be used to determine if the current page has a drawer. We
   * define it at the root (instead of at a Leaf node), so that we can
   * immeditately render the initial drawer state. Otherwise, the drawer
   * animates in after a delay when the client component loads, which looks
   * weird.
   */
  const hasDrawer = [Boolean(params.pId)].some(Boolean);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [showNav, setShowNav] = useState(!hasDrawer);
  const [showDrawer, setShowDrawer] = useState(hasDrawer);

  useEffect(() => {
    setShowNav(!hasDrawer);
    setShowDrawer(hasDrawer);
  }, [pathname]);

  return (
    <StandardLayoutContext.Provider
      value={{
        drawerRef,
        navSlot,
        toggleNav: () => {
          if (!showNav && showDrawer) {
            setShowDrawer(false);
          }
          if (showNav) {
            setShowDrawer(true);
          }
          setShowNav(!showNav);
        },
        showNav,
        toggleDrawer: () => {
          if (!showDrawer && showNav) {
            setShowNav(false);
          }
          setShowDrawer(!showDrawer);
        },
        showDrawer,
        workspaceDirectory,
        workspaceMemberships,
        workspaceSlug,
      }}
    >
      <div
        className={cn(
          "flex flex-1 overflow-hidden transition-all",
          !showNav && "ml-[-300px]",
          !showDrawer && hasDrawer && "mr-[-300px]"
        )}
      >
        {children}

        {hasDrawer ? (
          <div
            className="flex flex-col w-[300px] flex-shrink-0 pb-2 border-l"
            ref={drawerRef}
          ></div>
        ) : null}
      </div>
    </StandardLayoutContext.Provider>
  );
}
