import { Input } from "@mapform/ui/components/input";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { cn } from "@mapform/lib/classnames";
import {
  BoxIcon,
  ChevronLeftIcon,
  GlobeIcon,
  MessageCircle,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState, useRef, createContext, useContext } from "react";
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@mapform/ui/components/command";
import { useParamsContext } from "~/lib/params/client";
import { useProject } from "../context";
import { useMap } from "~/components/map";
import { AnimatePresence } from "motion/react";
import { Button } from "@mapform/ui/components/button";

interface SearchProviderProps {
  children: React.ReactNode;
}

interface SearchContextProps {
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  chatMode: boolean;
  setChatMode: (mode: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
}

export const SearchContext = createContext<SearchContextProps>(
  {} as SearchContextProps,
);
export const useSearch = () => useContext(SearchContext);

export function Search({ children }: SearchProviderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const {
    params: { query },
    setQueryStates,
  } = useParamsContext();
  const [searchQuery, setSearchQuery] = useState(query);
  const [chatMode, setChatMode] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void setQueryStates({ query: debouncedSearchQuery });
  }, [debouncedSearchQuery, setQueryStates]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (listRef.current && listRef.current.contains(event.target as Node)) ||
        (inputRef.current && inputRef.current.contains(event.target as Node))
      ) {
        return;
      }

      setSearchFocused(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchFocused,
        setSearchFocused,
        searchQuery,
        setSearchQuery,
        chatMode,
        setChatMode,
        inputRef,
        listRef,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function SearchInput() {
  const {
    searchFocused,
    setSearchFocused,
    searchQuery,
    setSearchQuery,
    inputRef,
  } = useSearch();

  return (
    <div className="relative z-20 flex flex-1 items-center gap-1">
      <AnimatePresence>
        {searchFocused ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSearchFocused(false)}
              className="absolute left-0 top-0 z-10"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
          </>
        ) : (
          <SearchIcon className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
        )}
      </AnimatePresence>
      <Input
        ref={inputRef}
        value={searchQuery}
        onFocus={() => setSearchFocused(true)}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={cn(
          "hover:bg-muted w-full border-none pl-10 shadow-none !ring-0",
          {
            "bg-muted": searchFocused,
          },
        )}
        placeholder="Search or ask..."
      />
    </div>
  );
}

export function SearchList() {
  const { map } = useMap();
  const { searchFocused, setSearchFocused, searchQuery, listRef, setChatMode } =
    useSearch();
  const { projectService, vectorSearchResults, geoapifySearchResults } =
    useProject();
  const { setQueryStates } = useParamsContext();

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

  const handleChat = async () => {
    setSearchFocused(false);
    setChatMode(true);
    const response = await fetch(`/api/chat?message=${searchQuery}`);
    const data = await response.json();

    console.log("CHAT: ", data);
  };

  return (
    <Command
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
      <CommandList className="mt-16 max-h-full px-2" ref={listRef}>
        <CommandGroup>
          {searchQuery && (
            <CommandItem onSelect={handleChat}>
              <MessageCircle className="text-muted-foreground mr-2 size-4" />
              <span className="truncate">{searchQuery}</span>
              <span className="text-muted-foreground ml-1 flex-shrink-0">
                — Chat
              </span>
            </CommandItem>
          )}
          {vectorSearchResults?.map((result) => (
            <CommandItem
              key={result.id}
              value={result.id}
              onSelect={async () => {
                console.log("clicked", result.id);
                await setQueryStates({ rowId: result.id });
                setSearchFocused(false);
                map?.flyTo({
                  center: result.center.coordinates as [number, number],
                  duration: 500,
                });
              }}
            >
              {projectService.optimisticState.icon ? (
                <span className="text-muted-foreground mr-2">
                  {projectService.optimisticState.icon}
                </span>
              ) : (
                <BoxIcon className="text-muted-foreground mr-2 size-4" />
              )}
              <span className="truncate">{result.name}</span>
              <span className="text-muted-foreground ml-1 flex-shrink-0">
                {" "}
                — From {projectService.optimisticState.name ?? "your map"}
              </span>
            </CommandItem>
          ))}
          {filteredFeatures.map((feature) => (
            <CommandItem
              key={feature.properties?.place_id}
              value={feature.properties?.place_id}
              onSelect={async () => {
                await setQueryStates({
                  geoapifyPlaceId: feature.properties?.place_id,
                });
                setSearchFocused(false);
                if (feature.properties?.lon && feature.properties.lat) {
                  map?.flyTo({
                    center: [feature.properties.lon, feature.properties.lat],
                    duration: 500,
                  });
                }
              }}
            >
              <GlobeIcon className="text-muted-foreground mr-2 size-4" />
              <span className="truncate">
                {feature.properties?.name ?? feature.properties?.address_line1}
              </span>
              {/* <span className="text-muted-foreground ml-1 flex-shrink-0">
                    — From {feature.properties?.country}
                  </span> */}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function SearchChat() {
  const { chatMode } = useSearch();

  return (
    <div
      className={cn(
        "absolute inset-0 z-30 flex flex-col rounded-lg transition-all duration-300",
        {
          "pointer-events-auto visible bg-white/80 opacity-100 backdrop-blur-sm":
            chatMode,
          "pointer-events-none invisible bg-white/0 opacity-0 backdrop-blur-none":
            !chatMode,
        },
      )}
    >
      <div className="flex-1">Message</div>
      <div className="relative flex-shrink-0 border-t p-2">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute left-[18px] top-1/2 size-4 -translate-y-1/2" />
        <Input
          // value={searchQuery}
          // onFocus={() => setSearchFocused(true)}
          // onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "bg-muted w-full border-none pl-10 shadow-none !ring-0",
          )}
          placeholder="Ask anything..."
        />
      </div>
    </div>
  );
}
