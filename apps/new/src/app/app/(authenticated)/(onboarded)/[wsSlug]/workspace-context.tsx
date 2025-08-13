"use client";

import React, {
  createContext,
  useContext,
  useOptimistic,
  startTransition,
  useState,
  useCallback,
} from "react";
import type { GetUserWorkspaceMemberships } from "@mapform/backend/data/workspace-memberships/get-user-workspace-memberships";
import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { SidebarProvider } from "@mapform/ui/components/sidebar";
import Map, { NavigationControl } from "react-map-gl/mapbox";
import { env } from "~/*";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  POINTS_LAYER_ID,
  POINTS_SYMBOLS_LAYER_ID,
  LINES_LAYER_ID,
  POLYGONS_FILL_LAYER_ID,
  POLYGONS_OUTLINE_LAYER_ID,
} from "~/lib/map/constants";
import { MapContextMenu } from "./map-context-menu";
import { useParamsContext } from "~/lib/params/client";

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
  const [contextMenu, setContextMenu] = useState<{
    longitude: number;
    latitude: number;
    x: number;
    y: number;
  } | null>(null);
  const { setQueryStates } = useParamsContext();
  const [cursor, setCursor] = useState<string>("grab");
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

  const handleContextMenu = (event: mapboxgl.MapMouseEvent) => {
    event.preventDefault(); // Prevent the browser's default context menu
    setContextMenu({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      x: event.point.x,
      y: event.point.y,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleClick = (
    event: mapboxgl.MapMouseEvent & {
      features?: { properties: { id: string } }[];
    },
  ) => {
    // Access clicked features from event.features
    if (event.features && event.features.length > 0) {
      const clickedFeature = event.features[0]; // Or iterate through all features
      if (clickedFeature?.properties.id) {
        void setQueryStates({ rowId: clickedFeature.properties.id });
      }
    }
  };

  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("grab"), []);

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
        initialViewState={{
          zoom: 2,
        }}
        cursor={cursor}
        minZoom={2}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        interactiveLayerIds={[
          POINTS_LAYER_ID,
          POINTS_SYMBOLS_LAYER_ID,
          LINES_LAYER_ID,
          POLYGONS_FILL_LAYER_ID,
          POLYGONS_OUTLINE_LAYER_ID,
        ]}
      >
        <SidebarProvider defaultOpen={defaultLeftOpen}>
          {children}
        </SidebarProvider>
        <NavigationControl position="top-right" />
        <MapContextMenu
          open={!!contextMenu}
          onOpenChange={handleCloseContextMenu}
          position={contextMenu ?? { x: 0, y: 0, longitude: 0, latitude: 0 }}
        />
      </Map>
    </WorkspaceContext.Provider>
  );
}
