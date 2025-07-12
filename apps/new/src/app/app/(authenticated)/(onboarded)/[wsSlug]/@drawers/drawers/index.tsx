import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "~/lib/params/server";
import { Search } from "./search";
import { cache, Suspense } from "react";
import { authClient, publicClient } from "~/lib/safe-action";

interface DealDrawerProps {
  searchParams: Promise<SearchParams>;
}

export async function Drawers({ searchParams }: DealDrawerProps) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchDrawer searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const getGeoapifySearchResults = cache(
  async (query: string, bounds?: [number, number, number, number]) => {
    const searchResults = await publicClient.searchPlaces({
      query,
      bounds,
    });
    return searchResults;
  },
);

const getVectorSearchResults = cache(
  async (query: string, projectId: string) => {
    const searchResults = await authClient.searchRows({
      query,
      projectId,
    });
    return searchResults;
  },
);

async function SearchDrawer({ searchParams }: DealDrawerProps) {
  const { query } = await loadSearchParams(searchParams);

  const [geoapifySearchResults] = await Promise.all([
    query ? getGeoapifySearchResults(query, undefined) : null,
  ]);

  return <Search geoapifySearchResults={geoapifySearchResults?.data} />;
}
