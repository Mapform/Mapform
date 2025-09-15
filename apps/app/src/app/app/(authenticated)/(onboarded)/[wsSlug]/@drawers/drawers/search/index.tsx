"use client";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandPrimitive,
} from "@mapform/ui/components/command";
import {
  BoxIcon,
  GlobeIcon,
  Loader2,
  MessageCircle,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { useMap } from "react-map-gl/mapbox";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { useEffect, useState } from "react";
import type { SearchRows } from "@mapform/backend/data/rows/search-rows";
import type { Search } from "@mapform/backend/data/stadia/search";
import { Button } from "@mapform/ui/components/button";
import type { ListChats } from "@mapform/backend/data/chats/list-chats";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mapform/ui/components/context-menu";
import { useAction } from "next-safe-action/hooks";
import { deleteChatAction } from "~/data/chats/delete-chat";
import { toast } from "@mapform/ui/components/toaster";

interface SearchProps {
  searchResults?: Search["data"];
  vectorSearchResults?: SearchRows["data"];
  previousChats?: ListChats["data"];
}

export function Search({
  searchResults,
  vectorSearchResults,
  previousChats,
}: SearchProps) {
  const { params, drawerDepth } = useParamsContext();

  return (
    <MapDrawer open={!!params.search} depth={drawerDepth.get("search") ?? 0}>
      <SearchInner
        searchResults={searchResults}
        vectorSearchResults={vectorSearchResults}
        previousChats={previousChats}
      />
    </MapDrawer>
  );
}

export function SearchInner({
  searchResults,
  vectorSearchResults,
  previousChats,
}: SearchProps) {
  const map = useMap();
  const { params, setQueryStates, isPending } = useParamsContext();
  const [searchQuery, setSearchQuery] = useState(params.query);
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const filteredFeatures = searchResults?.features;

  useEffect(() => {
    void setQueryStates({ query: debouncedSearchQuery });
  }, [debouncedSearchQuery, setQueryStates]);

  return (
    <>
      <Command className="bg-transparent" shouldFilter={false}>
        <MapDrawerToolbar className="border-b">
          <div
            className="hover:bg-muted focus-within:ring-ring focus-within:bg-muted relative flex flex-1 items-center rounded-md pl-3 pr-1 transition-all focus-within:ring-2"
            cmdk-input-wrapper=""
          >
            {isPending && searchQuery && searchQuery.length > 0 ? (
              <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
            ) : (
              <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            )}
            <CommandPrimitive.Input
              className="placeholder:text-muted-foreground flex h-9 w-full rounded-md border-none bg-transparent px-1 py-3 pr-8 text-base outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Search or ask..."
              onValueChange={setSearchQuery}
              value={searchQuery ?? ""}
              autoFocus
            />
            <Button
              className="absolute right-0 top-0"
              variant="ghost"
              size="icon"
              onClick={() => {
                void setQueryStates({ search: null, query: null });
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </MapDrawerToolbar>
        <CommandList className="max-h-full p-2">
          <CommandGroup>
            {searchQuery && (
              <CommandItem
                onSelect={async () => {
                  const randomId = crypto.randomUUID();

                  await setQueryStates({
                    query: searchQuery,
                    chatId: randomId,
                  });
                }}
              >
                <MessageCircle className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                <span className="truncate">{searchQuery}</span>
                <span className="text-muted-foreground ml-1 flex-shrink-0">
                  — New Chat
                </span>
              </CommandItem>
            )}
            {vectorSearchResults?.map((result) => (
              <CommandItem
                key={result.id}
                value={result.id}
                onSelect={async () => {
                  map.current?.easeTo({
                    center: result.center.coordinates as [number, number],
                    duration: 1000,
                  });
                  await setQueryStates({ rowId: result.id });
                }}
              >
                {result.icon ? (
                  <span className="text-muted-foreground mr-2 flex-shrink-0">
                    {result.icon}
                  </span>
                ) : (
                  <BoxIcon className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                )}
                <span className="truncate">
                  {result.name || "Unnamed feature"}
                </span>
                <span className="text-muted-foreground ml-1 flex-shrink-0">
                  {" "}
                  — {result.projectName || "New Map"}
                </span>
              </CommandItem>
            ))}
            {filteredFeatures?.map((feature) => (
              <CommandItem
                key={feature.properties.gid}
                value={feature.properties.gid}
                onSelect={async () => {
                  if (feature.bbox) {
                    map.current?.fitBounds(
                      feature.bbox as [number, number, number, number],
                      {
                        padding: 50,
                        duration: 1000,
                      },
                    );
                  } else {
                    map.current?.easeTo({
                      center: feature.geometry?.coordinates as [number, number],
                      duration: 1000,
                    });
                  }

                  await setQueryStates({
                    stadiaId: feature.properties.gid,
                  });
                }}
              >
                <GlobeIcon className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                <span className="truncate">
                  {feature.properties.name}
                  {feature.properties.coarseLocation && (
                    <span className="text-muted-foreground ml-1 flex-shrink-0">
                      {" — "}
                      {feature.properties.coarseLocation}
                    </span>
                  )}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          {previousChats && previousChats.length > 0 && (
            <CommandGroup heading="Chats">
              {previousChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </>
  );
}

function ChatItem({ chat }: { chat: NonNullable<ListChats["data"]>[number] }) {
  const { setQueryStates } = useParamsContext();
  const { execute: deleteChat, isPending: isDeletingChat } = useAction(
    deleteChatAction,
    {
      onError: ({ error }) => {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            error.serverError ?? "There was an error deleting the chat.",
        });
      },
    },
  );

  return (
    <ContextMenu key={chat.id}>
      <ContextMenuTrigger asChild>
        <CommandItem
          value={chat.id}
          disabled={isDeletingChat}
          onSelect={async () => {
            await setQueryStates({ chatId: chat.id }, { shallow: false });
          }}
        >
          <MessageCircle className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
          <span className="truncate">{chat.title}</span>
        </CommandItem>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            void deleteChat({ id: chat.id });
          }}
        >
          <TrashIcon className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
