"use client";

import { cn } from "@mapform/lib/classnames";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import { Input } from "@mapform/ui/components/input";
import { MessageCircle, BoxIcon, GlobeIcon } from "lucide-react";
import { map } from "zod";
import { useParamsContext } from "~/lib/params/client";
import { useProject } from "../../[pId]/context";
import { MapDrawer } from "~/components/map-drawer";

export function ChatDrawer() {
  const { params, setQueryStates } = useParamsContext();
  // const { projectService, vectorSearchResults, geoapifySearchResults } = useProject();

  return (
    <MapDrawer open={params.chatId !== null} depth={0}>
      <div>Chat</div>
    </MapDrawer>
  );
}
