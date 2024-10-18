import { Button } from "@mapform/ui/components/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import { FormLabel } from "@mapform/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { useStandardLayout } from "~/app/(authenticated)/[wsSlug]/standard-layout/context";

interface DatasetPopoverProps {}

export function DatasetPopover({}: DatasetPopoverProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { workspaceDirectory } = useStandardLayout();

  const availableDatasets = workspaceDirectory.teamspaces.flatMap(
    (ts) => ts.datasets
  );

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <FormLabel>Dataset</FormLabel>
      <div className="flex w-full flex-shrink-0 justify-end">
        <PopoverTrigger asChild>
          <Button
            className="flex w-full h-7 px-2 py-0.5 border-0 font-normal bg-stone-100 items-center justify-between whitespace-nowrap rounded-md text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            size="icon-xs"
            variant="ghost"
          >
            Select
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="right" className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search datasets..."
              value={query}
              onValueChange={(value: string) => setQuery(value)}
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
                    value={dataset.id}
                    keywords={[dataset.name]}
                    onSelect={() => {
                      setOpen(false);
                    }}
                  >
                    {dataset.name}
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
