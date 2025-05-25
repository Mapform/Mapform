import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

type XY = { x: number; y: number };

type LineFeature = GeoJSON.Feature<
  GeoJSON.LineString,
  GeoJSON.GeoJsonProperties
>;

function toXYArray(coords: unknown): XY[] {
  if (Array.isArray(coords) && coords.length > 0 && Array.isArray(coords[0])) {
    // [ [x, y], ... ]
    return (coords as [number, number][]).map(([x, y]) => ({ x, y }));
  }
  if (
    Array.isArray(coords) &&
    coords.length > 0 &&
    typeof coords[0] === "object" &&
    "x" in coords[0] &&
    "y" in coords[0]
  ) {
    return coords as XY[];
  }
  return [];
}

function LineInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "line" }>>;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [coordinates, setCoordinates] = useState<XY[]>(
    toXYArray(form.getValues().value?.coordinates),
  );

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      center: {
        lng: coordinates[0]?.x || 0,
        lat: coordinates[0]?.y || 0,
      },
      zoom: coordinates.length > 0 ? 9 : 0,
      container: mapContainerRef.current ?? "",
      pitchWithRotate: false,
      dragRotate: false,
      doubleClickZoom: false,
      scrollZoom: {
        around: "center",
      },
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
    });

    map.addControl(draw);

    // Initialize with existing line if any
    if (coordinates.length > 0) {
      const line: LineFeature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates.map((coord) => [coord.x, coord.y]),
        },
      };
      draw.add(line);
    }

    map.on("draw.create", () => {
      const features = draw.getAll();
      const line = features.features[0];
      if (line?.geometry.type === "LineString") {
        const coords = (line.geometry.coordinates as [number, number][]).map(
          ([x, y]) => ({ x, y }),
        );
        setCoordinates(coords);
        form.setValue("value", {
          coordinates: coords.map(({ x, y }) => [x, y] as [number, number]),
        });
      }
    });

    map.on("draw.update", () => {
      const features = draw.getAll();
      const line = features.features[0];
      if (line?.geometry.type === "LineString") {
        const coords = (line.geometry.coordinates as [number, number][]).map(
          ([x, y]) => ({ x, y }),
        );
        setCoordinates(coords);
        form.setValue("value", {
          coordinates: coords.map(({ x, y }) => [x, y] as [number, number]),
        });
      }
    });

    map.on("draw.delete", () => {
      setCoordinates([]);
      form.setValue("value", { coordinates: [] });
    });

    return () => {
      map.remove();
    };
  }, [form]);

  return (
    <div className="relative h-[280px] w-full">
      <div className="absolute left-2 right-2 top-2 z-10 rounded bg-white/70 px-4 py-2 font-mono text-xs backdrop-blur-md">
        {coordinates.length > 0 ? (
          <div>
            <div>Line Points: {coordinates.length}</div>
            <div>
              Start: {coordinates[0]?.x.toFixed(4)},{" "}
              {coordinates[0]?.y.toFixed(4)}
            </div>
            <div>
              End: {coordinates[coordinates.length - 1]?.x.toFixed(4)},{" "}
              {coordinates[coordinates.length - 1]?.y.toFixed(4)}
            </div>
          </div>
        ) : (
          "Click to start drawing a line"
        )}
      </div>
      <div className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}

export default LineInput;
