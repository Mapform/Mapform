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
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { createPointAction } from "~/data/datasets/create-point";
import {
  LayerPopoverRoot,
  LayerPopoverAnchor,
  LayerPopoverContent,
} from "../layer-popover";

interface LayerSavePopoverProps {
  trigger: React.ReactNode;
  location: { x?: number; y?: number };
  title?: string;
  pageLayers: Array<{
    layerId: string;
    name: string | null;
  }>;
}

export function LayerSavePopover({
  trigger,
  location,
  title,
  pageLayers,
}: LayerSavePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [layerPopoverOpen, setLayerPopoverOpen] = useState(false);
  const { execute: executeCreatePoint, isPending } = useAction(
    createPointAction,
    {
      onSuccess: ({ data }) => {
        setLayerPopoverOpen(false);
        setIsOpen(false);
      },
    },
  );

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
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent align="end" className="w-[200px] p-0" side="right">
          <Command
            filter={(value, search, keywords) => {
              if (value === "new-layer") return 1;
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
              placeholder="Search or create..."
              value={query}
            />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setLayerPopoverOpen(true);
                  }}
                  value="new-layer"
                >
                  <div className="flex items-center overflow-hidden">
                    <p className="flex items-center whitespace-nowrap font-semibold">
                      <PlusIcon className="mr-2 size-4" />
                      New layer
                    </p>
                    <p className="text-primary ml-1 block truncate">{query}</p>
                  </div>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              {pageLayers.length > 0 ? (
                <CommandGroup heading="Save to existing layer">
                  {pageLayers.map((pageLayer) => (
                    <CommandItem
                      disabled={isPending}
                      key={pageLayer.layerId}
                      keywords={[pageLayer.name || "Untitled"]}
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
                        {pageLayer.name || "Untitled"}
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
    </>
  );
}
