"use client";

import { cn } from "@mapform/lib/classnames";
import { useParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import type { CurrentUserWorkspaceMemberships } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import type { WorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-directory";

export type StandardLayoutContext = {
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
  const [showNav, setShowNav] = useState(params.pId ? false : true);
  const [showDrawer, setShowDrawer] = useState(Boolean(params.pId));

  return (
    <StandardLayoutContext.Provider
      value={{
        navSlot,
        setShowNav,
        showNav,
        setShowDrawer,
        showDrawer,
        workspaceDirectory,
        workspaceMemberships,
        workspaceSlug,
      }}
    >
      <div
        className={cn(
          "flex flex-1 overflow-hidden transition-all",
          !showNav && showDrawer && "ml-[-300px] mr-0",
          !showNav && !showDrawer && "ml-[-300px]"
          // !showNav ? "ml-[-300px]" : drawer ? "mr-[-300px]" : "mr-0"
          // Boolean(drawer) && showDrawer && "mr-[-300px]"
        )}
      >
        {children}
      </div>
    </StandardLayoutContext.Provider>
  );
}
