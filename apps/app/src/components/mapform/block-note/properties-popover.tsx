"use client";

import { useState } from "react";
import { TextIcon, ListPlusIcon, TextQuoteIcon, SmileIcon } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { Button } from "@mapform/ui/components/button";

export function PropertiesPopover() {
  const [query, setQuery] = useState("");

  const properties = [
    { id: "title", label: "Title", icon: TextIcon },
    { id: "description", label: "Description", icon: TextQuoteIcon },
    { id: "icon", label: "Icon", icon: SmileIcon },
  ];

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button size="icon-sm" type="button" variant="ghost">
          <ListPlusIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0" side="right">
        <Command>
          <CommandInput
            onValueChange={setQuery}
            placeholder="Search properties..."
            value={query}
          />
          <CommandList>
            <CommandGroup heading="Type">
              {properties.map((property) => (
                <CommandItem
                  key={property.id}
                  // onSelect={() => onPropertyToggle(property.id)}
                >
                  <div className="flex items-center space-x-2">
                    <property.icon className="size-4" />
                    <label htmlFor={property.id}>{property.label}</label>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
