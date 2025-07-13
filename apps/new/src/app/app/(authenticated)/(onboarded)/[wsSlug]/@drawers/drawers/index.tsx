import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "~/lib/params/server";
import { Search } from "./search";
import { cache, Suspense } from "react";
import { authClient, publicClient } from "~/lib/safe-action";
import { Chat } from "./chat";
import { SearchDetails } from "./search-details";

interface DealDrawerProps {
  searchParams: Promise<SearchParams>;
}

export function Drawers({ searchParams }: DealDrawerProps) {
  return (
    <>
      <Suspense>
        <SearchDrawer searchParams={searchParams} />
      </Suspense>
      <Suspense>
        <ChatDrawer searchParams={searchParams} />
      </Suspense>
      <Suspense>
        <SearchDetailsDrawer searchParams={searchParams} />
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

async function ChatDrawer({ searchParams }: DealDrawerProps) {
  // const { chatId } = await loadSearchParams(searchParams);

  return <Chat />;
}

const getGeoapifyPlaceDetails = cache(async (placeId: string | null) => {
  if (!placeId) return null;

  const placeDetails = await publicClient.getPlaceDetails({
    placeId,
  });
  return placeDetails;
});

async function SearchDetailsDrawer({ searchParams }: DealDrawerProps) {
  const { geoapifyPlaceId } = await loadSearchParams(searchParams);

  const geoapifyPlaceDetails = await getGeoapifyPlaceDetails(geoapifyPlaceId);

  return <SearchDetails geoapifyPlaceDetails={geoapifyPlaceDetails?.data} />;
}
