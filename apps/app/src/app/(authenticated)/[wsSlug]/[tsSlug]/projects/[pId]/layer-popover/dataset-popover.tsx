import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import { FormLabel, type UseFormReturn } from "@mapform/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { useStandardLayout } from "~/app/(authenticated)/[wsSlug]/standard-layout/context";
import type { CreateLayerSchema } from "~/data/layers/create-layer/schema";

interface DatasetPopoverProps {
  form: UseFormReturn<CreateLayerSchema>;
}

export function DatasetPopover({ form }: DatasetPopoverProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const { workspaceDirectory } = useStandardLayout();

  const availableDatasets = workspaceDirectory.teamspaces.flatMap(
    (ts) => ts.datasets,
  );

  return (
    <Popover modal onOpenChange={setOpen} open={open}>
      <FormLabel htmlFor="datasetSelect">Dataset</FormLabel>
      <div className="flex w-full flex-shrink-0 justify-end">
        <PopoverTrigger asChild>
          <Button
            className="ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-7 w-full items-center justify-between whitespace-nowrap rounded-md border-0 bg-stone-100 px-2 py-0.5 text-sm font-normal shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            id="datasetSelect"
            size="icon-xs"
            variant="ghost"
          >
            {value
              ? availableDatasets.find((dataset) => dataset.id === value)?.name
              : "Select dataset..."}
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[200px] p-0" side="right">
          <Command>
            <CommandInput
              onValueChange={(v: string) => {
                setQuery(v);
              }}
              placeholder="Search datasets..."
              value={query}
            />
            <CommandList>
              <CommandEmpty
                className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative m-1 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
              >
                <p>Create: </p>
                <p className="text-primary ml-1 block max-w-48 truncate font-semibold">
                  {query}
                </p>
              </CommandEmpty>
              <CommandGroup>
                {query.length ? (
                  <CommandItem
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <p>Create: </p>
                    <p className="text-primary ml-1 block max-w-48 truncate font-semibold">
                      {query}
                    </p>
                  </CommandItem>
                ) : null}
                {availableDatasets.map((dataset) => (
                  <CommandItem
                    key={dataset.id}
                    keywords={[dataset.name]}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    value={dataset.id}
                  >
                    {dataset.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto size-4",
                        value === dataset.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
