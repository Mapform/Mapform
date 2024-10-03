"use client";

import { cn } from "@mapform/lib/classnames";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { WorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-with-teamspaces";

type PathLink = {
  name: string;
  href: string;
};

export type StandardLayoutContext = {
  currentWorkspaceSlug: string;
  drawerContent?: React.ReactNode;
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
  navSlot?: React.ReactNode;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
};

export type StandardLayoutProviderProps = {
  children: React.ReactNode;
  currentWorkspaceSlug: string;
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
  currentWorkspaceSlug,
  drawerContent,
  navSlot,
  initialShowNav = true,
  workspaceDirectory,
}: {
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
} & StandardLayoutProviderProps) {
  const [showNav, setShowNav] = useState(initialShowNav);

  return (
    <StandardLayoutContext.Provider
      value={{
        currentWorkspaceSlug,
        setShowNav,
        showNav,
        navSlot,
        workspaceDirectory,
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
