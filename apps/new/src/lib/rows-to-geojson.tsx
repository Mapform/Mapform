import type { GetProject } from "@mapform/backend/data/projects/get-project";
import { getImageId } from "~/components/map/source";

/**
 * This function is mostly used for drawing to the map. It (currently) omits
 * cell info.
 */
export function rowsToGeoJSON(rows: NonNullable<GetProject["data"]>["rows"]) {
  return {
    type: "FeatureCollection",
    features: rows.map((row) => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        name: row.name,
        icon: row.icon,
        // Image id is used to load the image into the map
        flat_icon: getImageId(row.icon, null),
      },
    })),
  } satisfies GeoJSON.FeatureCollection;
}

export type RowGeoJSON = ReturnType<typeof rowsToGeoJSON>;
