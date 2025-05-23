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
import {
  LayerPopoverRoot,
  LayerPopoverAnchor,
  LayerPopoverContent,
} from "../layer-popover";
import { useProject } from "../project-context";
import type { Layer } from "@mapform/db/schema";

interface LayerSavePopoverProps {
  children: React.ReactNode;
  onSelect: (layerId: string) => void;
  isPending?: boolean;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  open?: boolean;
  types: Layer["type"][];
  onOpenChange?: (open: boolean) => void;
}

export function LayerSavePopover({
  children,
  onSelect,
  isPending = false,
  align = "end",
  side = "right",
  open,
  onOpenChange,
  types,
}: LayerSavePopoverProps) {
  const [query, setQuery] = useState<string>("");
  const [layerPopoverOpen, setLayerPopoverOpen] = useState(false);
  const { currentProject, updatePageServerAction } = useProject();

  const currentPage = updatePageServerAction.optimisticState;
  const pageLayers = currentProject.pageLayers.filter(
    (layer) => layer.pageId === currentPage?.id && types.includes(layer.type),
  );

  return (
    <>
      <Popover
        modal
        open={open}
        onOpenChange={(val) => {
          if (val) {
            setQuery("");
          }
          onOpenChange?.(val);
        }}
      >
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent align={align} className="w-[200px] p-0" side={side}>
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
                      onSelect={() => onSelect(pageLayer.layerId)}
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
          align={align}
          initialName={query}
          initialTypes={types}
          key={query}
          onClose={() => {
            setLayerPopoverOpen(false);
          }}
          onSuccess={(layerId) => onSelect(layerId)}
          side={side}
        />
      </LayerPopoverRoot>
    </>
  );
}
