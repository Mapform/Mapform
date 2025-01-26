import type mapboxgl from "mapbox-gl";
import { Marker } from "mapbox-gl";
import { useEffect, useMemo } from "react";
import * as Portal from "@radix-ui/react-portal";
import { useMapform } from "../context";

interface LocationMarkerProps {
  longitude: number;
  latitude: number;
  markerOptions?: mapboxgl.MarkerOptions;
  children: React.ReactNode;
}

export function LocationMarker(props: LocationMarkerProps) {
  const { map } = useMapform();

  if (!map) {
    return null;
  }

  return <LocationMarkerWithMap {...props} map={map} />;
}

/**
 * Update searchLocationMarker marker
 */
export function LocationMarkerWithMap({
  longitude,
  latitude,
  markerOptions,
  children,
  map,
}: LocationMarkerProps & { map: mapboxgl.Map }) {
  const marker = useMemo(() => {
    const el = document.createElement("div");
    const mk = new Marker(el, markerOptions).setLngLat([longitude, latitude]);

    return mk;
  }, [markerOptions, latitude, longitude]);

  useEffect(() => {
    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, []);

  return <Portal.Root container={marker.getElement()}>{children}</Portal.Root>;
}
