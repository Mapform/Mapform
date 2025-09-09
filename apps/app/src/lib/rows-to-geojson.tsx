import type { GetProject } from "@mapform/backend/data/projects/get-project";
import { getImageId } from "~/lib/map/get-image-id";

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
        // Image id used for preloaded sprite; omit when no icon
        ...(row.icon ? { flat_icon: getImageId(row.icon, null) } : {}),
      },
    })),
  } satisfies GeoJSON.FeatureCollection;
}

export type RowGeoJSON = ReturnType<typeof rowsToGeoJSON>;
