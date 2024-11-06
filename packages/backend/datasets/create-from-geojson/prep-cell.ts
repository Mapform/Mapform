import { v4 as uuidv4 } from "uuid";
import type { GeoJsonFeature } from "@infra-blocks/zod-utils/geojson";
import { parseType } from "./parse-type";

export function prepCell(row: GeoJsonFeature) {
  const properties = row.properties;
  const geometry = row.geometry;

  if (!properties || !geometry) {
    throw new Error("Feature is missing properties or geometry");
  }

  if (geometry.type !== "Point") {
    throw new Error("Geometry must be a point");
  }

  const propertiesWithId = Object.entries(properties).map(([key, val]) => {
    return {
      id: uuidv4(),
      key,
      type: parseType(val as unknown).type,
      value: parseType(val as unknown).value,
    };
  });

  const geometryWithId = {
    id: uuidv4(),
    key: "geometry",
    type: "point",
    value: geometry,
  };

  return [...propertiesWithId, geometryWithId];
}
