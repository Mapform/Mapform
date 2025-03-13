"use client";

import { useState } from "react";
import {
  TextIcon,
  ListPlusIcon,
  TextQuoteIcon,
  SmileIcon,
  LucideIcon,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import type { Column } from "@mapform/db/schema";
import { Button } from "@mapform/ui/components/button";
import { SubMenu } from "./sub-menu";

export function PropertiesPopover() {
  const [query, setQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<
    Column["type"] | null
  >(null);

  const properties = [
    { id: "title", label: "Title", icon: TextIcon, type: "string" },
    {
      id: "description",
      label: "Description",
      icon: TextQuoteIcon,
      type: "richtext",
    },
    { id: "icon", label: "Icon", icon: SmileIcon, type: "icon" },
  ] satisfies {
    id: string;
    label: string;
    icon: LucideIcon;
    type: Column["type"];
  }[];

  return (
    <>
      <Popover modal open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button size="icon-sm" type="button" variant="ghost">
                <ListPlusIcon className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Add property</TooltipContent>
        </Tooltip>
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
                    onSelect={() => {
                      setIsPopoverOpen(false);
                      setSelectedProperty(property.type);
                    }}
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
      <SubMenu
        type={selectedProperty}
        isPropertyPopoverOpen={Boolean(selectedProperty)}
        setIsPropertyPopoverOpen={() => setSelectedProperty(null)}
      />
    </>
  );
}
