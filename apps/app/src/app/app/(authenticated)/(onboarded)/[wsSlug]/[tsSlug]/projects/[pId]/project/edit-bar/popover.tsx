import { LayerSavePopover } from "../layer-save-popover";
import { SearchPopover } from "./search-popover";
import { Button } from "@mapform/ui/components/button";
import { BookmarkIcon } from "lucide-react";
import { createPolygonAction } from "~/data/datasets/create-polygon";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { createLineAction } from "~/data/datasets/create-line";

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
  };

  const types = useMemo<("line" | "marker" | "polygon" | "point")[]>(() => {
    if (feature.geometry.type === "Polygon") {
      return ["polygon"];
    }

    return ["line"];
  }, [feature.geometry.type]);

  return (
    <SearchPopover location={location} title="New Line" isPending={isFetching}>
      <LayerSavePopover
        types={types}
        onSelect={handleLayerSelect}
        isPending={isCreatingPolygon || isCreatingLine}
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
