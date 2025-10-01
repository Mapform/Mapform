import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "~/lib/params/server";
import { Search, SearchWrapper } from "./search";
import { cache } from "react";
import { authDataService, publicDataService } from "~/lib/safe-action";
import { Chat, ChatWrapper } from "./chat";
import {
  SearchDetails,
  SearchDetailsEmpty,
  SearchDetailsWrapper,
} from "./search-details";
import { FeatureWrapper, FeatureEmpty, FeatureContent } from "./feature";
import type { ChatMessage } from "~/lib/types";
import { Coordinates, CoordinatesWrapper } from "./coordinates";

interface DealDrawerProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ wsSlug: string; pId?: string }>;
}

export function Drawers(props: DealDrawerProps) {
  return (
    <>
      <SearchWrapper>
        <SearchDrawer {...props} />
      </SearchWrapper>

      <ChatWrapper>
        <ChatDrawer {...props} />
      </ChatWrapper>

      <SearchDetailsWrapper>
        <SearchDetailsDrawer {...props} />
      </SearchDetailsWrapper>

      <FeatureWrapper>
        <Feature {...props} />
      </FeatureWrapper>

      <CoordinatesWrapper>
        <CoordinatesDrawer {...props} />
      </CoordinatesWrapper>
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
  async (query: string, workspaceSlug: string, projectIds?: string[]) => {
    const searchResults = await authDataService.searchRows(
      projectIds
        ? {
            query,
            projectIds,
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
  const { query, search, chatOptions } = await loadSearchParams(searchParams);
  const { wsSlug } = await params;

  const projectIds = chatOptions?.projects;

  const [searchResults, vectorSearchResults, previousChats] = await Promise.all(
    [
      query && search ? getSearchResults(query, undefined) : null,
      query && search
        ? getVectorSearchResults(query, wsSlug, projectIds)
        : null,
      authDataService.listChats({}),
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

async function ChatDrawer({ searchParams, params }: DealDrawerProps) {
  const { wsSlug } = await params;
  const { chatId } = await loadSearchParams(searchParams);

  const [chatWithMessages, usage] = await Promise.all([
    chatId && chatId !== "new" ? authDataService.getMessages({ chatId }) : null,
    authDataService.getAiTokenUsage({ workspaceSlug: wsSlug }),
  ]);

  return (
    <Chat
      key={chatId}
      chatWithMessages={
        chatWithMessages?.data as
          | {
              messages?: ChatMessage[] | undefined;
              chatId: string;
              chatTitle: string;
            }
          | undefined
      }
      usage={usage?.data}
    />
  );
}

const getDetails = cache(async (id: string | null) => {
  if (!id) return null;

  const placeDetails = await publicDataService.details({
    osmId: id,
  });

  return placeDetails;
});

async function SearchDetailsDrawer({ searchParams }: DealDrawerProps) {
  const { stadiaId } = await loadSearchParams(searchParams);

  const details = await getDetails(stadiaId);

  if (stadiaId && !details?.data) {
    return <SearchDetailsEmpty />;
  }

  return <SearchDetails details={details?.data} />;
}

async function Feature({ searchParams }: DealDrawerProps) {
  const { rowId } = await loadSearchParams(searchParams);

  const row = rowId ? await authDataService.getRow({ rowId }) : null;

  if (rowId && !row?.data) {
    return <FeatureEmpty />;
  }

  const project = row?.data?.project.id
    ? await authDataService.getProject({
        projectId: row.data.project.id,
      })
    : null;

  if (row?.data?.project.id && !project?.data) {
    return <FeatureEmpty />;
  }

  return <FeatureContent feature={row?.data} project={project?.data} />;
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
      details={details ?? null}
    />
  );
}
