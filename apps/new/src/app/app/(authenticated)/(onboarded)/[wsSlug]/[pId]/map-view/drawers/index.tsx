import { useMediaQuery } from "@mapform/ui/hooks/use-media-query";
import { Header } from "../../header";
import { FeatureDrawer } from "./feature-drawer";
import { useProject } from "../../context";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { useMap } from "~/components/map";
import { useParamsContext } from "~/lib/params/client";
import { DetailsDrawer } from "./details-drawer";
import { MapDrawer, MapDrawerActions } from "~/components/map-drawer";
import { useRef } from "react";
import { Search } from "../../search";

interface MapDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export function Drawers({ drawerOpen, setDrawerOpen }: MapDrawerProps) {
  const { map } = useMap();
  const { projectService } = useProject();
  const {
    params: { rowId, geoapifyPlaceId },
    setQueryStates,
  } = useParamsContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const mapDrawerRef = useRef<HTMLDivElement>(null);

  if (isDesktop) {
    return (
      <>
        <MapDrawer
          ref={mapDrawerRef}
          open={drawerOpen}
          depth={rowId || geoapifyPlaceId ? 1 : 0}
        >
          <MapDrawerActions>
            <Search ref={mapDrawerRef} />
            <Button
              className="absolute right-2 top-2 z-30"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => {
                setDrawerOpen(false);
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </MapDrawerActions>
          <Header />
          <ul className="flex flex-col gap-2">
            {projectService.optimisticState.rows.map((row) => (
              <li
                key={row.id}
                className="cursor-pointer rounded-lg border p-2 transition-colors hover:border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  void setQueryStates({ rowId: row.id });

                  map?.flyTo({
                    center: row.center.coordinates as [number, number],
                    duration: 500,
                  });
                }}
              >
                {row.name}
              </li>
            ))}
          </ul>
        </MapDrawer>
        <FeatureDrawer />
        <DetailsDrawer />
      </>
    );
  }

  // Mobile
  return <div>TODO</div>;
}
