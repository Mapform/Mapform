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
  LocateIcon,
  MapIcon,
  MessageCircle,
  NavigationIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { MapPositioner } from "~/lib/map/map-positioner";
import { useMap } from "react-map-gl/maplibre";
import { useWorkspace } from "../../../workspace-context";

interface SearchProps {
  searchResults?: Search["data"];
  vectorSearchResults?: SearchRows["data"];
  previousChats?: ListChats["data"];
}

export function SearchWrapper({ children }: { children: React.ReactNode }) {
  const { params, drawerDepth } = useParamsContext();

  return (
    <MapDrawer open={!!params.search} depth={drawerDepth.get("search") ?? 0}>
      {children}
    </MapDrawer>
  );
}

export function Search({
  searchResults,
  vectorSearchResults,
  previousChats,
}: SearchProps) {
  const map = useMap();
  const { workspaceDirectory } = useWorkspace();
  const { params, setQueryStates, isPending, drawerDepth } = useParamsContext();
  const [query, setQuery] = useState(params.query);
  const debouncedSearchQuery = useDebounce(query, 200);

  const filteredFeatures = searchResults?.features;

  useEffect(() => {
    const center = map.current?.getCenter().toArray().reverse();
    void setQueryStates({
      query: debouncedSearchQuery,
      // Set the location explicitly so the server can use it for searching
      center: center as [number, number],
    });
  }, [debouncedSearchQuery, setQueryStates, map]);

  useEffect(() => {
    setQuery(params.query);
  }, [params.query]);

  return (
    <MapPositioner disabled={drawerDepth.get("search") !== 0}>
      <Command className="overflow-visible bg-transparent" shouldFilter={false}>
        <MapDrawerToolbar className="border-b">
          <div
            className="relative flex flex-1 flex-col gap-2 rounded-md pl-1"
            cmdk-input-wrapper=""
          >
            <div className="flex flex-1 items-center">
              {isPending && query && query.length > 0 ? (
                <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
              ) : (
                <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
              )}
              <CommandPrimitive.Input
                className="placeholder:text-muted-foreground flex h-9 w-full rounded-md border-none bg-transparent py-3 pl-0 pr-8 !text-base outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Search or ask..."
                onValueChange={setQuery}
                value={query ?? ""}
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
            <div className="flex justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="text-muted-foreground !p-0"
                    style={{
                      background: "none",
                    }}
                    variant="ghost"
                  >
                    <PlusIcon className="size-4" />
                    Add Context
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <MapIcon className="size-4" />
                      Maps
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {workspaceDirectory.teamspaces
                        .flatMap((teamspace) =>
                          teamspace.projects.flatMap((project) => project),
                        )
                        .map((project) => (
                          <DropdownMenuCheckboxItem key={project.id}>
                            {project.icon ? (
                              <span>{project.icon}</span>
                            ) : (
                              <MapIcon className="size-4" />
                            )}
                            {project.name || "New Map"}
                          </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuCheckboxItem>
                    <LocateIcon className="size-4" />
                    Map center
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    <NavigationIcon className="size-4" />
                    Your location
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="ml-auto" type="submit" size="icon">
                <SendIcon className="size-4" />
              </Button>
            </div>
          </div>
        </MapDrawerToolbar>
        <CommandList className="max-h-full p-2">
          <CommandGroup>
            {query && (
              <CommandItem
                onSelect={() => {
                  void setQueryStates({ chatId: "new", query });
                }}
              >
                <MessageCircle className="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                <span className="truncate">{query}</span>
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
                  await setQueryStates({
                    rowId: result.id,
                    location: null,
                    zoom: null,
                    pitch: null,
                    bearing: null,
                  });
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
                  await setQueryStates({
                    stadiaId: feature.properties.gid,
                    location: null,
                    zoom: null,
                    pitch: null,
                    bearing: null,
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
    </MapPositioner>
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
