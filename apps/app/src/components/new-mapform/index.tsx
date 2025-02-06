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
  drawerValues: string[] | null;
  onDrawerValuesChange: (values: string[]) => void;
  isEditing: boolean;
}

interface MapformProviderContextProps {
  map?: MBMap;
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  mapContainerBounds: DOMRectReadOnly | undefined;
  drawerValues: string[] | null;
  onDrawerValuesChange: (values: string[]) => void;
  isEditing: boolean;
}

export const MapformProviderContext =
  createContext<MapformProviderContextProps>({} as MapformProviderContextProps);
export const useMapform = () => useContext(MapformProviderContext);

export function Mapform({
  children,
  drawerValues,
  onDrawerValuesChange,
  isEditing,
}: MapformProps) {
  const [map, setMap] = useState<MBMap>();
  const { ref: mapContainer, bounds } = useMeasure<HTMLDivElement>();

  const mapContainerBounds = bounds;

  return (
    <MapformProviderContext.Provider
      value={{
        map,
        setMap,
        mapContainer,
        mapContainerBounds,
        drawerValues,
        onDrawerValuesChange,
        isEditing,
      }}
    >
      {children}
    </MapformProviderContext.Provider>
  );
}

export function MapformContainer({ children }: { children: React.ReactNode }) {
  return (
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
  );
}

export function MapformMap({
  children,
  initialViewState,
}: {
  children: React.ReactNode;
  initialViewState: ViewState;
}) {
  const { width } = useWindowSize();
  const { drawerValues, isEditing } = useMapform();
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
