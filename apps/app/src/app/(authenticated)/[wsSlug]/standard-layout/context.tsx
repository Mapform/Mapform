"use client";

import { cn } from "@mapform/lib/classnames";
import { useParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import type { CurrentUserWorkspaceMemberships } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import type { WorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-directory";

export type StandardLayoutContext = {
  drawerExists: boolean;
  setDrawerExists: Dispatch<SetStateAction<boolean>>;
  drawerRef: React.RefObject<HTMLDivElement>;
  workspaceSlug: string;
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
  navSlot?: React.ReactNode;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
  workspaceMemberships: CurrentUserWorkspaceMemberships;
};

export type StandardLayoutProviderProps = {
  children: React.ReactNode;
  workspaceSlug: string;
  drawer?: React.ReactNode;
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
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [drawerExists, setDrawerExists] = useState(false);
  const [showNav, setShowNav] = useState(params.pId ? false : true);
  const [showDrawer, setShowDrawer] = useState(true);

  return (
    <StandardLayoutContext.Provider
      value={{
        drawerRef,
        navSlot,
        drawerExists,
        setDrawerExists,
        setShowNav: () => {
          if (!showNav && showDrawer) {
            setShowDrawer(false);
          }
          if (showNav) {
            setShowDrawer(true);
          }
          setShowNav(!showNav);
        },
        showNav,
        setShowDrawer: () => {
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
          !showDrawer && drawerExists && "mr-[-300px]"
        )}
      >
        {children}

        <div id="drawer" ref={drawerRef} />
      </div>
    </StandardLayoutContext.Provider>
  );
}
