import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "~/lib/params/server";
import { Search } from "./search";
import { cache } from "react";
import { authClient, publicClient } from "~/lib/safe-action";
import { Chat } from "./chat";
import { SearchDetails } from "./search-details";
import { Feature } from "./feature";
import type { ChatMessage } from "~/lib/types";
import { Coordinates } from "./coordinates";

interface DealDrawerProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ wsSlug: string; pId?: string }>;
}

export function Drawers(props: DealDrawerProps) {
  return (
    <>
      <SearchDrawer {...props} />
      <ChatDrawer {...props} />
      <SearchDetailsDrawer {...props} />
      <FeatureDrawer {...props} />
      <CoordinatesDrawer {...props} />
    </>
  );
}

const getSearchResults = cache(
  async (query: string, bounds?: [number, number, number, number]) => {
    const searchResults = await publicClient.search({
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

  const [searchResults, vectorSearchResults, previousChats] = await Promise.all(
    [
      query && search ? getSearchResults(query, undefined) : null,
      query && search ? getVectorSearchResults(query, wsSlug, pId) : null,
      authClient.listChats({ projectId: pId }),
    ],
  );

  return (
    <Search
      searchResults={searchResults?.data}
      vectorSearchResults={vectorSearchResults?.data}
      previousChats={previousChats?.data}
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

const getDetails = cache(async (id: string | null) => {
  if (!id) return null;

  const placeDetails = await publicClient.details({
    id,
  });

  return placeDetails;
});

async function SearchDetailsDrawer({ searchParams }: DealDrawerProps) {
  const { stadiaId } = await loadSearchParams(searchParams);

  const details = await getDetails(stadiaId);

  return <SearchDetails details={details?.data} />;
}

async function FeatureDrawer({ searchParams }: DealDrawerProps) {
  const { rowId } = await loadSearchParams(searchParams);

  const [row] = await Promise.all([
    rowId ? authClient.getRow({ rowId }) : null,
  ]);

  return <Feature feature={row?.data} />;
}

async function CoordinatesDrawer({ searchParams }: DealDrawerProps) {
  const { marker } = await loadSearchParams(searchParams);

  const [latitude, longitude] = marker?.split(",") ?? [];

  console.log("marker", marker);

  const details = marker
    ? await publicClient.reverseGeocode({
        lat: Number(latitude),
        lng: Number(longitude),
      })
    : null;

  console.log("details", details);

  return (
    <Coordinates
      coordinates={marker ? [Number(latitude), Number(longitude)] : null}
      details={details?.data}
    />
  );
}
