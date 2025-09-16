import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "~/lib/params/server";
import { Search } from "./search";
import { cache } from "react";
import { authDataService, publicDataService } from "~/lib/safe-action";
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
    const searchResults = await publicDataService.search({
      query,
      bounds,
    });
    return searchResults;
  },
);

const getVectorSearchResults = cache(
  async (query: string, workspaceSlug: string, projectId?: string) => {
    const searchResults = await authDataService.searchRows(
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
      authDataService.listChats({ projectId: pId }),
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

  const chatWithMessages = chatId
    ? await authDataService.getMessages({
        chatId,
      })
    : null;

  return (
    <Chat
      chatWithMessages={
        chatWithMessages?.data as
          | {
              messages?: ChatMessage[] | undefined;
              chatId: string;
            }
          | undefined
      }
    />
  );
}

const getDetails = cache(async (id: string | null) => {
  if (!id) return null;

  const placeDetails = await publicDataService.details({
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
    rowId ? authDataService.getRow({ rowId }) : null,
  ]);

  return <Feature feature={row?.data} />;
}

async function CoordinatesDrawer({ searchParams }: DealDrawerProps) {
  const { marker } = await loadSearchParams(searchParams);

  const [latitude, longitude] = marker?.split(",") ?? [];

  const details = marker
    ? await publicDataService.reverseGeocode({
        lat: Number(latitude),
        lng: Number(longitude),
      })
    : null;

  return (
    <Coordinates
      coordinates={marker ? [Number(latitude), Number(longitude)] : null}
      details={details?.data}
    />
  );
}
