import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";
import { Button } from "@mapform/ui/components/button";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

function PointInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "point" }>>;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center] = useState<[number, number]>([
    form.getValues().value?.x || 0,
    form.getValues().value?.y || 0,
  ]);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const updatePoint = (lngLat: mapboxgl.LngLat) => {
    form.setValue("value", {
      x: lngLat.lng,
      y: lngLat.lat,
    });
  };

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    map.current = new mapboxgl.Map({
      center: {
        lng: form.getValues().value?.x || 0,
        lat: form.getValues().value?.y || 0,
      },
      zoom: form.getValues().value ? 9 : 0,
      container: mapContainerRef.current ?? "",
      pitchWithRotate: false,
      dragRotate: false,
      doubleClickZoom: false,
      scrollZoom: {
        around: "center",
      },
    });

    // Create marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: "#f59e0b",
    })
      .setLngLat([
        form.getValues().value?.x || 0,
        form.getValues().value?.y || 0,
      ])
      .addTo(map.current);

    // Handle marker drag end
    marker.current.on("dragend", () => {
      if (marker.current) {
        updatePoint(marker.current.getLngLat());
      }
    });

    // Handle map click
    map.current.on("click", (e) => {
      if (marker.current) {
        marker.current.setLngLat(e.lngLat);
        updatePoint(e.lngLat);
      }
    });

    // Handle double click zoom
    map.current.on("dblclick", () => {
      map.current?.doubleClickZoom.disable();
      map.current?.zoomTo((map.current.getZoom() || 0) + 1, {
        duration: 0,
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [form]);

  const handleReset = () => {
    if (map.current && marker.current) {
      marker.current.setLngLat([center[0], center[1]]);
      updatePoint(new mapboxgl.LngLat(center[0], center[1]));
      map.current.flyTo({
        center: [center[0], center[1]],
        zoom: 9,
        duration: 0,
      });
    }
  };

  return (
    <div className="relative size-[500px]">
      <div className="absolute left-2 right-2 top-2 z-10 rounded bg-white/70 px-4 py-2 font-mono text-xs backdrop-blur-md">
        Lng:{" "}
        {marker.current?.getLngLat().lng.toFixed(4) || center[0].toFixed(4)} |
        Lat:{" "}
        {marker.current?.getLngLat().lat.toFixed(4) || center[1].toFixed(4)}
      </div>
      <div className="h-full w-full" ref={mapContainerRef} />
      <div className="pointer-events-auto absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 transform items-center gap-1 rounded-xl border bg-white p-1.5 shadow-lg">
        <Button onClick={handleReset} variant="ghost">
          Reset
        </Button>
      </div>
    </div>
  );
}

export default PointInput;
