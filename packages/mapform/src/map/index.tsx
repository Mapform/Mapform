"use client";

import type { CustomBlock } from "@mapform/blocknote";
import { useEffect, useState } from "react";
import type { Page } from "@mapform/db/schema";
import { useMapForm } from "../context";
import { Mapbox } from "./mapbox";
import { EditBar } from "./edit-bar";

export function MapFormMap() {
  const { currentPage } = useMapForm();

  if (!currentPage) {
    return null;
  }

  return <MapFormMapInner currentPage={currentPage} />;
}

export function MapFormMapInner({ currentPage }: { currentPage: Page }) {
  const { isProduction, onLocationSave, onLoad } = useMapForm();
  const [movedCoords, setMovedCoords] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    pitch: number;
    bearing: number;
  }>({
    lat: currentPage.center.y,
    lng: currentPage.center.x,
    zoom: currentPage.zoom,
    pitch: currentPage.pitch,
    bearing: currentPage.bearing,
  });
  const [searchLocation, setSearchLocation] = useState<{
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    description?: {
      content: CustomBlock[];
    };
  } | null>(null);

  const roundLocation = (num: number) => Math.round(num * 1000000) / 1000000;

  const hasMoved =
    roundLocation(movedCoords.lat) !== roundLocation(currentPage.center.y) ||
    roundLocation(movedCoords.lng) !== roundLocation(currentPage.center.x) ||
    movedCoords.zoom !== currentPage.zoom ||
    movedCoords.pitch !== currentPage.pitch ||
    movedCoords.bearing !== currentPage.bearing;

  const initialViewState = {
    latitude: currentPage.center.y,
    longitude: currentPage.center.x,
    zoom: currentPage.zoom,
    pitch: currentPage.pitch,
    bearing: currentPage.bearing,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  };

  useEffect(() => {
    setMovedCoords({
      lat: currentPage.center.y,
      lng: currentPage.center.x,
      zoom: currentPage.zoom,
      pitch: currentPage.pitch,
      bearing: currentPage.bearing,
    });
  }, [currentPage]);

  if (currentPage.contentViewType === "text") {
    return null;
  }

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <Mapbox
        initialViewState={initialViewState}
        isProduction={isProduction}
        marker={
          searchLocation
            ? {
                latitude: searchLocation.latitude,
                longitude: searchLocation.longitude,
              }
            : undefined
        }
        onLoad={onLoad}
        points={[]}
      />

      {/* Edit bar */}
      {!isProduction ? (
        <div
          className="flex items-center bg-primary rounded-lg px-2 py-0 absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          style={{
            left:
              currentPage.contentViewType === "split"
                ? "calc(50% + 180px)"
                : "50%",
          }}
        >
          <EditBar
            hasMoved={hasMoved}
            initialViewState={initialViewState}
            onLocationSave={onLocationSave}
            setSearchLocation={setSearchLocation}
          />
        </div>
      ) : null}
    </div>
  );
}
