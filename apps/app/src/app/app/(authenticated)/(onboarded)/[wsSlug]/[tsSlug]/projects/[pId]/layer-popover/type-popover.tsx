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
import type { UpsertLayerSchema } from "@mapform/backend/data/layers/upsert-layer/schema";
import { useState } from "react";
import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

interface TypePopoverProps {
  form: UseFormReturn<UpsertLayerSchema>;
}

const types = [
  {
    label: "Point",
    value: "point",
  },
  {
    label: "Marker",
    value: "marker",
  },
] as const;

export function TypePopover({ form }: TypePopoverProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

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
                <span className="flex-1 truncate text-left">
                  {form.watch("type")
                    ? types.find((type) => type.value === field.value)?.label
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
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandGroup>
                  {types.map((type) => (
                    <CommandItem
                      value={type.label}
                      key={type.value}
                      onSelect={() => {
                        form.setValue("type", type.value);
                        setQuery("");
                        setOpen(false);
                      }}
                    >
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
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
