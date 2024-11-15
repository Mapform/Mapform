"use client";

import { createContext, useContext } from "react";
import type { CurrentUserWorkspaceMemberships } from "@mapform/backend/workspace-memberships/get-current-user-workspace-memberships";
import type { WorkspaceWithTeamspaces } from "@mapform/backend/workspaces/get-workspace-directory";

export interface WorkspaceContextInterface {
  workspaceSlug: string;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
  workspaceMemberships: CurrentUserWorkspaceMemberships;
  currentWorkspace: CurrentUserWorkspaceMemberships[number] | undefined;
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
}: {
  workspaceMemberships: CurrentUserWorkspaceMemberships;
  workspaceDirectory: NonNullable<WorkspaceWithTeamspaces>;
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
      {children}
    </WorkspaceContext.Provider>
  );
}
