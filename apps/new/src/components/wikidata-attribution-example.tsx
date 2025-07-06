import { useWikidataImage } from "~/lib/wikidata-image";
import { Badge } from "@mapform/ui/components/badge";
import { Skeleton } from "@mapform/ui/components/skeleton";
import Image from "next/image";

interface WikidataAttributionExampleProps {
  wikidataId: string;
  placeName?: string;
}

export function WikidataAttributionExample({
  wikidataId,
  placeName = "Place",
}: WikidataAttributionExampleProps) {
  const { imageUrl, attribution, isLoading, error } =
    useWikidataImage(wikidataId);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Error loading image: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Wikidata Image</Badge>
        <span className="text-sm text-gray-500">ID: {wikidataId}</span>
      </div>

      {/* Image Display */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : imageUrl ? (
          <Image
            fill
            src={imageUrl}
            alt={`${placeName} cover photo`}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No image available
          </div>
        )}
      </div>

      {/* Attribution Information */}
      {attribution && (
        <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
          <h4 className="text-sm font-medium text-gray-900">Attribution</h4>

          {attribution.author && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Author:</span> {attribution.author}
            </div>
          )}

          {attribution.license && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">License:</span>{" "}
              {attribution.license}
              {attribution.licenseUrl && (
                <a
                  href={attribution.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  (View)
                </a>
              )}
            </div>
          )}

          {attribution.dateCreated && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Date:</span>{" "}
              {attribution.dateCreated}
            </div>
          )}

          {attribution.description && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Description:</span>{" "}
              {attribution.description}
            </div>
          )}

          {attribution.sourceUrl && (
            <div className="text-xs">
              <a
                href={attribution.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View on Wikimedia Commons →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Wikidata Link */}
      <div className="text-xs text-gray-500">
        <a
          href={`https://www.wikidata.org/wiki/${wikidataId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          View on Wikidata →
        </a>
      </div>
    </div>
  );
}
