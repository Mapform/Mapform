import type { GetProject } from "@mapform/backend/data/projects/get-project";

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
        flat_icon: row.icon,
      },
    })),
  } satisfies GeoJSON.FeatureCollection;
}
