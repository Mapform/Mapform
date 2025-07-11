"use client";

import React, {
  createContext,
  useContext,
  useOptimistic,
  startTransition,
} from "react";
import type { GetUserWorkspaceMemberships } from "@mapform/backend/data/workspace-memberships/get-user-workspace-memberships";
import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { SidebarProvider } from "@mapform/ui/components/sidebar";
import Map from "react-map-gl/mapbox";
import { env } from "~/*";
import "mapbox-gl/dist/mapbox-gl.css";

export interface WorkspaceContextInterface {
  workspaceSlug: string;
  workspaceMemberships: NonNullable<GetUserWorkspaceMemberships["data"]>;
  workspaceDirectory: NonNullable<WorkspaceDirectory["data"]>;
  updateWorkspaceDirectory: (
    optimisticValue: Partial<NonNullable<WorkspaceDirectory["data"]>>,
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

const accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function WorkspaceProvider({
  children,
  workspaceSlug,
  workspaceDirectory: initialWorkspaceDirectory,
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

  const [workspaceDirectory, _updateWorkspaceDirectory] = useOptimistic<
    typeof initialWorkspaceDirectory,
    Partial<typeof initialWorkspaceDirectory>
  >(initialWorkspaceDirectory, (workspaceDirectory, optimisticValue) => {
    return {
      ...workspaceDirectory,
      ...optimisticValue,
    };
  });

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
      }}
    >
      <Map
        mapboxAccessToken={accessToken}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/nichaley/cmcyt7kfs005q01qn6vhrga96"
        projection="globe"
        logoPosition="bottom-right"
        padding={{
          top: 0,
          bottom: 0,
          left: 255,
          right: 0,
        }}
        initialViewState={{
          zoom: 2,
        }}
        minZoom={2}
      >
        <SidebarProvider defaultOpen={defaultLeftOpen}>
          {children}
        </SidebarProvider>
      </Map>
    </WorkspaceContext.Provider>
  );
}
