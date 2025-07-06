import { useWikidataImages } from "~/lib/wikidata-image";
import { Badge } from "@mapform/ui/components/badge";
import { Skeleton } from "@mapform/ui/components/skeleton";
import Image from "next/image";

interface WikidataMultipleImagesExampleProps {
  wikidataId: string;
  placeName?: string;
}

// Property labels for display
const PROPERTY_LABELS: Record<string, string> = {
  P18: "Main Image",
  P3451: "Poster",
  P154: "Logo",
  P41: "Flag",
  P94: "Coat of Arms",
  P242: "Map",
  P2716: "Collage",
  P4291: "Panoramic",
  P4292: "Interior",
  P4293: "Exterior",
  P4294: "Aerial",
  P4295: "Night",
  P4296: "Seasonal",
  P4297: "Historical",
  P4298: "Detail",
  P4299: "Close-up",
  P4300: "Wide",
};

export function WikidataMultipleImagesExample({
  wikidataId,
  placeName = "Place",
}: WikidataMultipleImagesExampleProps) {
  const { images, primaryImage, isLoading, error } =
    useWikidataImages(wikidataId);

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
          <Badge variant="outline">Loading Images...</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Wikidata Images</Badge>
          <span className="text-sm text-gray-500">
            {images.length} image{images.length !== 1 ? "s" : ""} • {wikidataId}
          </span>
        </div>
        {primaryImage && (
          <Badge variant="secondary">
            Primary:{" "}
            {PROPERTY_LABELS[primaryImage.property] || primaryImage.property}
          </Badge>
        )}
      </div>

      {/* Primary Image */}
      {primaryImage && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Primary Image</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              fill
              src={primaryImage.imageUrl}
              alt={`${placeName} - ${PROPERTY_LABELS[primaryImage.property] || primaryImage.property}`}
              className="object-cover"
            />
          </div>
          {primaryImage.attribution?.author && (
            <p className="text-xs text-gray-600">
              Photo by: {primaryImage.attribution.author}
            </p>
          )}
        </div>
      )}

      {/* All Images Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">All Images</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={`${image.property}-${index}`} className="space-y-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  fill
                  src={image.imageUrl}
                  alt={`${placeName} - ${PROPERTY_LABELS[image.property] || image.property}`}
                  className="object-cover"
                />
                {image.rank === "preferred" && (
                  <div className="absolute right-2 top-2">
                    <Badge variant="secondary" className="text-xs">
                      ★
                    </Badge>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">
                  {PROPERTY_LABELS[image.property] || image.property}
                </Badge>
                {image.attribution?.author && (
                  <p className="text-xs text-gray-600">
                    By: {image.attribution.author}
                  </p>
                )}
                {image.attribution?.license && (
                  <p className="text-xs text-gray-500">
                    {image.attribution.license}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Types Summary */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Image Types Found</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(images.map((img) => img.property))).map(
            (property) => (
              <Badge key={property} variant="outline">
                {PROPERTY_LABELS[property] || property}:{" "}
                {images.filter((img) => img.property === property).length}
              </Badge>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
