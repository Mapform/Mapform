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
  onDragEnd?: (lngLat: mapboxgl.LngLat) => void;
}

export function LocationMarker({
  longitude,
  latitude,
  markerOptions,
  children,
  map,
  onDragEnd,
}: LocationMarkerProps & { map: mapboxgl.Map }) {
  const marker = useMemo(() => {
    const el = document.createElement("div");
    el.style.zIndex = "20";

    const mk = new Marker(el, markerOptions).setLngLat([longitude, latitude]);

    return mk;
  }, [latitude, longitude]); // Do not pass markerOptions here because it will cause the marker to be recreated on every render

  useEffect(() => {
    marker.setDraggable(markerOptions?.draggable ?? false);
  }, [marker, markerOptions]);

  useEffect(() => {
    marker.addTo(map);

    function handleDragEnd() {
      const lngLat = marker.getLngLat();
      onDragEnd?.(lngLat);
    }

    marker.on("dragend", handleDragEnd);

    return () => {
      marker.remove();
    };
  }, [map, marker, onDragEnd, markerOptions]);

  return <Portal.Root container={marker.getElement()}>{children}</Portal.Root>;
}
