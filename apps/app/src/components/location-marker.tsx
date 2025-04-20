import type mapboxgl from "mapbox-gl";
import { Marker } from "mapbox-gl";
import { useEffect, useMemo } from "react";
import * as Portal from "@radix-ui/react-portal";

interface LocationMarkerProps {
  map: mapboxgl.Map;
  longitude: number;
  latitude: number;
  markerOptions?: mapboxgl.MarkerOptions;
  children: React.ReactNode;
}

export function LocationMarker({
  longitude,
  latitude,
  markerOptions,
  children,
  map,
}: LocationMarkerProps & { map: mapboxgl.Map }) {
  const marker = useMemo(() => {
    const el = document.createElement("div");
    el.style.zIndex = "20";

    const mk = new Marker(el, markerOptions).setLngLat([longitude, latitude]);

    return mk;
  }, [markerOptions, latitude, longitude]);

  useEffect(() => {
    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, marker]);

  return <Portal.Root container={marker.getElement()}>{children}</Portal.Root>;
}
