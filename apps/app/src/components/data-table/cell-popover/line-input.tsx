import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";
import bbox from "@turf/bbox";
import { Button } from "@mapform/ui/components/button";

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
  const coordinates = form.getValues("value.coordinates");
  const draw = useRef<MapboxDraw | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const drawLine = (coordinates: [number, number][]) => {
    const line: LineFeature = {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    };

    const bounds = bbox(line);

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

    const featureIds = draw.current?.add(line);

    if (featureIds) {
      draw.current?.changeMode("simple_select", {
        featureIds,
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

    drawLine(coordinates);

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

        if (feature?.geometry.type === "LineString") {
          form.setValue("value", {
            coordinates: feature.geometry.coordinates as [number, number][],
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

        if (feature?.geometry.type === "LineString") {
          form.setValue("value", {
            coordinates: feature.geometry.coordinates as [number, number][],
          });
        }
      },
    );

    // map.on("draw.delete", () => {
    //   setCoordinates([]);
    //   form.setValue("value", { coordinates: [] });
    // });

    return () => {
      map.current?.remove();
    };
  }, [form]);

  const handleNew = () => {
    draw.current?.deleteAll();
    draw.current?.changeMode("draw_line_string");

    if (map.current) {
      map.current.getCanvas().style.cursor = "crosshair";
    }
  };

  const handleReset = () => {
    draw.current?.deleteAll();

    drawLine(coordinates);

    form.setValue("value", {
      coordinates,
    });
  };

  return (
    <div className="relative size-[500px]">
      <div className="h-full w-full" ref={mapContainerRef} />
      <div className="pointer-events-auto absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 transform items-center divide-x rounded-xl border bg-white p-1.5 shadow-lg">
        <Button onClick={handleNew}>New</Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
}

export default LineInput;
