"use client";

import {
  useState,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { ViewState } from "@mapform/map-utils/types";
import type mapboxgl from "mapbox-gl";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { ChevronsRightIcon } from "lucide-react";

import { Map } from "./map";
import { useWindowSize } from "@mapform/lib/hooks/use-window-size";

export type MBMap = mapboxgl.Map;
export interface ActivePoint {
  id: string;
  color: string;
  title: string;
  description?: string;
}

interface MapformProps {
  children: React.ReactNode;
}

interface MapformContextProps {
  map?: MBMap;
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  mapContainerBounds: DOMRectReadOnly | undefined;
}

export const MapformContext = createContext<MapformContextProps>(
  {} as MapformContextProps,
);
export const useMapform = () => useContext(MapformContext);

export function Mapform({ children }: MapformProps) {
  const [map, setMap] = useState<MBMap>();
  const { ref: mapContainer, bounds } = useMeasure<HTMLDivElement>();

  const mapContainerBounds = bounds;

  return (
    <MapformContext.Provider
      value={{
        map,
        setMap,
        mapContainer,
        mapContainerBounds,
      }}
    >
      {children}
    </MapformContext.Provider>
  );
}

interface MapformContainerProps {
  children: React.ReactNode;
  drawerValues: string[] | null;
  onDrawerValuesChange: (values: string[]) => void;
  isEditing?: boolean;
}

interface MapformContainerContextProps {
  drawerValues: string[] | null;
  onDrawerValuesChange: (values: string[]) => void;
  isEditing?: boolean;
}

export const MapformContainerContext =
  createContext<MapformContainerContextProps>(
    {} as MapformContainerContextProps,
  );
export const useMapformContainer = () => useContext(MapformContainerContext);

export function MapformContainer({
  children,
  isEditing,
  drawerValues,
  onDrawerValuesChange,
}: MapformContainerProps) {
  return (
    <MapformContainerContext.Provider
      value={{ isEditing, drawerValues, onDrawerValuesChange }}
    >
      <div className="relative flex-1 md:flex md:overflow-hidden">
        {children}
        <Button
          className={cn(
            "absolute left-2 top-2 z-10 shadow-sm transition-opacity delay-300 duration-300 max-md:hidden",
            {
              // "opacity-0": drawerOpen,
            },
          )}
          onClick={() => {
            // setDrawerOpen(true);
          }}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <ChevronsRightIcon className="size-5" />
        </Button>
      </div>
    </MapformContainerContext.Provider>
  );
}

export function MapformMap({
  children,
  initialViewState,
}: {
  children?: React.ReactNode;
  initialViewState: ViewState;
}) {
  const { width } = useWindowSize();
  const { drawerValues, isEditing } = useMapformContainer();
  const isMobile = !!width && width < 768;

  const mapPadding = {
    top: 0,
    bottom: isMobile ? 200 : 0,
    left: !!drawerValues && !isMobile ? (isEditing ? 392 : 360) : 0,
    right: 0,
  };

  return (
    <div className="top-0 flex flex-1 max-md:sticky max-md:mb-[-200px] max-md:h-dvh">
      <Map
        isEditing={isEditing}
        initialViewState={initialViewState}
        isMobile={isMobile}
        mapPadding={mapPadding}
        // onLoad={onLoad}
        // pageData={pageData}
      >
        {children}
      </Map>
    </div>
  );
}
