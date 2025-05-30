import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";
import bbox from "@turf/bbox";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

type LineFeature = GeoJSON.Feature<
  GeoJSON.LineString,
  GeoJSON.GeoJsonProperties
>;

function LineInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "line" }>>;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [coordinates, setCoordinates] = useState(
    form.getValues().value?.coordinates,
  );

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
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
    if (coordinates) {
      const line: LineFeature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates,
        },
      };

      const bounds = bbox(line);

      map.fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        {
          padding: 20,
          animate: false,
        },
      );

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
      <div className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}

export default LineInput;
