"use client";

import {
  useState,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type mapboxgl from "mapbox-gl";

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
}

export const MapformProviderContext =
  createContext<MapformProviderContextProps>({} as MapformProviderContextProps);
export const useMapform = () => useContext(MapformProviderContext);

export function MapformProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<MBMap>();
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <MapformProviderContext.Provider
      value={{
        map,
        setMap,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </MapformProviderContext.Provider>
  );
}
