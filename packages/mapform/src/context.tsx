"use client";

import {
  useState,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type mapboxgl from "mapbox-gl";
import { useMeasure } from "@mapform/lib/hooks/use-measure";

export type MBMap = mapboxgl.Map;
export interface ActivePoint {
  id: string;
  color: string;
  title: string;
  description?: string;
}

interface MapformProviderContextProps {
  map?: MBMap;
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  mapContainer: React.RefObject<HTMLDivElement | null>;
  mapContainerBounds: DOMRectReadOnly | undefined;
}

export const MapformProviderContext =
  createContext<MapformProviderContextProps>({} as MapformProviderContextProps);
export const useMapform = () => useContext(MapformProviderContext);

export function MapformProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<MBMap>();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { ref: mapContainer, bounds } = useMeasure<HTMLDivElement>();

  console.log("mapContainerBounds", mapContainer, bounds);

  const mapContainerBounds = bounds;

  return (
    <MapformProviderContext.Provider
      value={{
        map,
        setMap,
        drawerOpen,
        setDrawerOpen,
        mapContainer,
        mapContainerBounds,
      }}
    >
      {children}
    </MapformProviderContext.Provider>
  );
}
