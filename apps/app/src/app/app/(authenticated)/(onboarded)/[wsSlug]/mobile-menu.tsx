"use client";

import { Button } from "@mapform/ui/components/button";
import { useSidebar } from "@mapform/ui/components/sidebar";
import { toast } from "@mapform/ui/components/toaster";
import { MapPlusIcon, MenuIcon, SparklesIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createProjectAction } from "~/data/projects/create-project";
import { useParamsContext } from "~/lib/params/client";
import { useWorkspace } from "./workspace-context";
import { useAuth } from "~/app/root-providers";
import { useMap } from "react-map-gl/maplibre";

export function MobileMenu() {
  const map = useMap();
  const { user } = useAuth();
  const { params } = useParamsContext();
  const { openMobile, setOpenMobile } = useSidebar();
  const { drawerDepth, setQueryStates } = useParamsContext();
  const { workspaceDirectory } = useWorkspace();

  const { execute, isPending } = useAction(createProjectAction, {
    onError: ({ error }) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          error.serverError ?? "There was an error creating the project.",
      });
    },
  });

  const usersPrivateTeamspace = workspaceDirectory.teamspaces.find(
    (teamspace) => teamspace.isPrivate && teamspace.ownerUserId === user?.id,
  );

  return (
    <div className="fixed bottom-4 left-1/2 z-30 mx-auto flex max-w-[calc(100%-2rem)] -translate-x-1/2 gap-1 rounded-full border bg-white/90 px-3 py-1 shadow-md backdrop-blur-sm md:hidden">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setOpenMobile(!openMobile)}
      >
        <MenuIcon className="size-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={async () => {
          const searchDepth = drawerDepth.get("search");

          if (params.search === "1" && searchDepth && searchDepth > 0) {
            await setQueryStates({
              search: null,
            });

            await setQueryStates({
              search: "1",
            });

            return;
          }

          void setQueryStates({
            search: params.search === "1" ? null : "1",
            chatId: null,
            query: null,
          });
        }}
      >
        <SparklesIcon className="size-4" /> Search and ask...
      </Button>
      <Button
        variant="ghost"
        disabled={isPending}
        onClick={() => {
          if (!usersPrivateTeamspace) {
            console.error("User is not part of a private teamspace");
            return;
          }

          execute({
            teamspaceId: usersPrivateTeamspace.id,
            viewType: "map",
            center: map.current?.getCenter().toArray() as [number, number],
            pitch: map.current?.getPitch(),
            bearing: map.current?.getBearing(),
            zoom: map.current?.getZoom(),
          });
        }}
      >
        <MapPlusIcon className="size-4" />
      </Button>
    </div>
  );
}
