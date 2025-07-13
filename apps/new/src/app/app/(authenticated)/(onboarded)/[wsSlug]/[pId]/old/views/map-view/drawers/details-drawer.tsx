import {
  XIcon,
  MapPinIcon,
  GlobeIcon,
  ClockIcon,
  PhoneIcon,
  MailIcon,
  StarIcon,
  ExternalLinkIcon,
  BuildingIcon,
  TagIcon,
} from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { useProject } from "../../../context";
import { useParamsContext } from "~/lib/params/client";
import { Separator } from "@mapform/ui/components/separator";
import { Badge } from "@mapform/ui/components/badge";
import { LoadingSkeleton } from "~/components/loading-skeleton";
import { useWikidataImage, useWikidataImages } from "~/lib/wikidata-image";
import {
  MapDrawer,
  MapDrawerActions,
  MapDrawerImages,
} from "~/components/map-drawer";

export function DetailsDrawer() {
  const { geoapifyPlaceDetails } = useProject();
  const {
    isPending,
    params: { geoapifyPlaceId },
    setQueryStates,
  } = useParamsContext();

  const place = geoapifyPlaceDetails?.features[0]?.properties;
  const wikidataId = place?.datasource?.raw?.wikidata;
  const {
    imageUrl: wikidataImage,
    attribution,
    isLoading: imageLoading,
  } = useWikidataImage(wikidataId);

  const {
    images,
    primaryImage,
    isLoading: imagesLoading,
  } = useWikidataImages(wikidataId);

  const formatOpeningHours = (hours: string) => {
    if (!hours) return null;

    // Parse opening hours in a more sophisticated way
    const days = hours.split(";").map((day) => day.trim());

    // Common day abbreviations mapping
    const dayMap: Record<string, string> = {
      mo: "Monday",
      tu: "Tuesday",
      we: "Wednesday",
      th: "Thursday",
      fr: "Friday",
      sa: "Saturday",
      su: "Sunday",
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
      sun: "Sunday",
    };

    return days
      .map((day) => {
        // Try to extract day and time
        const parts = day.split(" ");
        if (parts.length >= 2) {
          const dayAbbr = parts[0]?.toLowerCase() || "";
          const time = parts.slice(1).join(" ");
          const fullDayName = dayMap[dayAbbr] || dayAbbr;
          return `${fullDayName}: ${time}`;
        }
        return day;
      })
      .join("\n");
  };

  const formatCategories = (categories: string[]) => {
    if (categories.length === 0) return [];
    return categories.map((cat) => cat.trim()).filter(Boolean);
  };

  const getRatingStars = (rating: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return { fullStars, hasHalfStar };
  };

  const isOSMSource = place?.datasource?.sourcename === "openstreetmap";

  return (
    <MapDrawer open={!!geoapifyPlaceId}>
      <MapDrawerActions>
        <Button
          className="ml-auto"
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ geoapifyPlaceId: null });
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </MapDrawerActions>
      {isPending ? (
        <LoadingSkeleton />
      ) : place ? (
        <div className="space-y-6">
          {/* Cover Photo - Wikidata Image for OSM sources */}
          {/* {isOSMSource && (wikidataImage || imageLoading) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500">Cover Photo</span>
                {wikidataId && (
                  <Badge variant="outline" className="text-xs">
                    Wikidata
                  </Badge>
                )}
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                {imageLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : wikidataImage ? (
                  <Image
                    fill
                    src={wikidataImage}
                    alt={`${place.name_international?.en || "Place"} cover photo`}
                    className="h-32 w-full object-cover"
                  />
                ) : null}
              </div>
              {wikidataId && (
                <div className="space-y-1 text-xs text-gray-500">
                  <div>
                    Data from OpenStreetMap •
                    <a
                      href={`https://www.wikidata.org/wiki/${wikidataId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      View on Wikidata
                    </a>
                  </div>
                  {attribution && (
                    <div className="space-y-1">
                      {attribution.author && (
                        <div>Photo by: {attribution.author}</div>
                      )}
                      {attribution.license && (
                        <div>
                          License: {attribution.license}
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
                      {attribution.sourceUrl && (
                        <a
                          href={attribution.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View on Wikimedia Commons
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )} */}

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {place.name_international?.en || place.name || "Unnamed Place"}
            </h1>
            <MapDrawerImages images={images} />
            {place.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {(() => {
                    const stars = getRatingStars(place.rating);
                    if (!stars) return null;
                    return (
                      <>
                        {Array.from({
                          length: stars.fullStars,
                        }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        {stars.hasHalfStar && (
                          <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </>
                    );
                  })()}
                </div>
                <span className="text-sm text-gray-600">
                  {place.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Address */}
          {place.formatted && (
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">{place.formatted}</p>
                  {place.address_line1 && (
                    <p className="text-sm text-gray-600">
                      {place.address_line1}
                    </p>
                  )}
                  {place.address_line2 && (
                    <p className="text-sm text-gray-600">
                      {place.address_line2}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            {place.website && (
              <div className="flex items-center gap-3">
                <GlobeIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Visit website
                  <ExternalLinkIcon className="h-3 w-3" />
                </a>
              </div>
            )}

            {place.phone && (
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                <a
                  href={`tel:${place.phone}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {place.phone}
                </a>
              </div>
            )}

            {place.email && (
              <div className="flex items-center gap-3">
                <MailIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                <a
                  href={`mailto:${place.email}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {place.email}
                </a>
              </div>
            )}
          </div>

          {/* Opening Hours */}
          {place.opening_hours && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">
                    Opening Hours
                  </h3>
                </div>
                <div className="pl-8">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-600">
                    {formatOpeningHours(place.opening_hours)}
                  </pre>
                </div>
              </div>
            </>
          )}

          {/* Categories */}
          {place.categories && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <TagIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">
                    Categories
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 pl-8">
                  {formatCategories(place.categories).map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Additional Details */}
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <BuildingIcon className="h-5 w-5 flex-shrink-0 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
            </div>
            <div className="space-y-2 pl-8">
              {place.feature_type && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm capitalize text-gray-900">
                    {place.feature_type}
                  </span>
                </div>
              )}
              {place.building_type && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Building Type:</span>
                  <span className="text-sm capitalize text-gray-900">
                    {place.building_type}
                  </span>
                </div>
              )}
              {place.brand && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Brand:</span>
                  <span className="text-sm text-gray-900">{place.brand}</span>
                </div>
              )}
              {place.operator && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Operator:</span>
                  <span className="text-sm text-gray-900">
                    {place.operator}
                  </span>
                </div>
              )}
              {place.cuisine && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cuisine:</span>
                  <span className="text-sm capitalize text-gray-900">
                    {place.cuisine}
                  </span>
                </div>
              )}
              {place.price_level && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price Level:</span>
                  <span className="text-sm text-gray-900">
                    {"$".repeat(place.price_level)}
                  </span>
                </div>
              )}
              {place.wheelchair && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Wheelchair Access:
                  </span>
                  <span className="text-sm capitalize text-gray-900">
                    {place.wheelchair}
                  </span>
                </div>
              )}
              {place.internet_access && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Internet Access:
                  </span>
                  <span className="text-sm capitalize text-gray-900">
                    {place.internet_access}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Population Info */}
          {place.population && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">
                  Population
                </h3>
                <div className="space-y-1 pl-8">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current:</span>
                    <span className="text-sm text-gray-900">
                      {place.population.toLocaleString()}
                    </span>
                  </div>
                  {place.population_by_year && (
                    <div className="mt-2">
                      <p className="mb-1 text-xs text-gray-500">
                        Historical Data:
                      </p>
                      {Object.entries(place.population_by_year)
                        .sort(([a], [b]) => parseInt(b) - parseInt(a))
                        .slice(0, 3)
                        .map(([year, pop]) => (
                          <div key={year} className="flex justify-between">
                            <span className="text-xs text-gray-600">
                              {year}:
                            </span>
                            <span className="text-xs text-gray-900">
                              {typeof pop === "number"
                                ? pop.toLocaleString()
                                : pop}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Location Info */}
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Location</h3>
            <div className="space-y-1 pl-8">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Latitude:</span>
                <span className="text-sm text-gray-900">
                  {place.lat?.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Longitude:</span>
                <span className="text-sm text-gray-900">
                  {place.lon?.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Country:</span>
                <span className="text-sm text-gray-900">{place.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Region:</span>
                <span className="text-sm text-gray-900">{place.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">City:</span>
                <span className="text-sm text-gray-900">{place.city}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center rounded-lg bg-gray-50 p-8">
          <div className="text-center">
            <h3 className="text-foreground mt-2 text-sm font-medium">
              No feature found
            </h3>
          </div>
        </div>
      )}
    </MapDrawer>
  );
}
