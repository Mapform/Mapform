import type {
  Feature,
  Point,
  LineString,
  Polygon,
  FeatureCollection,
} from "geojson";
import type {
  IconCell,
  Layer,
  RichtextCell,
  StringCell,
} from "@mapform/db/schema";

/**
 * BASE FEATURES
 *
 *  properties represent a partial feature, with only the necessary
 * properties to render the feature on the map.
 */
export type BaseProperties = {
  id: string;
  rowId: string;
  // This column corresponds to the GeoJson feaure (point, line, polygon) cell
  cellId: string;
  // This column corresponds to the GeoJson feature (point, line, polygon) column
  columnId: string;
  layerId: string;
  childLayerId: string;
  layerType: Layer["type"];

  // Layer values
  color: string | null;

  // Cell values
  icon: {
    value: IconCell["value"];
    columnId: string;
  } | null;
  title: {
    value: StringCell["value"];
    columnId: string;
  } | null;
};

export interface BaseGeoJsonPoint extends Feature<Point> {
  properties: BaseProperties;
}

export interface BaseGeoJsonLineString extends Feature<LineString> {
  properties: BaseProperties;
}

export interface BaseGeoJsonPolygon extends Feature<Polygon> {
  properties: BaseProperties;
}

export type BaseFeature =
  | BaseGeoJsonPoint
  | BaseGeoJsonLineString
  | BaseGeoJsonPolygon;

export type BaseFeatureCollection = FeatureCollection<
  Point | LineString | Polygon,
  BaseProperties
>;

/**
 * FULL FEATURES
 *
 * Full properties represent the entire feature
 */
export interface FullProperties extends BaseProperties {
  description: {
    value: RichtextCell["value"];
    columnId: string;
  } | null;
  properties: Record<string, unknown>; // TODO: We can add more specific types here
}

export interface FullGeoJsonPoint extends Feature<Point> {
  properties: FullProperties;
}

export interface FullGeoJsonLineString extends Feature<LineString> {
  properties: FullProperties;
}

export interface FullGeoJsonPolygon extends Feature<Polygon> {
  properties: FullProperties;
}

export type FullFeature =
  | FullGeoJsonPoint
  | FullGeoJsonLineString
  | FullGeoJsonPolygon;

export type FullFeatureCollection = FeatureCollection<
  Point | LineString | Polygon,
  FullProperties
>;

/**
 * If the feature has a rowId and columnId, it is a persisted feature
 */
export function isPersistedFeature(
  feature: BaseFeature | Feature,
): feature is BaseFeature {
  return (
    "rowId" in (feature.properties as BaseProperties) &&
    "columnId" in (feature.properties as BaseProperties)
  );
}
