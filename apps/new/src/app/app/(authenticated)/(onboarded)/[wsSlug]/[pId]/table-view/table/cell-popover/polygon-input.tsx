import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";
import { Button } from "@mapform/ui/components/button";
import { Separator } from "@mapform/ui/components/separator";

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
  const [coordinates] = useState<[number, number][][] | undefined>(
    form.getValues("value.coordinates"),
  );
  const draw = useRef<MapboxDraw | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const drawPolygon = (coordinates: [number, number][][] | undefined) => {
    if (!coordinates || coordinates.length === 0) {
      return;
    }

    const polygon: PolygonFeature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates,
      },
    };

    const bounds = bbox(polygon);

    map.current?.fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      {
        padding: 100,
        animate: false,
      },
    );

    const featureIds = draw.current?.add(polygon);
    const featureId = featureIds?.[0];

    if (featureId) {
      draw.current?.changeMode("direct_select", {
        featureId,
      });
    }
  };

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current ?? "",
      pitchWithRotate: false,
      dragRotate: false,
      doubleClickZoom: false,
      scrollZoom: {
        around: "center",
      },
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
    });

    map.current.addControl(draw.current);

    drawPolygon(coordinates);

    map.current.on(
      "draw.create",
      (
        e: mapboxgl.MapMouseEvent & {
          features: mapboxgl.MapboxGeoJSONFeature[];
        },
      ) => {
        // Put cursor back
        if (map.current) {
          map.current.getCanvas().style.cursor = "";
        }

        const feature = e.features[0];

        if (feature?.geometry.type === "Polygon") {
          form.setValue("value", {
            coordinates: feature.geometry.coordinates as [number, number][][],
          });
        }
      },
    );

    map.current.on(
      "draw.update",
      (
        e: mapboxgl.MapMouseEvent & {
          features: mapboxgl.MapboxGeoJSONFeature[];
        },
      ) => {
        const feature = e.features[0];

        if (feature?.geometry.type === "Polygon") {
          form.setValue("value", {
            coordinates: feature.geometry.coordinates as [number, number][][],
          });
        }
      },
    );

    map.current.on("draw.delete", () => {
      form.setValue("value", { coordinates: [] });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // We manually handle calling delete due to issue in MapboxDraw: https://github.com/mapbox/mapbox-gl-draw/issues/989
      if (e.key === "Delete" || e.key === "Backspace") {
        draw.current?.trash();
      }
    };

    const container = mapContainerRef.current;
    container?.addEventListener("keydown", handleKeyDown);

    return () => {
      container?.removeEventListener("keydown", handleKeyDown);
      map.current?.remove();
    };
  }, [form]);

  const handleNew = () => {
    draw.current?.deleteAll();
    draw.current?.changeMode("draw_polygon");

    if (map.current) {
      map.current.getCanvas().style.cursor = "crosshair";
    }
  };

  const handleReset = () => {
    draw.current?.deleteAll();
    drawPolygon(coordinates);
    form.setValue("value", {
      coordinates: coordinates ? coordinates : [],
    });
  };

  return (
    <div className="relative size-[500px]">
      <div className="h-full w-full" ref={mapContainerRef} />
      <div className="pointer-events-auto absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 transform items-center gap-1 rounded-xl border bg-white p-1.5 shadow-lg">
        <Button onClick={handleNew} variant="ghost">
          New
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <Button onClick={handleReset} variant="ghost">
          Reset
        </Button>
      </div>
    </div>
  );
}

export default PolygonInput;
