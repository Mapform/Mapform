import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { useState } from "react";
import { useStandardLayout } from "~/app/(authenticated)/[wsSlug]/standard-layout/context";

interface DatasetPopoverProps {
  // The trigger
  children: React.ReactNode;
}

export function DatasetPopover({ children }: DatasetPopoverProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { workspaceDirectory } = useStandardLayout();

  const availableDatasets = workspaceDirectory.teamspaces.flatMap(
    (ts) => ts.datasets
  );

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
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
    </Popover>
  );
}
