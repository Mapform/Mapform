import { useMeasure } from "@mapform/lib/hooks/use-measure";
import { Button } from "@mapform/ui/components/button";
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
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import type { PlacesSearchResponse } from "@mapform/map-utils/types";
import {
  XIcon,
  StoreIcon,
  TriangleIcon,
  ChevronRightIcon,
  type LucideIcon,
  BuildingIcon,
  Building2Icon,
  MailboxIcon,
  EarthIcon,
} from "lucide-react";
import { type SetStateAction, useState } from "react";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

interface SearchLocationMarkerProps {
  searchLocation: PlacesSearchResponse["features"][number] | null;
  setDrawerOpen: (value: SetStateAction<boolean>) => void;
  setSearchLocation: (
    value: SetStateAction<PlacesSearchResponse["features"][number] | null>,
  ) => void;
}

const searchLocationIcons: Partial<
  Record<
    NonNullable<
      PlacesSearchResponse["features"][number]["properties"]
    >["result_type"],
    LucideIcon
  >
> = {
  amenity: StoreIcon,
  building: BuildingIcon,
  city: Building2Icon,
  postcode: MailboxIcon,
  unknown: EarthIcon,
};

export function SearchLocationMarker({
  setDrawerOpen,
  searchLocation,
  setSearchLocation,
}: SearchLocationMarkerProps) {
  const { ref, bounds } = useMeasure<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const Icon =
    searchLocationIcons[searchLocation?.properties?.result_type ?? "unknown"] ??
    EarthIcon;

  return (
    <div
      className="relative w-[240px] rounded-md bg-white p-4 shadow-md"
      ref={ref}
      style={{
        transform: `translateY(-${bounds.height / 2 + 16 + 8}px)`,
      }}
    >
      <Button
        className="absolute right-2 top-2"
        onClick={() => {
          setDrawerOpen(true);
          setSearchLocation(null);
        }}
        size="icon-sm"
        variant="ghost"
      >
        <XIcon className="size-5" />
      </Button>
      <div className="flex flex-col">
        <Icon className="mb-2 size-5" />
        <h1 className="text-lg font-semibold">
          {searchLocation?.properties?.name ??
            searchLocation?.properties?.address_line1 ??
            "New Location"}
        </h1>
        <div className="mt-8 flex">
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
              <Button
                aria-expanded={open}
                className="ml-auto"
                role="combobox"
                size="sm"
              >
                Add to
                <ChevronRightIcon className="-mr-1 ml-2 size-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[200px] p-0"
              side="right"
            >
              <Command>
                <CommandInput
                  onValueChange={(value: string) => {
                    setQuery(value);
                  }}
                  placeholder="Search layers..."
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
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        onSelect={() => {
                          setOpen(false);
                        }}
                        value={framework.value}
                      >
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Caret */}
      <TriangleIcon
        className="absolute -bottom-4 left-1/2 size-5 -translate-x-1/2 rotate-180 text-white"
        fill="white"
      />
    </div>
  );
}
