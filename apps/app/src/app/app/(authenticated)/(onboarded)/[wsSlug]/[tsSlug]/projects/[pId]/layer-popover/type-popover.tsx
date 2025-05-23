import {
  FormField,
  FormLabel,
  FormControl,
  type UseFormReturn,
} from "@mapform/ui/components/form";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import type { UpsertLayerSchema } from "@mapform/backend/data/layers/upsert-layer/schema";
import { useMemo, useState } from "react";
import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  CircleDotIcon,
  PentagonIcon,
  WaypointsIcon,
} from "lucide-react";
import type { LayerType } from "./types";

interface TypePopoverProps {
  initialTypes?: LayerType[];
  form: UseFormReturn<Pick<UpsertLayerSchema, "type" | "datasetId" | "name">>;
}

const types = [
  {
    label: "Point",
    value: "point",
    icon: CircleDotIcon,
    description: "Used to render Point data on the map.",
  },
  {
    label: "Line",
    value: "line",
    icon: WaypointsIcon,
    description: "Used to render Line data on the map.",
  },
  {
    label: "Polygon",
    value: "polygon",
    icon: PentagonIcon,
    description: "Used to render Polygon data on the map.",
  },
] as const;

export function TypePopover({ form, initialTypes }: TypePopoverProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredTypes = useMemo(() => {
    return types.filter((type) => initialTypes?.includes(type.value));
  }, [initialTypes]);

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <Popover modal onOpenChange={setOpen} open={open}>
          <FormLabel htmlFor="type">Type</FormLabel>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                className="ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-7 w-full items-center justify-between whitespace-nowrap rounded-md border-0 bg-stone-100 px-2 py-0.5 text-sm font-normal shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                id="type"
                size="icon-xs"
                variant="ghost"
              >
                {form.watch("type") && (
                  <span className="mr-2">
                    {(() => {
                      const TypeIcon = filteredTypes.find(
                        (type) => type.value === field.value,
                      )?.icon;
                      return TypeIcon && <TypeIcon className="size-4" />;
                    })()}
                  </span>
                )}
                <span className="flex-1 truncate text-left">
                  {form.watch("type")
                    ? filteredTypes.find((type) => type.value === field.value)
                        ?.label
                    : "Select type..."}
                </span>
                <ChevronsUpDownIcon className="size-4 flex-shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[200px] p-0" side="right">
            <Command>
              <CommandInput
                className="h-9"
                onValueChange={(v: string) => {
                  setQuery(v);
                }}
                placeholder="Search types..."
                value={query}
              />
              <CommandList>
                <CommandEmpty className="text-muted-foreground py-2 text-center text-sm">
                  No type found.
                </CommandEmpty>
                {filteredTypes.filter((type) =>
                  type.label.toLowerCase().includes(query.toLowerCase()),
                ).length > 0 && (
                  <CommandGroup>
                    {filteredTypes
                      .filter((type) =>
                        type.label.toLowerCase().includes(query.toLowerCase()),
                      )
                      .map((type) => (
                        <Tooltip delayDuration={0} key={type.value}>
                          <TooltipTrigger className="w-full">
                            <CommandItem
                              value={type.label}
                              onSelect={() => {
                                form.setValue("type", type.value);
                                setQuery("");
                                setOpen(false);
                              }}
                              className="flex items-center gap-2"
                            >
                              <type.icon className="size-4 flex-shrink-0" />
                              <span className="flex-1 truncate text-left">
                                {type.label}
                              </span>
                              <CheckIcon
                                className={cn(
                                  "ml-auto size-4",
                                  field.value === type.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          </TooltipTrigger>
                          <TooltipContent
                            className="max-w-[200px]"
                            side="right"
                          >
                            {type.description}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
