import { Input } from "@mapform/ui/components/input";
import type { GeoapifyPlace } from "~/app/api/places/search/route";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { cn } from "@mapform/lib/classnames";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@mapform/ui/components/command";

export function Search() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const { data: searchResults, isFetching } = useQuery({
    enabled: !!debouncedSearchQuery,
    queryKey: ["search", debouncedSearchQuery],
    queryFn: () => searchPlaces(debouncedSearchQuery),
    placeholderData: (prev) => prev,
  });

  const filteredFeatures =
    searchResults?.features.filter(
      (f, i, self) =>
        f.properties &&
        f.bbox &&
        i ===
          self.findIndex(
            (t) => t.properties?.place_id === f.properties?.place_id,
          ),
    ) ?? [];

  return (
    <div className="-mx-6 -mt-6 border-b">
      <Command>
        <div className="relative z-20 m-2 flex items-center gap-1">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            onFocus={() => setSearchFocused(true)}
            // onBlur={() => setSearchFocused(false)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hover:bg-muted focus:bg-muted w-full border-none pl-10 shadow-none"
            placeholder="Search or ask..."
          />
        </div>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 flex flex-col rounded-lg transition-all duration-300",
            {
              "pointer-events-auto visible bg-white/80 opacity-100 backdrop-blur-sm":
                searchFocused,
              "pointer-events-none invisible bg-white/0 opacity-0 backdrop-blur-none":
                !searchFocused,
            },
          )}
        >
          <CommandList className="mt-16 max-h-full flex-1 px-6 pb-6">
            <CommandGroup heading="Chat">
              <CommandItem>{searchQuery}</CommandItem>
            </CommandGroup>
            <CommandGroup heading="From your map"></CommandGroup>
            <CommandGroup heading="Search results">
              {filteredFeatures.map((feature) => (
                <CommandItem
                  key={feature.properties?.place_id}
                  value={feature.properties?.place_id}
                >
                  {feature.properties?.name ??
                    feature.properties?.address_line1}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </Command>
    </div>
  );
}

async function searchPlaces(
  query?: string,
  { bounds }: { bounds?: [number, number, number, number] } = {},
) {
  if (!query) {
    return undefined;
  }

  const response = await fetch(
    `/api/places/search?query=${query}${
      bounds ? `&bounds=${bounds.join(",")}` : ""
    }`,
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();

  return json.data as GeoapifyPlace;
}
