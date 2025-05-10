import { LayerSavePopover } from "../../layer-save-popover";
import { SearchPopover } from "../search-popover";
import { Button } from "@mapform/ui/components/button";
import { BookmarkIcon } from "lucide-react";
import { createLineAction } from "~/data/datasets/create-line";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

interface LineToolPopoverProps {
  location: mapboxgl.LngLat;
  isFetching: boolean;
  coordinates: [number, number][];
  onSave: () => void;
}

export function LineToolPopover({
  location,
  coordinates,
  isFetching,
  onSave,
}: LineToolPopoverProps) {
  const { execute, isPending } = useAction(createLineAction, {
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
        coordinates,
      },
    });
  };

  return (
    <SearchPopover location={location} title="New Line" isPending={isFetching}>
      <LayerSavePopover
        types={["line"]}
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
