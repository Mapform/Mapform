"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Map, AttributionControl } from "react-map-gl/maplibre";
import type {
  MapLayerMouseEvent,
  MapLayerTouchEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { env } from "~/*";
import { useWorkspace } from "./workspace-context";
import { useParamsContext } from "~/lib/params/client";
import { useParams, usePathname } from "next/navigation";
import { useIsMobile } from "@mapform/lib/hooks/use-is-mobile";
import MapNavigationControl from "~/components/map-navigation-control";
import { MapContextMenu } from "./map-context-menu";
import { DRAWER_WIDTH, SIDEBAR_WIDTH } from "~/constants/sidebars";
import {
  POINTS_LAYER_ID,
  POINTS_SYMBOLS_LAYER_ID,
  LINES_LAYER_ID,
  POLYGONS_FILL_LAYER_ID,
  POLYGONS_OUTLINE_LAYER_ID,
} from "~/lib/map/constants";

export function WorkspaceMap({ children }: { children: React.ReactNode }) {
  const { currentProject } = useWorkspace();
  const { setQueryStates, params } = useParamsContext();
  const pathParams = useParams<{ pId?: string }>();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const [contextMenu, setContextMenu] = useState<{
    longitude: number;
    latitude: number;
    x: number;
    y: number;
  } | null>(null);

  const [cursor, setCursor] = useState<string>("grab");
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const cancelLongPress = () => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const startLongPress = (
    event: MapLayerMouseEvent | MapLayerTouchEvent,
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

  const handleContextMenu = (event: MapLayerMouseEvent) => {
    event.preventDefault();
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

  const handleClick = (event: MapLayerMouseEvent) => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    const clickedFeature = event.features?.[0] as
      | { properties?: { id?: string } }
      | undefined;
    const clickedId = clickedFeature?.properties?.id;
    if (clickedId) {
      void setQueryStates({ rowId: String(clickedId) });
    }
  };

  const handleTouchStart = (event: MapLayerTouchEvent) => {
    startLongPress(event);
  };

  const handleMouseDown = (event: MapLayerMouseEvent) => {
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
        isMobile
          ? 0
          : pathname.includes("/settings")
            ? SIDEBAR_WIDTH + DRAWER_WIDTH
            : SIDEBAR_WIDTH,
      top: 0,
      bottom: 0,
      right: 0,
    }),
    [
      isMobile,
      params.chatId,
      params.search,
      params.rowId,
      params.stadiaId,
      params.marker,
      pathParams.pId,
      pathname,
    ],
  );

  const initialViewState = useMemo(() => {
    return {
      zoom: params.zoom ?? currentProject?.zoom ?? 0,
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
    params.zoom,
    params.pitch,
    params.bearing,
  ]);

  const minZoom = useMemo(() => {
    return isMobile ? 0 : 2;
  }, [isMobile]);

  const handleOnLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <Map
      mapStyle={`https://api.maptiler.com/maps/01995d1c-5731-75c6-b896-6004a7af5c7f/style.json?key=${env.NEXT_PUBLIC_MAPTILER_KEY}`}
      key={isMobile ? "mobile" : "desktop"}
      style={{
        width: "100vw",
        height: "100vh",
        opacity: isMapLoaded ? 1 : 0,
        transition: "opacity 300ms ease-in-out",
        willChange: "opacity",
        backgroundImage: `linear-gradient(
          315deg,
          hsl(240deg 50% 3%) 0%,
          hsl(241deg 47% 4%) 8%,
          hsl(242deg 44% 6%) 17%,
          hsl(244deg 41% 7%) 25%,
          hsl(245deg 39% 8%) 33%,
          hsl(244deg 37% 8%) 42%,
          hsl(244deg 37% 9%) 50%,
          hsl(242deg 37% 10%) 58%,
          hsl(241deg 37% 11%) 67%,
          hsl(239deg 38% 12%) 75%,
          hsl(239deg 39% 13%) 83%,
          hsl(239deg 39% 13%) 92%,
          hsl(240deg 40% 14%) 100%
        )`,
      }}
      sky={{
        "sky-color": "#199EF3",
        "sky-horizon-blend": 0.5,
        "horizon-color": "#ffffff",
        "horizon-fog-blend": 0.5,
        "fog-color": "#0000ff",
        "fog-ground-blend": 0.5,
        "atmosphere-blend": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          1,
          10,
          1,
          12,
          0,
        ],
      }}
      projection={isMobile ? "mercator" : "globe"}
      initialViewState={initialViewState}
      attributionControl={false}
      cursor={cursor}
      minZoom={minZoom}
      onLoad={handleOnLoad}
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
      <div className="h-full overflow-y-auto">
        {children}
        <MapNavigationControl />
        <MapContextMenu
          open={!!contextMenu}
          onOpenChange={handleCloseContextMenu}
          position={contextMenu ?? { x: 0, y: 0, longitude: 0, latitude: 0 }}
        />
      </div>
      <AttributionControl position={isMobile ? "top-left" : "bottom-right"} />
    </Map>
  );
}

export default WorkspaceMap;
