import { LayerSavePopover } from "../layer-save-popover";
import { SearchPopover } from "./search-popover";
import { Button } from "@mapform/ui/components/button";
import { BookmarkIcon } from "lucide-react";
import { createPolygonAction } from "~/data/datasets/create-polygon";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import type { Position } from "geojson";

interface LineToolPopoverProps {
  location: mapboxgl.LngLat;
  isFetching: boolean;
  coordinates: Position[][] | Position[] | Position;
  onSave: () => void;
}

export function FeaturePopover({
  location,
  coordinates,
  isFetching,
  onSave,
}: LineToolPopoverProps) {
  const { execute, isPending } = useAction(createPolygonAction, {
    onSuccess: () => {
      onSave();
      setIsLayerSaveOpen(false);
    },
  });
  const [isLayerSaveOpen, setIsLayerSaveOpen] = useState(false);

  const handleLayerSelect = (layerId: string) => {
    execute({
      layerId,
      value: {
        coordinates: coordinates as [number, number][][],
      },
    });
  };

  return (
    <SearchPopover location={location} title="New Line" isPending={isFetching}>
      <LayerSavePopover
        types={["polygon"]}
        onSelect={handleLayerSelect}
        isPending={isPending}
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
