"use client";

import Image from "next/image";
import {
  ImageIcon,
  PackageOpenIcon,
  SparklesIcon,
  Trash2Icon,
  ArrowUpRightIcon,
} from "lucide-react";
import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { useParamsContext } from "~/lib/params/client";
import { openInAppleMaps } from "~/lib/external-links/apple";
import { openInGoogleMaps } from "~/lib/external-links/google";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@mapform/ui/components/context-menu";
import { useAction } from "next-safe-action/hooks";
import { deleteRowsAction } from "~/data/rows/delete-rows";
import { useGeolocation } from "@mapform/lib/hooks/use-geolocation";
import { useParams } from "next/navigation";

interface Feature {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  latitude: number;
  longitude: number;
  image?: {
    url: string;
    alt?: string;
    isLoading?: boolean;
  };
  source: "stadia" | "mapform";
  wikidataId?: string;
}

interface FeatureListProps {
  features: Feature[];
  editable?: boolean;
  onClick: (feature: Feature) => void;
  onHover?: (feature: Feature | null) => void;
}

export function FeatureList({
  features,
  editable,
  onClick,
  onHover,
}: FeatureListProps) {
  const { setQueryStates } = useParamsContext();
  const { coords } = useGeolocation();
  const { pId } = useParams<{ pId?: string }>();

  if (!features.length) {
    return (
      <div className="flex flex-1 flex-col items-center gap-2 p-8 text-center">
        <PackageOpenIcon className="mx-auto size-6 text-gray-500" />
        <span className="text-foreground text-base font-medium">
          Map is empty
        </span>
        <Button
          onClick={() => {
            void setQueryStates({
              search: "1",
              chatId: null,
              query: null,
              chatOptions: {
                firstMessage: null,
                mapCenter: true,
                userCenter: !!coords,
                projects: pId ? [pId] : null,
              },
            });
          }}
          size="sm"
          variant="secondary"
        >
          <SparklesIcon className="size-4" />
          Search or ask...
        </Button>
      </div>
    );
  }

  return (
    <ul className="m-0 flex w-full list-none flex-col gap-2 p-0">
      {features.map((feature) => (
        <FeatureListItem
          key={feature.id}
          feature={feature}
          onClick={onClick}
          onHover={onHover}
          editable={editable}
        />
      ))}
    </ul>
  );
}

function FeatureListItem({
  feature,
  onClick,
  onHover,
  editable,
}: {
  feature: Feature;
  onClick: (feature: Feature) => void;
  onHover?: (feature: Feature | null) => void;
  editable?: boolean;
}) {
  const { setQueryStates } = useParamsContext();
  const { executeAsync } = useAction(deleteRowsAction, {
    onSuccess: () => {
      void setQueryStates({ rowId: null });
    },
  });
  const effectiveImageUrl = feature.image?.url;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <li
          className="m-0 flex cursor-pointer overflow-hidden rounded-lg border pl-0 transition-colors hover:border-gray-300 hover:bg-gray-50"
          onClick={() => {
            onClick(feature);
          }}
          onMouseEnter={() => onHover?.(feature)}
          onMouseLeave={() => onHover?.(null)}
        >
          <div
            className={cn(
              "bg-muted relative flex size-16 flex-shrink-0 items-center justify-center",
              {
                "animate-pulse": feature.image?.isLoading,
              },
            )}
          >
            {effectiveImageUrl ? (
              <Image
                src={effectiveImageUrl}
                alt={feature.image?.alt ?? ""}
                fill
                objectFit="cover"
                className="m-0"
              />
            ) : (
              <ImageIcon className="size-4 text-gray-400" />
            )}
          </div>
          <div className="flex flex-col justify-center gap-1 truncate p-2">
            <div className="flex truncate">
              {feature.icon && <div className="mr-1">{feature.icon}</div>}
              <h6 className="m-0 truncate font-medium">{feature.name}</h6>
            </div>
            {feature.description && (
              <p className="m-0 truncate text-xs text-gray-500">
                {feature.description}
              </p>
            )}
          </div>
        </li>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ArrowUpRightIcon className="mr-2 size-4" /> Open In
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              onClick={() => {
                onClick(feature);
              }}
            >
              New Drawer
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => {
                openInGoogleMaps(feature.latitude, feature.longitude);
              }}
            >
              Google Maps
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                openInAppleMaps(
                  feature.latitude,
                  feature.longitude,
                  feature.name,
                );
              }}
            >
              Apple Maps
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        {editable && (
          <ContextMenuItem
            className="gap-2"
            onClick={() => {
              void executeAsync({
                rowIds: [feature.id],
              });
            }}
          >
            <Trash2Icon className="size-4" /> Delete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
