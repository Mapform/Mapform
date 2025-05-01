import { LayerSavePopover } from "../layer-save-popover";
import { SearchPopover } from "./search-popover";
import { Button } from "@mapform/ui/components/button";
import { BookmarkIcon } from "lucide-react";
import { createPolygonAction } from "~/data/datasets/create-polygon";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { createLineAction } from "~/data/datasets/create-line";
import type { Layer } from "@mapform/db/schema";
import { createPointAction } from "~/data/datasets/create-point";

interface LineToolPopoverProps {
  location: mapboxgl.LngLat;
  isFetching: boolean;
  feature: mapboxgl.MapboxGeoJSONFeature;
  onSave: () => void;
}

export function FeaturePopover({
  location,
  feature,
  isFetching,
  onSave,
}: LineToolPopoverProps) {
  const [isLayerSaveOpen, setIsLayerSaveOpen] = useState(false);

  const { execute: createPolygon, isPending: isCreatingPolygon } = useAction(
    createPolygonAction,
    {
      onSuccess: () => {
        onSave();
        setIsLayerSaveOpen(false);
      },
    },
  );

  const { execute: createLine, isPending: isCreatingLine } = useAction(
    createLineAction,
    {
      onSuccess: () => {
        onSave();
        setIsLayerSaveOpen(false);
      },
    },
  );

  const { execute: createPoint, isPending: isCreatingPoint } = useAction(
    createPointAction,
    {
      onSuccess: () => {
        onSave();
        setIsLayerSaveOpen(false);
      },
    },
  );

  const handleLayerSelect = (layerId: string) => {
    if (feature.geometry.type === "Polygon") {
      createPolygon({
        layerId,
        value: {
          coordinates: feature.geometry.coordinates as [number, number][][],
        },
      });
    }

    if (feature.geometry.type === "LineString") {
      createLine({
        layerId,
        value: {
          coordinates: feature.geometry.coordinates as [number, number][],
        },
      });
    }

    if (
      feature.geometry.type === "Point" &&
      feature.geometry.coordinates[0] &&
      feature.geometry.coordinates[1]
    ) {
      createPoint({
        layerId,
        location: {
          x: feature.geometry.coordinates[0],
          y: feature.geometry.coordinates[1],
        },
      });
    }
  };

  const types = useMemo<Layer["type"][]>(() => {
    if (feature.geometry.type === "Polygon") {
      return ["polygon"];
    }

    if (feature.geometry.type === "LineString") {
      return ["line"];
    }

    return ["point", "marker"];
  }, [feature.geometry.type]);

  return (
    <SearchPopover
      location={location}
      title="New Feature"
      isPending={isFetching}
    >
      <LayerSavePopover
        types={types}
        onSelect={handleLayerSelect}
        isPending={isCreatingPolygon || isCreatingLine || isCreatingPoint}
        open={isLayerSaveOpen}
        onOpenChange={setIsLayerSaveOpen}
      >
        <Button className="w-full" role="combobox" size="sm" variant="outline">
          <BookmarkIcon className="mr-1 size-4" />
          Save to
        </Button>
      </LayerSavePopover>
    </SearchPopover>
  );
}
