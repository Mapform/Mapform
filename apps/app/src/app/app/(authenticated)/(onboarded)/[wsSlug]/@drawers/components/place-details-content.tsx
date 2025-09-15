"use client";

import { useEffect, useState } from "react";
import { MapDrawerToolbar } from "~/components/map-drawer";
import { Button } from "@mapform/ui/components/button";
import {
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
} from "lucide-react";
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
import type { Details } from "@mapform/backend/data/stadia/details";
import { useWorkspace } from "../../workspace-context";
import { useParamsContext } from "~/lib/params/client";

type Feature = NonNullable<Details["data"]>["features"][number];

interface PlaceDetailsContentProps {
  latitude: number;
  longitude: number;
  feature?: Feature;
  onClose: () => void | Promise<void>;
}

export function PlaceDetailsContent({
  latitude,
  longitude,
  feature,
  onClose,
}: PlaceDetailsContentProps) {
  const { setQueryStates } = useParamsContext();
  const { pId } = useParams<{ pId: string }>();
  const { workspaceDirectory } = useWorkspace();
  const { execute, isPending } = useAction(createRowAction, {
    onSuccess: async ({ data }) => {
      await onClose();
      await setQueryStates({ rowId: data?.id });
    },
  });

  const [projectComboboxOpen, setProjectComboboxOpen] = useState(false);
  const properties = feature?.properties;

  const wikidataId =
    properties?.addendum?.osm?.wikidata ??
    properties?.addendum?.whosonfirstConcordances?.wikidataId ??
    undefined;

  const website =
    properties?.addendum?.osm?.website ??
    properties?.addendum?.foursquare?.website;
  const phone =
    properties?.addendum?.osm?.phone ?? properties?.addendum?.foursquare?.tel;
  const address =
    properties?.formattedAddressLine ?? properties?.coarseLocation;
  const wikiData = useWikidataImages(wikidataId);

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
      name: placeName,
      stadiaId: properties?.gid,
      osmId: wikidataId,
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
  };

  const placeName = properties?.name ?? "Marked Location";

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
                name: placeName,
                stadiaId: properties?.gid,
                osmId: wikidataId,
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
                        keywords={[project.name || "New Map"]}
                      >
                        {project.name || "New Map"}
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
                    openInAppleMaps(latitude, longitude, placeName);
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
            void onClose();
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </MapDrawerToolbar>
      <Feature
        imageData={wikiData}
        title={placeName}
        properties={[
          ...(address
            ? ([
                {
                  columnName: "Address",
                  columnType: "string",
                  value: address,
                },
              ] as const)
            : []),
          ...(phone
            ? ([
                {
                  columnName: "Phone",
                  columnType: "string",
                  value: phone,
                },
              ] as const)
            : []),
          ...(website
            ? ([
                {
                  columnName: "Website",
                  columnType: "string",
                  value: website,
                },
              ] as const)
            : []),
        ]}
      />
    </>
  );
}
