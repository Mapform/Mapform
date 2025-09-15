"use client";

import React, {
  createContext,
  useContext,
  useOptimistic,
  startTransition,
  useState,
  useCallback,
  useRef,
  useMemo,
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
import { useParams, usePathname } from "next/navigation";
import { DRAWER_WIDTH, SIDEBAR_WIDTH } from "~/constants/sidebars";

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
  const { setQueryStates, params } = useParamsContext();
  const pathParams = useParams<{
    pId?: string;
  }>();
  const pathname = usePathname();
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

  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const cancelLongPress = () => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const startLongPress = (
    event: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent,
    timeoutMs = 500,
  ) => {
    cancelLongPress();
    const { lngLat } = event;
    const longitude = lngLat.lng;
    const latitude = lngLat.lat;

    longPressTimerRef.current = window.setTimeout(async () => {
      await setQueryStates({
        latitude,
        longitude,
      });
      longPressTriggeredRef.current = true;
    }, timeoutMs);
  };

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
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    // Access clicked features from event.features
    if (event.features && event.features.length > 0) {
      const clickedFeature = event.features[0]; // Or iterate through all features
      if (clickedFeature?.properties.id) {
        void setQueryStates({ rowId: clickedFeature.properties.id });
      }
    }
  };

  const handleTouchStart = (event: mapboxgl.MapTouchEvent) => {
    startLongPress(event);
  };

  const handleMouseDown = (event: mapboxgl.MapMouseEvent) => {
    startLongPress(event);
  };

  const handleOnMoveEnd = (event: {
    originalEvent?: unknown;
    viewState: {
      longitude: number;
      latitude: number;
      zoom: number;
      pitch: number;
      bearing: number;
    };
  }) => {
    // Only sync URL for user-initiated interactions, not programmatic easeTo/easeTo
    if (!event.originalEvent) {
      return;
    }
    const { viewState } = event;
    const longitude = viewState.longitude;
    const latitude = viewState.latitude;
    const zoom = viewState.zoom;
    const pitch = viewState.pitch;
    const bearing = viewState.bearing;

    setTimeout(() => {
      void setQueryStates(
        {
          location: `${latitude},${longitude}`,
          zoom,
          pitch,
          bearing,
        },
        {
          shallow: true,
        },
      );
    }, 0);
  };

  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("grab"), []);

  const [latitude, longitude] = params.location?.split(",") ?? [];

  const initialPadding = useMemo(
    () => ({
      left:
        params.chatId ||
        params.search ||
        params.rowId ||
        params.stadiaId ||
        params.marker ||
        pathParams.pId ||
        pathname.includes("/settings")
          ? SIDEBAR_WIDTH + DRAWER_WIDTH
          : SIDEBAR_WIDTH,
      top: 0,
      bottom: 0,
      right: 0,
    }),
    [
      params.chatId,
      params.search,
      params.rowId,
      params.stadiaId,
      params.marker,
      pathParams.pId,
      pathname,
    ],
  );

  const currentProject = workspaceDirectory.teamspaces
    .flatMap((ts) => ts.projects)
    .find((p) => p.id === pathParams.pId);

  const initialViewState = useMemo(() => {
    return {
      zoom: params.zoom ?? currentProject?.zoom ?? 2,
      latitude: latitude
        ? Number(latitude)
        : currentProject?.center.coordinates[1] ?? 0,
      longitude: longitude
        ? Number(longitude)
        : currentProject?.center.coordinates[0] ?? 0,
      pitch: params.pitch ?? currentProject?.pitch ?? 0,
      bearing: params.bearing ?? currentProject?.bearing ?? 0,
      padding: initialPadding,
    };
  }, [
    currentProject,
    latitude,
    longitude,
    initialPadding,
    params.pitch,
    params.bearing,
    params.zoom,
  ]);

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
        initialViewState={initialViewState}
        cursor={cursor}
        minZoom={2}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onMove={cancelLongPress}
        onMoveEnd={handleOnMoveEnd}
        onTouchMove={cancelLongPress}
        onTouchEnd={cancelLongPress}
        onTouchCancel={cancelLongPress}
        onMouseDown={handleMouseDown}
        onMouseUp={cancelLongPress}
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
