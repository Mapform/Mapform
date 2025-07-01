"use client";

import React, { createContext, useContext, useOptimistic } from "react";
import type { GetUserWorkspaceMemberships } from "@mapform/backend/data/workspace-memberships/get-user-workspace-memberships";
import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { SidebarProvider } from "@mapform/ui/components/sidebar";

export interface WorkspaceContextInterface {
  workspaceSlug: string;
  workspaceDirectory: NonNullable<WorkspaceDirectory["data"]>;
  workspaceMemberships: NonNullable<GetUserWorkspaceMemberships["data"]>;
  optimisticWorkspace:
    | NonNullable<GetUserWorkspaceMemberships["data"]>[number]["workspace"]
    | undefined;
  updateOptimisticWorkspace: (
    optimisticValue: Partial<
      NonNullable<GetUserWorkspaceMemberships["data"]>[number]
    >,
  ) => void;
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

  if (!currentWorkspace) {
    throw new Error("Current workspace not found");
  }

  const [optimisticWorkspace, updateOptimisticWorkspace] = useOptimistic<
    (typeof currentWorkspace)["workspace"],
    Partial<typeof currentWorkspace>
  >(currentWorkspace.workspace, (workspace, optimisticValue) => {
    return {
      ...workspace,
      ...optimisticValue,
    };
  });

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceDirectory,
        workspaceMemberships,
        workspaceSlug,
        optimisticWorkspace,
        updateOptimisticWorkspace,
      }}
    >
      <SidebarProvider defaultOpen={defaultLeftOpen}>
        {children}
      </SidebarProvider>
    </WorkspaceContext.Provider>
  );
}
