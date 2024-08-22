/* eslint-disable import/no-named-as-default-member -- It's cool yo */
import { useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { ViewState } from "@mapform/map-utils/types";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  editable?: boolean;
  initialViewState: ViewState;
  setViewState: Dispatch<SetStateAction<ViewState | null>>;
}

/**
 * TODO:
 * 1. Create a context provider
 * 2. Set the map state in the context provider
 * 3. Can use the map anywhere to allow for flying / panning to location
 * 4. Add overlays accoriding to https://github.com/mapbox/mapbox-react-examples/blob/master/data-overlay/src/Map.js
 */
export function Map({ initialViewState, editable = false }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    mapboxgl.accessToken = accessToken;

    if (mapContainer.current) {
      // Create map with initial state
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        pitch: initialViewState.pitch,
        bearing: initialViewState.bearing,
        maxZoom: 20,
      });

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add your custom markers and lines here

      // Clean up on unmount
      return () => {
        map.remove();
      };
    }
  }, []);

  return (
    <div
      className={cn("flex-1", {
        "rounded-md": editable,
      })}
      ref={mapContainer}
    />
  );
}
