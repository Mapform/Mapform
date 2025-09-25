import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "~/lib/params/server";
import { Search } from "./search";
import { cache, Suspense } from "react";
import { authDataService, publicDataService } from "~/lib/safe-action";
import { Chat } from "./chat";
import { ChatDrawers } from "./chat/drawers";
import { SearchDetails } from "./search-details";
import { Feature, FeatureWrapper } from "./feature";
import type { ChatMessage } from "~/lib/types";
import { Coordinates } from "./coordinates";
import { BasicSkeleton } from "~/components/skeletons/basic";

interface DealDrawerProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ wsSlug: string; pId?: string }>;
}

export async function Drawers(props: DealDrawerProps) {
  const { rowId } = await loadSearchParams(props.searchParams);

  return (
    <>
      <SearchDrawer {...props} />
      <ChatDrawers>
        <ChatDrawer {...props} />
      </ChatDrawers>
      <SearchDetailsDrawer {...props} />
      <FeatureWrapper>
        <Suspense
          key={rowId ?? "no-row"}
          fallback={<BasicSkeleton className="p-6" />}
        >
          <FeatureDrawer {...props} />
        </Suspense>
      </FeatureWrapper>
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

  const chatWithMessages =
    chatId && chatId !== "new"
      ? await authDataService.getMessages({
          chatId,
        })
      : null;

  return (
    <Chat
      key={chatId}
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

async function FeatureDrawer({ searchParams, params }: DealDrawerProps) {
  const { pId } = await params;
  const { rowId } = await loadSearchParams(searchParams);

  const [row, project] = await Promise.all([
    rowId ? authDataService.getRow({ rowId }) : null,
    pId ? authDataService.getProject({ projectId: pId }) : null,
  ]);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return <Feature feature={row?.data} project={project?.data} />;
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
