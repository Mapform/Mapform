import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

function PointInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "point" }>>;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState([
    form.getValues().value?.x || 0,
    form.getValues().value?.y || 0,
  ]);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
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

    map.on("dblclick", () => {
      map.doubleClickZoom.disable();
      map.zoomTo(map.getZoom() + 1, {
        duration: 300,
      });
    });

    map.on("move", () => {
      const mapCenter = map.getCenter();
      setCenter([mapCenter.lng, mapCenter.lat]);
      form.setValue("value", {
        x: mapCenter.lng,
        y: mapCenter.lat,
      });
    });

    return () => {
      map.remove();
    };
  }, [form]);

  return (
    <div className="relative h-[280px] w-full">
      <div className="absolute left-2 right-2 top-2 z-10 rounded bg-white/70 px-4 py-2 font-mono text-xs backdrop-blur-md">
        Lng: {center[0]?.toFixed(4)} | Lat: {center[1]?.toFixed(4)}
      </div>
      <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex size-3 -translate-x-1/2 -translate-y-1/2 transform">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex size-3 rounded-full bg-red-500" />
      </span>
      <div className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}

export default PointInput;
