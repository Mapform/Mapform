import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

async function fetchPlaces(query: string) {
  const response = await fetch(`/api/places/search?query=${query}`);
  const json = await response.json();

  return json;
}

export function Search() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchInner />
    </QueryClientProvider>
  );
}

function SearchInner() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["search"],
    queryFn: () => fetchPlaces("La Banquise"),
  });

  console.log(11111, data);

  return <div>Search</div>;
}
