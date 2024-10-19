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

export function DatasetPopover({}: DatasetPopoverProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const { workspaceDirectory } = useStandardLayout();

  const availableDatasets = workspaceDirectory.teamspaces.flatMap(
    (ts) => ts.datasets
  );

  return (
    <Popover modal onOpenChange={setOpen} open={open}>
      <FormLabel>Dataset</FormLabel>
      <div className="flex w-full flex-shrink-0 justify-end">
        <PopoverTrigger asChild>
          <Button
            className="flex w-full h-7 px-2 py-0.5 border-0 font-normal bg-stone-100 items-center justify-between whitespace-nowrap rounded-md text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
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
              onValueChange={(value: string) => {
                setQuery(value);
              }}
              placeholder="Search datasets..."
              value={query}
            />
            <CommandList>
              <CommandEmpty
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 m-1"
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
              >
                <p>Create: </p>
                <p className="block max-w-48 truncate font-semibold text-primary ml-1">
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
                    <p className="block max-w-48 truncate font-semibold text-primary ml-1">
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
                        value === dataset.id ? "opacity-100" : "opacity-0"
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
