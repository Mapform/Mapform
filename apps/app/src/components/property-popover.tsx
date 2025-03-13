"use client";

import type { ComponentPropsWithoutRef } from "react";
import { PlusIcon, CheckIcon } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@mapform/ui/components/command";
import { cn } from "@mapform/lib/classnames";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";

interface PropertyPopoverContentProps<T> {
  value: T | null;
  query: string;
  availableItems: Array<{ id: string; name: string }>;
  setQuery: (query: string) => void;
  onSelect: (value: T | null) => void;
  onCreate: (name: string) => void;
}

export function PropertyPopoverContent<T extends string>({
  value,
  availableItems,
  onSelect,
  onCreate,
  query,
  setQuery,
  ...props
}: PropertyPopoverContentProps<T> &
  ComponentPropsWithoutRef<typeof PopoverContent>) {
  return (
    <PopoverContent className="w-[200px] p-0" {...props}>
      <Command
        filter={(value, search, keywords) => {
          if (value.includes("Create")) return 1;
          if (value.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
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
          onValueChange={(v: string) => {
            setQuery(v);
          }}
          placeholder="Search or create..."
          value={query}
        />
        <CommandList>
          <>
            <CommandGroup>
              <CommandItem
                disabled={query.length === 0}
                onSelect={() => onCreate(query)}
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
          </>
          {availableItems.length > 0 ? (
            <CommandGroup heading="Connect to existing">
              {availableItems.map((item) => (
                <CommandItem
                  key={item.id}
                  keywords={[item.name]}
                  onSelect={(currentValue) => {
                    onSelect(
                      currentValue === value ? null : (currentValue as T),
                    );
                  }}
                  value={item.id}
                >
                  <span className="flex-1 truncate text-left">{item.name}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto size-4",
                      value === item.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

export { Popover as PropertyPopover, PopoverTrigger as PropertyPopoverTrigger };
