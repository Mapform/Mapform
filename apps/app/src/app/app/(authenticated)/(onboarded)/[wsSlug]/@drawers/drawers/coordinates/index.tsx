"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";
import { useParamsContext } from "~/lib/params/client";
import { Marker } from "react-map-gl/mapbox";
import { Button } from "@mapform/ui/components/button";
import {
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { BasicSkeleton } from "~/components/skeletons/basic";
import { Feature } from "~/components/feature";
import { useWikidataImages } from "~/lib/wikidata-image";
import {
  DropdownMenu,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@mapform/ui/components/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { useMap } from "react-map-gl/mapbox";
import { openInGoogleMaps } from "~/lib/external-links/google";
import { openInAppleMaps } from "~/lib/external-links/apple";
import { useAction } from "next-safe-action/hooks";
import { createRowAction } from "~/data/rows/create-row";
import { useParams } from "next/navigation";
import { useWorkspace } from "../../../workspace-context";
import { useEffect, useState } from "react";

interface CoordinatesProps {
  coordinates: [number, number] | null;
  geoapifyPlaceDetails: GetPlaceDetails["data"];
}

export function Coordinates({
  coordinates,
  geoapifyPlaceDetails,
}: CoordinatesProps) {
  const { drawerDepth, isPending, setQueryStates } = useParamsContext();

  return (
    <MapDrawer
      open={!!coordinates}
      depth={drawerDepth.get("geoapifyPlaceId") ?? 0}
    >
      {isPending ? (
        <>
          <MapDrawerToolbar>
            <Button
              className="ml-auto"
              size="icon-sm"
              type="button"
              variant="ghost"
              onClick={() => {
                console.log("clicked");
                void setQueryStates({ latitude: null, longitude: null });
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </MapDrawerToolbar>
          <BasicSkeleton className="p-6" />
        </>
      ) : (
        <SearchDetailsInner
          coordinates={coordinates}
          geoapifyPlaceDetails={geoapifyPlaceDetails}
        />
      )}
    </MapDrawer>
  );
}

function SearchDetailsInner({
  coordinates,
  geoapifyPlaceDetails,
}: CoordinatesProps) {
  const map = useMap();
  const { setQueryStates } = useParamsContext();
  const { pId } = useParams<{ pId: string }>();
  const { workspaceDirectory } = useWorkspace();
  const { execute, isPending } = useAction(createRowAction, {
    onSuccess: async ({ data }) => {
      await setQueryStates({ latitude: null, longitude: null });
      await setQueryStates({ rowId: data?.id });
    },
  });

  const [projectComboboxOpen, setProjectComboboxOpen] = useState(false);

  const wikiData = useWikidataImages(
    geoapifyPlaceDetails?.features[0]?.properties.datasource?.raw?.wikidata,
  );

  const longitude = coordinates?.[1];
  const latitude = coordinates?.[0];

  useEffect(() => {
    if (!longitude || !latitude) return;

    try {
      map.current?.easeTo({
        center: [longitude, latitude],
      });
    } catch (error) {
      console.error(error);
    }
  }, [longitude, latitude, map]);

  const place = geoapifyPlaceDetails?.features[0]?.properties;

  if (!longitude || !latitude || !place) return null;

  // Flatten all projects from all teamspaces
  const allProjects = workspaceDirectory.teamspaces
    .flatMap((teamspace) =>
      teamspace.projects.map((project) => ({
        ...project,
        teamspaceName: teamspace.name,
      })),
    )
    .sort((a, b) => a.position - b.position);

  const handleAddToProject = (projectId: string) => {
    execute({
      projectId,
      name: place.name_international?.en,

      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
  };

  return (
    <>
      <MapDrawerToolbar>
        {pId ? (
          <Button
            className="ml-auto"
            size="icon-sm"
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={() => {
              execute({
                projectId: pId,
                name: place.name_international?.en ?? place.name,
                geoapifyPlaceId: place.place_id,
                geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
              });
            }}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <PlusIcon className="size-4" />
            )}
          </Button>
        ) : (
          <Popover
            open={projectComboboxOpen}
            onOpenChange={setProjectComboboxOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                size="icon-sm"
                aria-expanded={projectComboboxOpen}
                className="ml-auto"
                disabled={isPending}
              >
                <PlusIcon className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search projects..." />
                <CommandList>
                  <CommandEmpty>No projects found.</CommandEmpty>
                  <CommandGroup>
                    {allProjects.map((project) => (
                      <CommandItem
                        key={project.id}
                        value={`${project.id}`}
                        onSelect={() => {
                          setProjectComboboxOpen(false);
                          handleAddToProject(project.id);
                        }}
                        keywords={[project.name ?? "New Map"]}
                      >
                        {project.name ?? "New Map"}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" type="button" variant="ghost">
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ExternalLinkIcon className="size-4" /> Open In
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    openInGoogleMaps(latitude, longitude);
                  }}
                >
                  Google Maps
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    openInAppleMaps(
                      latitude,
                      longitude,
                      place.name_international?.en ?? place.name ?? "Location",
                    );
                  }}
                >
                  Apple Maps
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ latitude: null, longitude: null });
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </MapDrawerToolbar>
      <Feature
        imageData={wikiData}
        title={place.name_international?.en ?? place.name ?? ""}
        // description={geoapifyPlaceDetails.features[0]?.properties.description}
        // icon={geoapifyPlaceDetails.features[0]?.properties.icon}
        properties={[
          {
            columnName: "Address",
            columnType: "string",
            value: place.address_line2,
          },
          ...(place.phone
            ? ([
                {
                  columnName: "Phone",
                  columnType: "string",
                  value: place.phone,
                },
              ] as const)
            : []),
          ...(place.website
            ? ([
                {
                  columnName: "Website",
                  columnType: "string",
                  value: place.website,
                },
              ] as const)
            : []),
          ...(place.population
            ? ([
                {
                  columnName: "Population",
                  columnType: "number",
                  value: place.population,
                },
              ] as const)
            : []),
        ]}
      />

      <Marker longitude={longitude} latitude={latitude} scale={1.5} />
    </>
  );
}
