"use client";

import { cn } from "@mapform/lib/classnames";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import type { CurrentUserWorkspaceMemberships } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import type { WorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-directory";

type PathLink = {
  name: string;
  href: string;
};

export type StandardLayoutContext = {
  workspaceSlug: string;
  drawerContent?: React.ReactNode;
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
  navSlot?: React.ReactNode;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
  workspaceMemberships: CurrentUserWorkspaceMemberships;
};

export type StandardLayoutProviderProps = {
  children: React.ReactNode;
  workspaceSlug: string;
  drawerContent?: React.ReactNode;
  initialShowNav?: boolean;
  navSlot?: React.ReactNode;
};

export const StandardLayoutContext = createContext<StandardLayoutContext>(
  {} as StandardLayoutContext
);
export const useStandardLayout = () => useContext(StandardLayoutContext);

export function StandardLayoutProvider({
  children,
  workspaceSlug,
  drawerContent,
  navSlot,
  initialShowNav = true,
  workspaceDirectory,
  workspaceMemberships,
}: {
  workspaceMemberships: CurrentUserWorkspaceMemberships;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
} & StandardLayoutProviderProps) {
  const [showNav, setShowNav] = useState(initialShowNav);

  return (
    <StandardLayoutContext.Provider
      value={{
        workspaceSlug,
        setShowNav,
        showNav,
        navSlot,
        workspaceDirectory,
        workspaceMemberships,
      }}
    >
      <div
        className={cn(
          "flex flex-1 overflow-hidden transition-all",
          !showNav ? "ml-[-300px]" : drawerContent ? "mr-[-300px]" : "mr-0"
        )}
      >
        {children}
      </div>
    </StandardLayoutContext.Provider>
  );
}
