import { v4 as uuidv4 } from "uuid";
import { ColumnType } from "@mapform/db";
import type { GeoJsonFeature } from "@infra-blocks/zod-utils/geojson";
import { parseType } from "./parse-type";

export function prepCell(row: GeoJsonFeature) {
  const properties = row.properties;
  const geometry = row.geometry;

  if (!properties || !geometry) {
    throw new Error("Feature is missing properties or geometry");
  }

  const propertiesWithId = Object.entries(properties).map(([key, val]) => {
    return {
      id: uuidv4(),
      key,
      type: parseType(val as unknown).type,
      value: val,
    };
  });

  const geometryWithId = {
    id: uuidv4(),
    key: "geometry",
    type: ColumnType.GEOMETRY,
    value: geometry,
  };

  return [...propertiesWithId, geometryWithId];
}
