"use client";

import { Feature, FeatureCollection, Position } from "geojson";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef } from "react";
import StaticMode from "@mapbox/mapbox-gl-draw-static-mode";

export function usePolygons({
  map,
  featureCollection,
}: {
  map?: mapboxgl.Map;
  featureCollection: FeatureCollection;
}) {
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (!map) return;

    const modes = MapboxDraw.modes;
    modes.static = StaticMode;
    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      modes,
      controls: {
        polygon: false,
        trash: false,
      },
      defaultMode: "static",
    });
    map.addControl(drawRef.current);

    return () => {
      if (drawRef.current) {
        map.removeControl(drawRef.current);
        drawRef.current = null;
      }
    };
  }, [map]);

  console.log(111, featureCollection);

  const tempFeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [
            [
              [-73.646208337, 45.424734716],
              [-73.628258979, 45.579610783],
              [-73.808183963, 45.509610024],
              [-73.646208337, 45.424734716],
            ],
          ],
          type: "Polygon",
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [
            [
              [-73.626383449, 45.460388248],
              [-73.546725073, 45.455601719],
              [-73.590066409, 45.494898717],
              [-73.626383449, 45.460388248],
            ],
          ],
          type: "Polygon",
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [
            [
              [-73.687323225, 45.49992176],
              [-73.555874321, 45.556174863],
              [-73.588253141, 45.412234488],
              [-73.684759914, 45.431330089],
              [-73.687323225, 45.49992176],
            ],
          ],
          type: "Polygon",
        },
      },
    ],
  } satisfies FeatureCollection;

  useEffect(() => {
    if (!map || !drawRef.current) return;

    const ids = drawRef.current.add(tempFeatureCollection);

    return () => {
      drawRef.current?.delete(ids);
    };
  }, [map, tempFeatureCollection]);
}

// {
//   "type": "FeatureCollection",
//   "features": [
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "coordinates": [
//           [
//             [
//               -73.62522378410685,
//               45.4716369796034
//             ],
//             [
//               -73.57974326168416,
//               45.4716369796034
//             ],
//             [
//               -73.57974326168416,
//               45.49721580990018
//             ],
//             [
//               -73.62522378410685,
//               45.49721580990018
//             ],
//             [
//               -73.62522378410685,
//               45.4716369796034
//             ]
//           ]
//         ],
//         "type": "Polygon"
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "coordinates": [
//           [
//             [
//               -73.65947879419878,
//               45.42901180771406
//             ],
//             [
//               -73.64596539713243,
//               45.44762448271922
//             ],
//             [
//               -73.61844478230364,
//               45.43972542632068
//             ],
//             [
//               -73.61918646884509,
//               45.46061631495991
//             ],
//             [
//               -73.67997876948203,
//               45.46130797080252
//             ],
//             [
//               -73.65947879419878,
//               45.42901180771406
//             ]
//           ]
//         ],
//         "type": "Polygon"
//       }
//     }
//   ]
// }
