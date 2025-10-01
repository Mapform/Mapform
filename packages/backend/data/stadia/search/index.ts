"server-only";

import { searchSchema } from "./schema";
import { env } from "../../../env.mjs";
import type { UnwrapReturn, PublicClient } from "../../../lib/types";
// Note: Using LocationIQ Autocomplete for suggestions

// LocationIQ Autocomplete response types
interface LocationIqAddress {
  name?: string; // House name or Point of Interest (POI)
  house_number?: string; // House or Building number
  road?: string; // Roads, Highways, Freeways, Motorways
  neighbourhood?: string; // Neighbourhoods, Allotments, Quarters, Communities
  suburb?: string; // Suburbs, Subdivisions
  city?: string; // Cities, Towns, Villages, Municipalities, Districts, Boroughs, Hamlets
  county?: string; // Counties
  state?: string; // States, Provinces, Regions, State Districts
  state_code?: string; // State or Province Code
  postcode?: string; // Postal Codes, Zipcodes
  country?: string; // Countries, Nation-states
  country_code?: string; // Country Code - 2 letter (ISO 3166-1 alpha-2)
}

interface LocationIqAutocompleteItem {
  place_id: string; // Unique identifier for the place.
  osm_id: string; // Unique identifier for the OpenStreetMap object.
  osm_type: string; // Type of OpenStreetMap object.
  licence: string; // License information for the data.
  lat: string; // Latitude of the location.
  lon: string; // Longitude of the location.
  boundingbox: [string, string, string, string]; // [min_lat, max_lat, min_lon, max_lon]
  class: string; // The category of this result
  type: string; // The 'type' of the class/category of this result
  display_name: string; // Formatted address for display.
  display_place: string; // Only the name part of the address.
  display_address: string; // The complete address without display_place.
  address?: LocationIqAddress; // Breakdown of the address into elements.
}

type LocationIqAutocompleteResponse = LocationIqAutocompleteItem[];

export const search = (authClient: PublicClient) =>
  authClient
    .schema(searchSchema)
    .action(async ({ parsedInput: { query, bounds } }) => {
      // Build LocationIQ Autocomplete request
      const url = new URL("https://us1.locationiq.com/v1/autocomplete");
      url.searchParams.set("key", env.LOCATION_IQ_API_KEY);
      url.searchParams.set("q", query);
      url.searchParams.set("limit", "10");
      // Bound results to current map bounds if provided
      if (bounds && bounds.length === 4) {
        const [minLon, minLat, maxLon, maxLat] = bounds;
        // viewbox format: left,top,right,bottom
        url.searchParams.set(
          "viewbox",
          `${minLon},${maxLat},${maxLon},${minLat}`,
        );
        url.searchParams.set("bounded", "1");
      }
      // Optionally bias by center via proximity-like behavior: not directly supported by LocationIQ,
      // leaving for future if needed.

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`LocationIQ autocomplete failed: ${response.status}`);
      }

      const x = (await response.json()) as LocationIqAutocompleteResponse;

      console.debug("search x: ", x);
      return x;
    });

export type Search = UnwrapReturn<typeof search>;
