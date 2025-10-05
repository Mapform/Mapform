"use client";

import React, {
  createContext,
  useContext,
  useOptimistic,
  startTransition,
} from "react";
import type { GetUserWorkspaceMemberships } from "@mapform/backend/data/workspace-memberships/get-user-workspace-memberships";
import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { useParams } from "next/navigation";

export interface WorkspaceContextInterface {
  workspaceSlug: string;
  workspaceMemberships: NonNullable<GetUserWorkspaceMemberships["data"]>;
  workspaceDirectory: NonNullable<WorkspaceDirectory["data"]>;
  updateWorkspaceDirectory: (
    optimisticValue: Partial<NonNullable<WorkspaceDirectory["data"]>>,
  ) => void;
  currentProject:
    | NonNullable<
        WorkspaceDirectory["data"]
      >["teamspaces"][number]["projects"][number]
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
  workspaceDirectory: initialWorkspaceDirectory,
  workspaceMemberships,
}: {
  defaultLeftOpen?: boolean;
  workspaceMemberships: NonNullable<GetUserWorkspaceMemberships["data"]>;
  workspaceDirectory: NonNullable<WorkspaceDirectory["data"]>;
} & WorkspaceProviderProps) {
  const pathParams = useParams<{
    pId?: string;
  }>();

  const [workspaceDirectory, _updateWorkspaceDirectory] = useOptimistic<
    typeof initialWorkspaceDirectory,
    Partial<typeof initialWorkspaceDirectory>
  >(initialWorkspaceDirectory, (workspaceDirectory, optimisticValue) => {
    return {
      ...workspaceDirectory,
      ...optimisticValue,
    };
  });

  const currentProject = workspaceDirectory.teamspaces
    .flatMap((ts) => ts.projects)
    .find((p) => p.id === pathParams.pId);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceMemberships,
        workspaceSlug,
        workspaceDirectory,
        updateWorkspaceDirectory: (optimisticValue) => {
          startTransition(() => {
            _updateWorkspaceDirectory(optimisticValue);
          });
        },
        currentProject,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
