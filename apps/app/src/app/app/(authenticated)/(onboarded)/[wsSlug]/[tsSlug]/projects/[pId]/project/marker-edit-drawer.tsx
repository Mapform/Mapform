import {
  LocationSearch,
  LocationSearchButton,
  useLocationSearch,
} from "~/components/location-search";
import { MapformDrawer } from "~/components/mapform";
import { useProject } from "../project-context";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { PlusIcon, Layers2Icon } from "lucide-react";
import {
  LayerPopoverRoot,
  LayerPopoverAnchor,
  LayerPopoverContent,
} from "../layer-popover";
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { createPointAction } from "~/data/datasets/create-point";
import { useState } from "react";

interface MarkerEditDrawerProps {
  currentPage: NonNullable<GetPageWithLayers["data"]>;
}

export function MarkerEditDrawer({ currentPage }: MarkerEditDrawerProps) {
  return (
    <MapformDrawer value="marker-edit">
      <LocationSearch>
        <MarkerEditDrawerInner currentPage={currentPage} />
      </LocationSearch>
    </MapformDrawer>
  );
}

export function MarkerEditDrawerInner({ currentPage }: MarkerEditDrawerProps) {
  const [query, setQuery] = useState<string>("");
  const { selectedFeature } = useLocationSearch();
  const [layerPopoverOpen, setLayerPopoverOpen] = useState(false);
  const { currentProject } = useProject();

  const { execute: executeCreatePoint } = useAction(createPointAction, {
    onSuccess: () => {
      // setSearchLocation(null);
      // setDrawerOpen(true);
      // setOpen(false);
      setLayerPopoverOpen(false);
      toast({
        title: "Success!",
        description: "Point created.",
      });
    },
  });

  // const roundLocation = (num: number) => Math.round(num * 1000000) / 1000000;

  // const hasMoved =
  //   roundLocation(movedCoords.lat) !== roundLocation(currentPage.center.y) ||
  //   roundLocation(movedCoords.lng) !== roundLocation(currentPage.center.x) ||
  //   movedCoords.zoom !== currentPage.zoom ||
  //   movedCoords.pitch !== currentPage.pitch ||
  //   movedCoords.bearing !== currentPage.bearing;

  const pageLayers = currentProject.pageLayers.filter(
    (layer) =>
      layer.pageId === currentPage.id &&
      (layer.type === "point" || layer.type === "marker"),
  );

  const location = {
    x: selectedFeature?.properties?.lon ?? 0,
    y: selectedFeature?.properties?.lat ?? 0,
  };

  const title =
    selectedFeature?.properties?.name ??
    selectedFeature?.properties?.address_line1;

  return (
    <>
      <Popover
        modal
        onOpenChange={(val) => {
          // setOpen(val);
          if (val) {
            setQuery("");
          }
        }}
        // open={open}
      >
        <PopoverTrigger asChild>
          <LocationSearchButton
            className="w-full"
            disabled={!selectedFeature?.properties}
            role="combobox"
          >
            Add to Layer
          </LocationSearchButton>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[200px] p-0" side="right">
          <Command
            filter={(value, search, keywords) => {
              if (value.includes("Create")) return 1;
              if (
                value.toLocaleLowerCase().includes(search.toLocaleLowerCase())
              )
                return 1;
              if (
                keywords?.some((k) =>
                  k.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
                )
              )
                return 1;
              return 0;
            }}
          >
            <CommandInput
              onValueChange={(value: string) => {
                setQuery(value);
              }}
              placeholder="Create or search..."
              value={query}
            />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setLayerPopoverOpen(true);
                    // setOpen(false);
                  }}
                >
                  <div className="flex items-center overflow-hidden">
                    <p className="flex items-center font-semibold">
                      <PlusIcon className="mr-2 size-4" />
                      Create
                    </p>
                    <p className="text-primary ml-1 block truncate">{query}</p>
                  </div>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              {pageLayers.length > 0 ? (
                <CommandGroup heading="Layers">
                  {pageLayers.map((pageLayer) => (
                    <CommandItem
                      key={pageLayer.layerId}
                      keywords={[pageLayer.name ?? "Untitled"]}
                      onSelect={() => {
                        executeCreatePoint({
                          layerId: pageLayer.layerId,
                          title,
                          description: null,
                          location,
                        });
                      }}
                      value={pageLayer.layerId}
                    >
                      <div className="flex items-center overflow-hidden truncate">
                        <Layers2Icon className="mr-2 size-4" />
                        {pageLayer.name ?? "Untitled"}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <LayerPopoverRoot
        modal
        onOpenChange={setLayerPopoverOpen}
        open={layerPopoverOpen}
      >
        <LayerPopoverAnchor />
        <LayerPopoverContent
          align="start"
          initialName={query}
          key={query}
          onClose={() => {
            setLayerPopoverOpen(false);
          }}
          onSuccess={(layerId) => {
            executeCreatePoint({
              layerId,
              title,
              description: null,
              location,
            });
          }}
          side="right"
        />
      </LayerPopoverRoot>
    </>
  );
}
