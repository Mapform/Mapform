import { useMeasure } from "@mapform/lib/hooks/use-measure";
import { Button } from "@mapform/ui/components/button";
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
import type { PlacesSearchResponse } from "@mapform/map-utils/types";
import {
  XIcon,
  StoreIcon,
  TriangleIcon,
  ChevronRightIcon,
  type LucideIcon,
  BuildingIcon,
  Building2Icon,
  MailboxIcon,
  MapPinIcon,
  PlusIcon,
  Layers2Icon,
} from "lucide-react";
import { type SetStateAction, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "@mapform/ui/components/toaster";
import type { ProjectWithPages } from "~/data/projects/get-project-with-pages";
import { createPoint } from "~/data/datasets/create-point";
import {
  LayerPopoverContent,
  LayerPopoverRoot,
  LayerPopoverAnchor,
} from "../../layer-popover";

interface SearchLocationMarkerProps {
  pageLayers: ProjectWithPages["layers"];
  searchLocation: PlacesSearchResponse["features"][number] | null;
  setDrawerOpen: (value: SetStateAction<boolean>) => void;
  setSearchLocation: (
    value: SetStateAction<PlacesSearchResponse["features"][number] | null>,
  ) => void;
}

const searchLocationIcons: Partial<
  Record<
    NonNullable<
      PlacesSearchResponse["features"][number]["properties"]
    >["result_type"],
    LucideIcon
  >
> = {
  amenity: StoreIcon,
  building: BuildingIcon,
  city: Building2Icon,
  postcode: MailboxIcon,
  unknown: MapPinIcon,
};

export function SearchLocationMarker({
  pageLayers,
  setDrawerOpen,
  searchLocation,
  setSearchLocation,
}: SearchLocationMarkerProps) {
  const { ref, bounds } = useMeasure<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const [layerPopoverOpen, setLayerPopoverOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const { execute: executeCreatePoint } = useAction(createPoint, {
    onSuccess: () => {
      setSearchLocation(null);
      setDrawerOpen(true);
      setOpen(false);
      setLayerPopoverOpen(false);
      toast("Point created!");
    },
  });

  if (!searchLocation?.properties?.lon || !searchLocation.properties.lat)
    return null;

  const Icon =
    searchLocationIcons[searchLocation.properties.result_type] ?? MapPinIcon;

  const title =
    searchLocation.properties.name ?? searchLocation.properties.address_line1;

  const x = searchLocation.properties.lon;
  const y = searchLocation.properties.lat;

  return (
    <div
      className="relative w-[240px] rounded-md bg-white p-4 shadow-md"
      ref={ref}
      style={{
        transform: `translateY(-${bounds.height / 2 + 16 + 8}px)`,
      }}
    >
      <Button
        className="absolute right-2 top-2"
        onClick={() => {
          setDrawerOpen(true);
          setSearchLocation(null);
        }}
        size="icon-sm"
        variant="ghost"
      >
        <XIcon className="size-5" />
      </Button>
      <div className="flex flex-col">
        <Icon className="mb-2 size-5" />
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="mt-8 flex">
          <Popover
            modal
            onOpenChange={(val) => {
              setOpen(val);
              if (val) {
                setQuery("");
              }
            }}
            open={open}
          >
            <PopoverTrigger asChild>
              <Button
                aria-expanded={open}
                className="ml-auto"
                role="combobox"
                size="sm"
              >
                Add to
                <ChevronRightIcon className="-mr-1 ml-2 size-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[200px] p-0"
              side="right"
            >
              <Command
                filter={(value, search, keywords) => {
                  if (value.includes("Create")) return 1;
                  if (
                    value
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  )
                    return 1;
                  if (
                    keywords?.some((k) =>
                      k
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase()),
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
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center overflow-hidden">
                        <p className="flex items-center font-semibold">
                          <PlusIcon className="mr-2 size-4" />
                          Create
                        </p>
                        <p className="text-primary ml-1 block truncate">
                          {query}
                        </p>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  {pageLayers.length > 0 ? (
                    <CommandGroup heading="Layers">
                      {pageLayers.map((layer) => (
                        <CommandItem
                          key={layer.id}
                          keywords={[layer.name ?? "Untitled"]}
                          onSelect={() => {
                            executeCreatePoint({
                              layerId: layer.id,
                              title,
                              description: null,
                              location: {
                                x,
                                y,
                              },
                            });
                          }}
                          value={layer.id}
                        >
                          <div className="flex items-center overflow-hidden truncate">
                            <Layers2Icon className="mr-2 size-4" />
                            {layer.name ?? "Untitled"}
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
              onSuccess={(layerId) => {
                executeCreatePoint({
                  layerId,
                  title,
                  description: null,
                  location: {
                    x,
                    y,
                  },
                });
              }}
              side="right"
            />
          </LayerPopoverRoot>
        </div>
      </div>

      {/* Caret */}
      <TriangleIcon
        className="absolute -bottom-4 left-1/2 size-5 -translate-x-1/2 rotate-180 text-white"
        fill="white"
      />
    </div>
  );
}
