import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "~/lib/params/server";
import { Search } from "./search";
import { cache, Suspense } from "react";
import { authClient, publicClient } from "~/lib/safe-action";
import { Chat } from "./chat";
import { SearchDetails } from "./search-details";
import { Feature } from "./feature";
import { ChatMessage } from "~/lib/types";

interface DealDrawerProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ wsSlug: string; pId?: string }>;
}

export function Drawers(props: DealDrawerProps) {
  return (
    <>
      <Suspense>
        <SearchDrawer {...props} />
      </Suspense>
      <Suspense>
        <ChatDrawer {...props} />
      </Suspense>
      <Suspense>
        <SearchDetailsDrawer {...props} />
      </Suspense>
      <Suspense>
        <FeatureDrawer {...props} />
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
  async (query: string, workspaceSlug: string, projectId?: string) => {
    const searchResults = await authClient.searchRows(
      projectId
        ? {
            query,
            projectId,
            type: "project",
          }
        : {
            query,
            workspaceSlug,
            type: "workspace",
          },
    );
    return searchResults;
  },
);

async function SearchDrawer({ searchParams, params }: DealDrawerProps) {
  const { query, search } = await loadSearchParams(searchParams);
  const { wsSlug, pId } = await params;

  const [geoapifySearchResults, vectorSearchResults] = await Promise.all([
    query && search ? getGeoapifySearchResults(query, undefined) : null,
    query && search ? getVectorSearchResults(query, wsSlug, pId) : null,
  ]);

  return (
    <Search
      geoapifySearchResults={geoapifySearchResults?.data}
      vectorSearchResults={vectorSearchResults?.data}
    />
  );
}

async function ChatDrawer({ searchParams }: DealDrawerProps) {
  const { chatId } = await loadSearchParams(searchParams);

  const messages = chatId
    ? await authClient.getMessages({
        chatId,
      })
    : null;

  return <Chat initialMessages={messages?.data as ChatMessage[]} />;
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

async function FeatureDrawer({ searchParams }: DealDrawerProps) {
  const { rowId } = await loadSearchParams(searchParams);

  const [row] = await Promise.all([
    rowId ? authClient.getRow({ rowId }) : null,
  ]);

  return <Feature feature={row?.data} />;
}
