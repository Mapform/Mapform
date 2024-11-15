"use client";

import { cn } from "@mapform/lib/classnames";
import { useParams, usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { CurrentUserWorkspaceMemberships } from "@mapform/backend/workspace-memberships/get-current-user-workspace-memberships";
import type { WorkspaceWithTeamspaces } from "@mapform/backend/workspaces/get-workspace-directory";

export interface RootLayoutContextInterface {
  drawerRef: React.RefObject<HTMLDivElement | null>;
  workspaceSlug: string;
  showNav: boolean;
  toggleNav: () => void;
  showDrawer: boolean;
  toggleDrawer: () => void;
  navSlot?: React.ReactNode;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
  workspaceMemberships: CurrentUserWorkspaceMemberships;
}

export interface RootLayoutProviderProps {
  children: React.ReactNode;
  workspaceSlug: string;
  navSlot?: React.ReactNode;
}

export const RootLayoutContext = createContext<RootLayoutContextInterface>(
  {} as RootLayoutContextInterface,
);
export const useRootLayout = () => useContext(RootLayoutContext);

export function RootLayoutProvider({
  children,
  workspaceSlug,
  navSlot,
  workspaceDirectory,
  workspaceMemberships,
}: {
  workspaceMemberships: CurrentUserWorkspaceMemberships;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
} & RootLayoutProviderProps) {
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
  }, [hasDrawer, pathname]);

  return (
    <RootLayoutContext.Provider
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
          !showDrawer && hasDrawer && "mr-[-300px]",
        )}
      >
        {children}

        {hasDrawer ? (
          <div
            className="flex w-[300px] flex-shrink-0 flex-col border-l pb-2"
            ref={drawerRef}
          />
        ) : null}
      </div>
    </RootLayoutContext.Provider>
  );
}
