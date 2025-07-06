import { useWikidataImages } from "~/lib/wikidata-image";
import { Badge } from "@mapform/ui/components/badge";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { Button } from "@mapform/ui/components/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface WikidataImagesGalleryProps {
  wikidataId: string;
  placeName?: string;
  maxImages?: number;
}

// Property labels for better display
const PROPERTY_LABELS: Record<string, string> = {
  P18: "Main Image",
  P3451: "Poster",
  P154: "Logo",
  P41: "Flag",
  P94: "Coat of Arms",
  P242: "Map",
  P2716: "Collage",
  P4291: "Panoramic View",
  P4292: "Interior",
  P4293: "Exterior",
  P4294: "Aerial View",
  P4295: "Night View",
  P4296: "Seasonal",
  P4297: "Historical",
  P4298: "Detail",
  P4299: "Close-up",
  P4300: "Wide View",
};

export function WikidataImagesGallery({
  wikidataId,
  placeName = "Place",
  maxImages = 10,
}: WikidataImagesGalleryProps) {
  const { images, primaryImage, isLoading, error } =
    useWikidataImages(wikidataId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Error loading images: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Wikidata Images</Badge>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          No images available for this place
        </p>
      </div>
    );
  }

  const displayImages = images.slice(0, maxImages);
  const currentImage = displayImages[currentImageIndex];

  // Safety check - this shouldn't happen but TypeScript needs it
  if (!currentImage) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Wikidata Images</Badge>
          <span className="text-sm text-gray-500">
            {images.length} image{images.length !== 1 ? "s" : ""} • {wikidataId}
          </span>
        </div>
        {primaryImage && primaryImage !== currentImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const primaryIndex = displayImages.findIndex(
                (img) => img === primaryImage,
              );
              if (primaryIndex !== -1) {
                setCurrentImageIndex(primaryIndex);
              }
            }}
          >
            Show Primary
          </Button>
        )}
      </div>

      {/* Main Image Display */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          fill
          src={currentImage.imageUrl}
          alt={`${placeName} - ${PROPERTY_LABELS[currentImage.property] || currentImage.property}`}
          className="object-cover"
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? displayImages.length - 1 : prev - 1,
                )
              }
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === displayImages.length - 1 ? 0 : prev + 1,
                )
              }
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <Badge variant="secondary" className="text-xs">
                {PROPERTY_LABELS[currentImage.property] ||
                  currentImage.property}
              </Badge>
              {currentImage.rank === "preferred" && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Preferred
                </Badge>
              )}
            </div>
            <span className="text-sm">
              {currentImageIndex + 1} / {displayImages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      {currentImage.attribution && (
        <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
          <h4 className="text-sm font-medium text-gray-900">Attribution</h4>

          {currentImage.attribution.author && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Author:</span>{" "}
              {currentImage.attribution.author}
            </div>
          )}

          {currentImage.attribution.license && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">License:</span>{" "}
              {currentImage.attribution.license}
              {currentImage.attribution.licenseUrl && (
                <a
                  href={currentImage.attribution.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  (View)
                </a>
              )}
            </div>
          )}

          {currentImage.attribution.sourceUrl && (
            <div className="text-xs">
              <a
                href={currentImage.attribution.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                View on Wikimedia Commons
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">All Images</h4>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
            {displayImages.map((image, index) => (
              <button
                key={`${image.property}-${index}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:opacity-80 ${
                  index === currentImageIndex
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  fill
                  src={image.imageUrl}
                  alt={`${placeName} - ${PROPERTY_LABELS[image.property] || image.property}`}
                  className="object-cover"
                />
                {image.rank === "preferred" && (
                  <div className="absolute right-1 top-1">
                    <Badge variant="secondary" className="text-xs">
                      ★
                    </Badge>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wikidata Link */}
      <div className="text-xs text-gray-500">
        <a
          href={`https://www.wikidata.org/wiki/${wikidataId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          View on Wikidata
          <ExternalLinkIcon className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
