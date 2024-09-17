import geoViewport from "@mapbox/geo-viewport";

export function estimateBounds(
  centerLatitude: number,
  centerLongitude: number,
  zoomLevel: number,
  viewboxWidth: number,
  viewboxHeight: number
): [[number, number], [number, number]] {
  const bounds = geoViewport.bounds(
    [centerLongitude, centerLatitude],
    zoomLevel,
    [viewboxWidth, viewboxHeight]
  );

  return [
    [bounds[1], bounds[0]],
    [bounds[3], bounds[2]],
  ];
}
