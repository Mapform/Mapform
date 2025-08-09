"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@mapform/lib/classnames";

interface Feature {
  id: string;
  name: string;
  description?: string;
  icon: string | null;
  coordinates: [number, number];
  image?: {
    url: string;
    alt?: string;
    isLoading?: boolean;
  };
}

interface FeatureListProps {
  features: Feature[];
  onClick: (feature: Feature) => void;
}

export function FeatureList({ features, onClick }: FeatureListProps) {
  return (
    <ul className="flex w-full list-none flex-col gap-2 p-0">
      {features.map((feature) => (
        <li
          key={feature.id}
          className="m-0 flex cursor-pointer overflow-hidden rounded-lg border pl-0 transition-colors hover:border-gray-300 hover:bg-gray-50"
          onClick={() => {
            onClick(feature);
          }}
        >
          <div
            className={cn(
              "bg-muted relative flex size-16 flex-shrink-0 items-center justify-center",
              {
                "animate-pulse": feature.image?.isLoading,
              },
            )}
          >
            {feature.image?.url ? (
              <Image
                src={feature.image.url}
                alt={feature.image.alt ?? ""}
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
      ))}
    </ul>
  );
}
