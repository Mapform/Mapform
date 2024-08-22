/* eslint-disable import/no-named-as-default-member -- It's cool yo */
import { useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { ViewState } from "@mapform/map-utils/types";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  editable?: boolean;
  viewState: ViewState;
  setViewState: Dispatch<SetStateAction<ViewState | null>>;
}

export function Map({ viewState, setViewState, editable = false }: MapProps) {
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
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        pitch: viewState.pitch,
        bearing: viewState.bearing,
        maxZoom: 20,
      });

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Update the map state when the viewState changes
      map.on("move", () => {
        const { lng, lat } = map.getCenter();
        const zoom = map.getZoom();
        const bearing = map.getBearing();
        const pitch = map.getPitch();

        setViewState({
          longitude: lng,
          latitude: lat,
          zoom,
          bearing,
          pitch,
          padding: viewState.padding,
        });
      });

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
