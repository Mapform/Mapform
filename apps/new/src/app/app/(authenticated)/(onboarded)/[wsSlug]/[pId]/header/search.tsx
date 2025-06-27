import { Input } from "@mapform/ui/components/input";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { cn } from "@mapform/lib/classnames";
import { BoxIcon, GlobeIcon, MessageCircle, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@mapform/ui/components/command";
import { useQueryStates } from "nuqs";
import { projectSearchParams, projectSearchParamsOptions } from "../params";
import { useProject } from "../context";

export function Search() {
  const { project, vectorSearchResults, geoapifySearchResults } = useProject();
  const [searchFocused, setSearchFocused] = useState(false);
  const [{ query }, setQuery] = useQueryStates(
    projectSearchParams,
    projectSearchParamsOptions,
  );
  const [searchQuery, setSearchQuery] = useState(query);
  const debouncedSearchQuery = useDebounce(searchQuery, 0);

  useEffect(() => {
    void setQuery({ query: debouncedSearchQuery });
  }, [debouncedSearchQuery, setQuery]);

  const filteredFeatures =
    geoapifySearchResults?.features.filter(
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
            value={searchQuery}
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
            <CommandGroup>
              <CommandItem>
                <MessageCircle className="text-muted-foreground mr-2 size-4" />
                {searchQuery}
                <span className="text-muted-foreground ml-1"> — Chat</span>
              </CommandItem>
              {vectorSearchResults?.map((result) => (
                <CommandItem key={result.id} value={result.id}>
                  <BoxIcon className="text-muted-foreground mr-2 size-4" />
                  {result.name}
                  <span className="text-muted-foreground ml-1">
                    {" "}
                    — From {project.name ?? "your map"}
                  </span>
                </CommandItem>
              ))}
              {filteredFeatures.map((feature) => (
                <CommandItem
                  key={feature.properties?.place_id}
                  value={feature.properties?.place_id}
                >
                  <GlobeIcon className="text-muted-foreground mr-2 size-4" />
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
