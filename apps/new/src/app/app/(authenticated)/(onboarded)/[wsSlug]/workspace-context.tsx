"use client";

import { createContext, useContext } from "react";
import type { GetUserWorkspaceMemberships } from "@mapform/backend/data/workspace-memberships/get-user-workspace-memberships";
import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { SidebarProvider } from "@mapform/ui/components/sidebar";

export interface WorkspaceContextInterface {
  workspaceSlug: string;
  workspaceDirectory: NonNullable<WorkspaceDirectory["data"]>;
  workspaceMemberships: NonNullable<GetUserWorkspaceMemberships["data"]>;
  currentWorkspace:
    | NonNullable<GetUserWorkspaceMemberships["data"]>[number]
    | undefined;
}

export interface WorkspaceProviderProps {
  children: React.ReactNode;
  workspaceSlug: string;
}

export const WorkspaceContext = createContext<WorkspaceContextInterface>(
  {} as WorkspaceContextInterface,
);
export const useWorkspace = () => useContext(WorkspaceContext);

export function WorkspaceProvider({
  children,
  workspaceSlug,
  workspaceDirectory,
  workspaceMemberships,
  defaultLeftOpen,
}: {
  defaultLeftOpen?: boolean;
  workspaceMemberships: NonNullable<GetUserWorkspaceMemberships["data"]>;
  workspaceDirectory: NonNullable<WorkspaceDirectory["data"]>;
} & WorkspaceProviderProps) {
  const currentWorkspace = workspaceMemberships.find(
    (membership) => membership.workspace.slug === workspaceSlug,
  );

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceDirectory,
        workspaceMemberships,
        workspaceSlug,
        currentWorkspace,
      }}
    >
      <SidebarProvider defaultOpen={defaultLeftOpen}>
        {children}
      </SidebarProvider>
    </WorkspaceContext.Provider>
  );
}
