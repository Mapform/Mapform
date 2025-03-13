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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { Button } from "@mapform/ui/components/button";
import {
  PropertyPopover,
  PropertyPopoverAnchor,
  PropertyPopoverContent,
} from "~/components/property-popover";

export function PropertiesPopover() {
  const [query, setQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPropertyPopoverOpen, setIsPropertyPopoverOpen] = useState(false);

  const properties = [
    { id: "title", label: "Title", icon: TextIcon },
    { id: "description", label: "Description", icon: TextQuoteIcon },
    { id: "icon", label: "Icon", icon: SmileIcon },
  ];

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
                      setIsPropertyPopoverOpen(true);
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
      <PropertyPopover
        modal
        open={isPropertyPopoverOpen}
        onOpenChange={setIsPropertyPopoverOpen}
      >
        <PropertyPopoverAnchor />
        <PropertyPopoverContent
          align="start"
          side="right"
          value={null}
          query={query}
          setQuery={setQuery}
          availableItems={[]}
          onSelect={(value) => {
            // form.setValue(name, value as string | null);
            // setOpen(false);
          }}
          onCreate={async (name) => {
            // await executeAsync({
            //   name,
            //   datasetId: form.watch("datasetId"),
            //   type,
            // });
            // setQuery("");
            // setOpen(false);
          }}
        />
      </PropertyPopover>
    </>
  );
}
