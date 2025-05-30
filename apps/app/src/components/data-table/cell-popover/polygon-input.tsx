import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

type XY = { x: number; y: number };

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

  console.log(123, coordinates);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      // center: {
      //   lng: coordinates?.[0]?.[0] || 0,
      //   lat: coordinates?.[0]?.[1] || 0,
      // },
      zoom: coordinates ? 9 : 0,
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
