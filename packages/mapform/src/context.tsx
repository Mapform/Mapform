"use client";

import type mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Dispatch, SetStateAction } from "react";
import React, { createContext, useContext, useState } from "react";
import type { Page } from "@mapform/db/schema";
import type { ViewState } from "@mapform/map-utils/types";
import "./style.css";

export type MBMap = mapboxgl.Map;

export interface MapFormContextProps {
  map?: MBMap;
  onLoad?: () => void;
  isProduction: boolean;
  currentPage: Page | null;
  isSelectingPinLocationFor: string | null;
  setIsSelectingPinLocationFor: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
  setCurrentPage: Dispatch<SetStateAction<Page | null>>;
  onLocationSave?: (location: ViewState) => Promise<{ success: boolean }>;
}

export const MapFormContext = createContext<MapFormContextProps>(
  {} as MapFormContextProps
);
export const useMapForm = () => useContext(MapFormContext);

export function MapForm({
  onLoad,
  children,
  onLocationSave,
  isProduction = false,
}: {
  onLoad?: () => void;
  isProduction?: boolean;
  children: React.ReactNode;
  onLocationSave?: (location: ViewState) => Promise<{ success: boolean }>;
}) {
  const [map, setMap] = useState<MBMap>();
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [isSelectingPinLocationFor, setIsSelectingPinLocationFor] = useState<
    string | null
  >(null);

  // if (!currentPage) {
  //   return children;
  // }

  return (
    <MapFormContext.Provider
      value={{
        map,
        setMap,
        onLoad,
        currentPage,
        isProduction,
        onLocationSave,
        setCurrentPage,
        isSelectingPinLocationFor,
        setIsSelectingPinLocationFor,
      }}
    >
      <div className="relative w-full h-full flex">{children}</div>
    </MapFormContext.Provider>
  );
}
