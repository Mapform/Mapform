import { cn } from "@mapform/lib/classnames";
import { useDebounce } from "@mapform/lib/use-debounce";
import { Button } from "@mapform/ui/components/button";
import type { PlacesSearchResponse } from "@mapform/map-utils/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

const queryClient = new QueryClient();

async function fetchPlaces(query?: string) {
  if (!query || query.length < 3) {
    return { results: [] };
  }

  const response = await fetch(`/api/places/search?query=${query}`);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json: PlacesSearchResponse = await response.json();
  console.log(99999, json);

  return json.data;
}

export function Search() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchInner />
    </QueryClientProvider>
  );
}

function SearchInner() {
  const [query, setQuery] = useState("");
  const debouncedFetchPlaces = useDebounce(fetchPlaces, 500);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchPlaces(query),
  });

  console.log(11111, data);

  return (
    <div className="flex">
      <Button size="icon-sm">
        <SearchIcon className="h-4 w-4" />
      </Button>
      <ul className="absolute bottom-10 w-full z-10 bg-primary rounded-lg shadow text-white p-2">
        {data?.results.map((result) => (
          <li key={result.fsq_id}>{result.name}</li>
        ))}
      </ul>
      <div className="relative w-52 flex-1">
        <input
          className={cn(
            "absolute text-white text-sm inset-0 bg-transparent border-none outline-none z-10 focus:ring-0",
            {}
          )}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search"
          type="text"
          value={query}
        />
      </div>
    </div>
  );
}
