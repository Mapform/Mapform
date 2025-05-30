import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

type PolygonFeature = GeoJSON.Feature<
  GeoJSON.Polygon,
  GeoJSON.GeoJsonProperties
>;

function PolygonInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "polygon" }>>;
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
        polygon: true,
        trash: true,
      },
    });

    map.addControl(draw);

    // Initialize with existing polygon if any
    if (coordinates) {
      const polygon: PolygonFeature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates,
        },
      };

      const bounds = bbox(polygon);

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

      draw.add(polygon);
    }

    map.on("draw.create", () => {
      const features = draw.getAll();
      const polygon = features.features[0];
      if (polygon?.geometry.type === "Polygon") {
        const coords = polygon.geometry.coordinates[0];
        setCoordinates(coords);
        form.setValue("value", {
          coordinates,
        });
      }
    });

    map.on("draw.update", () => {
      const features = draw.getAll();
      const polygon = features.features[0];
      if (polygon?.geometry.type === "Polygon") {
        const coords = polygon.geometry.coordinates[0] as [number, number][];
        setCoordinates(coords);
        form.setValue("value", {
          coordinates,
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

export default PolygonInput;
