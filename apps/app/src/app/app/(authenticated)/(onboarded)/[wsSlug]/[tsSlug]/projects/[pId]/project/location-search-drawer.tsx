import {
  LocationSearch,
  LocationSearchButton,
  useLocationSearch,
} from "~/components/location-search";
import {
  MapformDrawer,
  useMapform,
  useMapformContent,
} from "~/components/mapform";
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

interface LocationSearchDrawerProps {
  currentPage: NonNullable<GetPageWithLayers["data"]>;
}

export function LocationSearchDrawer({
  currentPage,
}: LocationSearchDrawerProps) {
  const { drawerValues, onDrawerValuesChange } = useMapformContent();

  return (
    <MapformDrawer
      onClose={() => {
        onDrawerValuesChange(
          drawerValues.filter((v) => v !== "location-search"),
        );
      }}
      value="location-search"
    >
      <LocationSearch>
        <LocationSearchDrawerInner currentPage={currentPage} />
      </LocationSearch>
    </MapformDrawer>
  );
}

export function LocationSearchDrawerInner({
  currentPage,
}: LocationSearchDrawerProps) {
  const { map } = useMapform();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const { selectedFeature } = useLocationSearch();
  const { drawerValues, onDrawerValuesChange } = useMapformContent();
  const [layerPopoverOpen, setLayerPopoverOpen] = useState(false);
  const { currentProject, updatePageServerAction } = useProject();

  const { execute: executeCreatePoint, isPending } = useAction(
    createPointAction,
    {
      onSuccess: () => {
        setLayerPopoverOpen(false);
        setIsOpen(false);
        toast({
          title: "Success!",
          description: "Point created.",
        });
      },
    },
  );

  const pageLayers = currentProject.pageLayers.filter(
    (layer) =>
      layer.pageId === currentPage.id &&
      (layer.type === "point" || layer.type === "marker"),
  );

  const location = {
    x: selectedFeature?.properties?.lon,
    y: selectedFeature?.properties?.lat,
  };

  const title =
    selectedFeature?.properties?.name ??
    selectedFeature?.properties?.address_line1;

  const handleSaveMapPosition = async () => {
    const center = map?.getCenter();
    const zoom = map?.getZoom();
    const pitch = map?.getPitch();
    const bearing = map?.getBearing();

    if (
      center !== undefined &&
      zoom !== undefined &&
      pitch !== undefined &&
      bearing !== undefined
    ) {
      const payload = {
        id: currentPage.id,
        center: {
          x: center.lng,
          y: center.lat,
        },
        zoom,
        pitch,
        bearing,
      };

      updatePageServerAction.execute({
        ...currentPage,
        ...payload,
      });

      onDrawerValuesChange(
        drawerValues.filter((value) => value !== "location-search"),
      );
    }
  };

  return (
    <>
      <Popover
        modal
        open={isOpen}
        onOpenChange={(val) => {
          if (val) {
            setQuery("");
          }
          setIsOpen(val);
        }}
      >
        <PopoverTrigger asChild>
          <LocationSearchButton
            className="mb-2 w-full"
            disabled={!selectedFeature?.properties}
            role="combobox"
            variant="outline"
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
                      disabled={isPending}
                      key={pageLayer.layerId}
                      keywords={[pageLayer.name ?? "Untitled"]}
                      onSelect={() => {
                        if (
                          location.x === undefined ||
                          location.y === undefined
                        )
                          return;

                        executeCreatePoint({
                          layerId: pageLayer.layerId,
                          title,
                          description: null,
                          location: {
                            x: location.x,
                            y: location.y,
                          },
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

      {/* Used for creating a new layer */}
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
            if (location.x === undefined || location.y === undefined) return;

            executeCreatePoint({
              layerId,
              title,
              description: null,
              location: {
                x: location.x,
                y: location.y,
              },
            });
          }}
          side="right"
        />
      </LayerPopoverRoot>

      <LocationSearchButton
        disabled={
          updatePageServerAction.isPending || !selectedFeature?.properties
        }
        onClick={() => void handleSaveMapPosition()}
      >
        Save Map Position
      </LocationSearchButton>
    </>
  );
}
